import React, { useRef, useState, useEffect } from 'react';
import { MdOutlineInsertPhoto } from "react-icons/md";
import { RiMovieLine } from "react-icons/ri";
import { MdEvent } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import profileicon from '../assets/profileicon.svg';
import { Link, useNavigate } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, increment, arrayRemove, arrayUnion } from 'firebase/firestore';
import Posts from './posts';
import FilePost from './FilePost';
import Modal from 'react-modal';
import { CiHeart } from "react-icons/ci";
import { BiCommentDetail } from "react-icons/bi";
import CommentModal from './comments/commentmodal';
import hearticon from '../assets/hearticon2.svg'
import { FiSearch } from 'react-icons/fi';
import Events from './events';
import trophyicon from '../assets/trophyicon.svg'
import ReadMore from './Readmore';
import CricketMatches from '../pages/SportApiPages/eventdisplay';
const Middle = ({ userData }) => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const postRef = useRef(null);
    const filePostRef = useRef(null);
    const eventpostref = useRef(null);
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [openComment, setOpenComment]=useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagesToDisplay, setImagesToDisplay] = useState([]);
    const [profilepic, setprofilepic]=useState(null);
    const openModal = (images, index) => {
        setImagesToDisplay(images);
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };
    const [postId, setpostId]=useState(null);
    const [posterId, setPosterId]=useState(null);
    const handlenavigation = (userId)=>{
        navigate(`/displayQr/${userId}`);
    }
    const closeModal = () => {
        setIsModalOpen(false);
    };
    
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesToDisplay.length);
    };
    
    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? imagesToDisplay.length - 1 : prevIndex - 1
    );
};
useEffect(() => {
    const fetchUserData = async () => {
        const currentUser = auth.currentUser;
        
            if (currentUser) {
                const userRef = doc(database, 'Users', currentUser.uid);
                const userprofilepicref = doc(userRef, 'profileDetails', 'details');
                const userprofilesnap = await getDoc(userprofilepicref);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setUsername(userData.username || 'No Username');
                    setRole(userData.role || 'No Role');
                } else {
                    navigate('/signin');
                };
                if(userprofilesnap.exists()){
                    const profile = userprofilesnap.data();
                    setprofilepic(profile.profilePic || profileicon)
                }
            } else {
                navigate('/signin');
            }
        };

        fetchUserData();
    }, [navigate]);
    const getPost = async () => {
        try {
            const usersRef = collection(database, 'Users');
            const usersSnapshot = await getDocs(usersRef);

            let allPosts = [];

            for (let userDoc of usersSnapshot.docs) {
                const userId = userDoc.id;
                const postRef = collection(database, 'Users', userId, 'Posts');
                const postSnapshot = await getDocs(postRef);
                const postsData = postSnapshot.docs.map(async (doc) => {
                    const postData = doc.data();
                    const postId = doc.id;
                    const commentsRef = collection(database, 'Users', userId, 'Posts', postId, 'comments');
                    const commentsSnapshot = await getDocs(commentsRef);
                    const commentCount = commentsSnapshot.size;
                    const likedBy = postData.likedBy || [];
                    const liked = likedBy.includes(auth.currentUser?.uid);

                    return {
                        ...postData,
                        id: postId,
                        userId: userId,
                        commentCount: commentCount,
                        liked,
                        likesCount: postData.likes || 0,
                    };
                });

                const resolvedPosts = await Promise.all(postsData);
                allPosts = allPosts.concat(resolvedPosts);
            }

            const sortedPosts = allPosts.sort((a, b) => {
                const aTimestamp = a.timestamp?.seconds || 0;
                const bTimestamp = b.timestamp?.seconds || 0;
                return bTimestamp - aTimestamp;
            });

            setPosts(sortedPosts);
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };
    
    useEffect(() => {
        getPost();
    }, [posts]);
    
    
    const handlePost = async () => {
        if (text !== '') {
            try {
                const postDocument = doc(database, 'Users', `${auth.currentUser?.uid}`);
                const postRef = doc(postDocument, 'Posts', `${Math.random()}`);
                const postData = {
                    textPost: text,
                    username,
                    role,
                    imageURLs: file || '',
                    timestamp: new Date(),
                };
                await setDoc(postRef, postData);
                setText('');
                setFile(null);
                getPost();
            } catch (err) {
                console.error('Error posting:', err);
            }
        } else {
            alert('Please write something before posting!');
        }
    };

    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleString();
        }
        return '';
    };
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [modalImages, setModalImages] = useState('');
    const capital = (role)=>{
        if(role==='user'){
            return 'User'
        }
        else if(role==='coach'){
            return 'Coach'
        }
        else if(role==='athlete'){
            return 'Athlete'
        }
        else if(role==='organization'){
            return 'Organization '
        }
    }
    const openModals = (imageUrl) => {
        setModalImages(imageUrl);
        setIsModalOpened(true);
    };

    const closeModals = () => {
        setIsModalOpened(false);
    };
    const [likeicon, setlikeicon]=useState(false);
    const handlelikes = async (id, posterId) => {
        const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) return;

        try {
            const postDocument = doc(database, 'Users', `${posterId}`, 'Posts', id);
            const postSnapshot = await getDoc(postDocument);

            if (postSnapshot.exists()) {
                const postData = postSnapshot.data();
                const likedBy = postData.likedBy || [];
                const updatedPosts = posts.map(post => {
                    if (post.id === id) {
                        if (likedBy.includes(currentUserId)) {
                            updateDoc(postDocument, {
                                likes: increment(-1),
                                likedBy: arrayRemove(currentUserId),
                            });
                            return { ...post, liked: false, likesCount: post.likesCount - 1 };
                        } else {
                            updateDoc(postDocument, {
                                likes: increment(1),
                                likedBy: arrayUnion(currentUserId),
                            });
                            return { ...post, liked: true, likesCount: post.likesCount + 1 };
                        }
                    }
                    return post;
                });

                setPosts(updatedPosts);
                getPost();
            }
        } catch (err) {
            console.error("Error toggling like:", err);
        }
    };
    const [isEditing, setIsEditing]=useState(false);
    const handleediting = ()=>{
        setIsEditing(!isEditing);
    }
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(posts);
    const [defaults, setdefaults]=useState(true);
    const handleSearchChange = (event) => {
        const query = event.target.value;
        if(query==''){
            setdefaults(true);
        }else{
            setdefaults(false);
        }
        setSearchQuery(query);
        const filtered = posts.filter(user => 
            user.username.toLowerCase().includes(query.toLowerCase()) || 
            user.title?.toLowerCase().includes(query.toLowerCase()) || 
            user.description?.toLowerCase().includes(query.toLowerCase()) ||
            user.textPost?.toLowerCase().includes(query.toLowerCase()) ||
            user.role.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
    };
    const [showevents, setshowevents]=useState(false);
    const [showPosts, setShowPosts]=useState(true);
    const [showLive, setShowLive]=useState(false);
    const handleShowEvents = ()=>{
        setshowevents(true);
        setShowPosts(false);
        setShowLive(false);
    }
    const handleShowPosts = ()=>{
        setshowevents(false);
        setShowPosts(true);
        setShowLive(false);
    }
    const handleShowLive = ()=>{
        setshowevents(false);
        setShowPosts(false);
        setShowLive(true);
    }
    return (
        <>
        <div className='w-full flex justify-center items-center flex-col  pb-3 pt-0'>
        <h1 className='russo text-center pt-2 text-4xl w-full bg-white/70 shadow-sm'>POSTS</h1>

            <div className="flex items-center border border-gray-700 bg-gray-100 rounded-full px-3 mt-4 py-2 w-[90%] md:w-1/2 focus-within:border-blue-600 focus-within:bg-blue-100 focus-within:scale-[101%] md:ml-3">
                    <FiSearch className="text-gray-500" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search posts by username or role" 
                        className=" ml-2 text-gray-700 outline-none bg-transparent w-full" 
                    />
                </div>

                </div>
            
            <div className='w-[92%] ml-3 md:ml-5 md:mt-1 md:w-[50vw] h-[100vh] overflow-y-auto scrollbar-hide'>
            <div className="relative p-[2px] bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-500">
                
                <div className='bg-white p-4'>
                    <div className='flex justify-evenly pt-4'>
                        
                        <img src={profilepic||profileicon} onClick={() => openModals(profilepic||profileicon)} alt='profilepic' className='h-14 w-14 md:mt-4 rounded-full ml-1 bg-gray-300 '/>
                        <input onClick={() => postRef.current?.click()} type="text" placeholder="What's on your mind?" className='rounded-lg md:rounded-full border bg-[#1E3A8A] hover:bg-gradient-to-r hover:from-blue-900/5 hover:via-blue-700/5 hover:to-cyan-500/5 bg-opacity-[0.03] border-[#1E3A8A] mt-4 h-[3vh] md:h-[6vh] w-[90%] md:w-[80%] pl-3 ml-3' value={text} onChange={(e) => setText(e.target.value)}/>
                        <Posts ref={postRef} />
                        <FilePost ref={filePostRef} />
                        <Events ref={eventpostref} />
                    </div>
                    <hr className='w-[77.5%] ml-28 mb-4 mt-6 hidden md:block' />
                    <div className='h-[50px] flex flex-row justify-evenly md:mt-0 mt-3 md:ml-8'>
                        <div className='flex flex-row justify-center items-center mb-4 cursor-pointer rounded-full transition-all p-2 hover:bg-gradient-to-r hover:from-blue-900/15 hover:via-blue-700/15 hover:to-cyan-500/15' onClick={() => filePostRef.current?.click()}>
                            <MdOutlineInsertPhoto  alt="photos" className='h-[30px] w-[30px] rounded-full ' />
                            <h3 className='font-bold mt-1 ml-1 '>Photos</h3>
                        </div>
                        <div className='flex flex-row justify-center items-center mb-4 cursor-pointer rounded-full transition-all hover:bg-opacity-10 p-2 hover:bg-gradient-to-r hover:from-blue-900/15 hover:via-blue-700/15 hover:to-cyan-500/15' onClick={() => filePostRef.current?.click()}>
                            <RiMovieLine  alt="photos" className='h-[30px] w-[30px] rounded-full' />
                            <h3 className='font-bold mt-1 ml-1 '>Videos</h3>
                        </div>
                        <div className='flex flex-row justify-center items-center mb-4 cursor-pointer rounded-full transition-all hover:bg-opacity-10 p-2 hover:bg-gradient-to-r hover:from-blue-900/15 hover:via-blue-700/15 hover:to-cyan-500/15' onClick={() => eventpostref.current?.click()}>
                            <MdEvent  alt="photos" className='h-[30px] w-[30px] rounded-full' />
                            <h3 className='font-bold mt-1 ml-1 '>Events</h3>
                        </div>
                    </div>
                </div>
                </div>
                <br />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <button style={{marginRight: '10px', backgroundColor: showevents ? "blue":"rgb(219 234 254)", color: showevents? "white" : "rgb(29 78 216)"}} onClick={()=> handleShowEvents()} className="px-4 rounded-full text-sm py-2 transition duration-300">
                        View Events
                    </button>
                    <button style={{marginRight: '10px',backgroundColor: showPosts ? "blue":"rgb(219 234 254)", color: showPosts? "white" : "rgb(29 78 216)"}} onClick={()=> handleShowPosts()} className="px-4 py-2 text-sm rounded-full transition duration-300">
                        View All Posts
                    </button>
                    <button style={{backgroundColor: showLive ? "blue":"rgb(219 234 254)", color: showLive? "white" : "rgb(29 78 216)"}} onClick={()=> handleShowLive()} className="px-4 py-2 text-sm rounded-full transition duration-300">
                        View Live
                    </button>
                </div>
                </div>

                {defaults && (
                    <div className='w-full mt-5 mb-7'>
                    {showPosts && (
                        <>
                            {posts.map((post) => (
                        <div key={post.id} className='bg-white rounded-xl border  mb-5 pr-3'>
                        <div className='pl-5 pt-3'>
                                <div style={{position:'relative'}} className='flex flex-row'>
                                    <img src={post.profilepic||profileicon} alt={profileicon} className='mr-5 h-14 w-14 rounded-full bg-gray-300' onClick={() => openModals(post.profilepic||profileicon)}/>
                                    {isModalOpened && (
                                            <div
                                            className=''
                                            style={{
                                                position: 'fixed',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: 'rgba(92, 91, 91, 0.01)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                zIndex: 9999,
                                            }}
                                            onClick={closeModals}
                                            >
                                            <div className='mb-14 max-w-[80vw] max-h-[80vh]'
                                                
                                                onClick={(e) => e.stopPropagation()} 
                                            >
                                                <img
                                                className=''
                                                src={modalImages}
                                                alt={profileicon}
                                                style={{
                                                    width: '100%',
                                                    height: '90vh',
                                                    borderRadius: '4px',
                                                    
                                                }}
                                                />
                                                <button
                                                onClick={closeModals}
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    background: 'black',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '30px',
                                                    height: '30px',
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                }}
                                                >
                                                X
                                                </button>
                                            </div>
                                            </div>
                                        )}
                                    <Link to={`/otherprofile/${post.Id}`}>
                                        <div style={{display:'flex', flexDirection:'row'}}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    marginRight:'20px'
                                                }}
                                            >
                                                <h1 className='font-bold'>{post.username}</h1>
                                                <h1>{capital(post.role)}</h1>
                                            </div>
                                            <h3 className='absolute md:relative m-1 top-full md:ml-6 mt-1 text-sm text-gray-400'>{formatTimestamp(post.timestamp)}</h3>
                                        </div>
                                    </Link>
                                </div>
                            {post.enableCrowdFunding && (
                                    <>
                                        <button
                                            onClick={() => handlenavigation(post.Id)}
                                            style={{marginLeft:'5px'}}
                                            className="mt-1 -translate-y-14 -translate-x-4 md:translate-x-20 relative group left-[75%] px-2 border border-blue-300 text-blue-700 hover:border-blue-500 rounded-full h-7 p-2 font-bold text-sm flex items-center justify-center pr-4 origin-right"
                                            >
                                            {/* <span className="group-hover:hidden text-xl ">₹</span> */}
                                            <span className="px-2 ml-2">Fund</span>
                                        </button>
                                    </>   
                            )}
                            {post.isEvent && (
                                <strong>Event ✅🏆</strong>
                            )}
                            <h1 className='pt-5 mt-4 whitespace-pre-wrap'>{post.textPost}</h1>
                        </div>
                        <div>
                            <strong className='flex justify-start md:pl-6 pl-5 md:text-2xl text-[20px]'>
                                {post.title}
                            </strong>
                            {post.isEvent && (
                                <div style={{paddingLeft:'22px',display:'flex', flexDirection:'row', justifyContent:'start', alignItems:'center', alignContent:'center'}}>
                                    <h1>
                                        <strong>Organized by: {post.organizer}</strong> 
                                    </h1>
                                </div>
                            )}
                            {post.isEvent && (
                                <div style={{marginLeft:'22px'}}>
                                    <h1><strong>{post.eventstartdate && 'Event starts on '}</strong> {post.eventstartdate} {post.eventstarttime && 'at'} {post.eventstarttime}</h1>
                                    <h1><strong>{post.eventstartdate && 'Event ends on '}</strong> {post.eventenddate} {post.eventendtime && 'at'} {post.eventendtime}</h1>
                                    <h1><strong>{post.eventlocation && 'Event venue: '}</strong> {post.eventlocation} </h1>
                                </div>
                            )}
                            <br />
                            <h2 style={{marginLeft:'22px'}} className='text-base pr-2 whitespace-pre-wrap'><ReadMore text={post.description} /></h2>
                        </div>
                        {post.images && post.images.length > 0 && (
                            <div className='flex flex-col pl-5 py-1 pr-5'>
                                {post.images.slice(0, 1).map((image, index) => (
                                    <div className="flex bg-gray-50 justify-center rounded-lg py-2">
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Post Image ${index}`}
                                            className='w-fit h-fit md:max-h-[550px] md:max-w-[700px] rounded object-cover cursor-pointer'
                                            onClick={() => openModal(post.images, index)}
                                        />
                                    </div>

                                ))}
                                <br />
                                <div className='flex gap-2 justify-start '>
                                    {post.images.slice(1, 3).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Post Image ${index}`}
                                            className='w-[100px] h-[100px] rounded object-cover cursor-pointer mb-4 border '
                                            onClick={() => openModal(post.images, index)}
                                        />
                                    ))}
                                    {post.images.length > 3 && (
                                        <div
                                            onClick={() => openModal(post.images, 3)}
                                            className='flex justify-center items-center w-[100px] h-[100px] bg-gray-300 rounded cursor-pointer'
                                        >
                                            <span>+{post.images.length - 3}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <hr className='' />
                        <div  className="gap-10 my-0.5" style={{display:'flex', flexDirection:'row',}}>
                        
                            <div className=' ml-5 px-2 flex gap-1 items-center w-fit p-1'>
                            {!post.liked ? (
                                <CiHeart
                                    onClick={() => handlelikes(post.id, post.userId)}
                                    className='h-8 w-8 cursor-pointer scale-[80%]'
                                />
                            ) : (
                                <div onClick={() => handlelikes(post.id, post.userId)}>
                                    <img className='cursor-pointer' src={hearticon} alt="Liked" />
                                </div>
                            )}
                                {likeicon? <h1 className='text-blue-400'><strong>{post.likes}</strong></h1> : <h1><strong>{post.likes}</strong></h1>}
                            </div>
                            <div className='gap-3' style={{marginLeft:'0%', display:'flex', flexDirection:'row', justifyContent:'start', alignItems:'center'}}>
                                <button onClick={()=>{
                                    setOpenComment(true);
                                    setpostId(post.id);
                                    setPosterId(post.Id)
                                }}><BiCommentDetail className='scale-125' /></button>
                                <h1 className='font-bold'> {post.commentCount} </h1>
                            </div>
                        </div>
                    </div>
                    ))}
                        </>
                    )}
                    {showevents && (
                        <>
                            {posts.filter(post => post.isEvent === true).map((post) => (
                        <div key={post.id} className='bg-white rounded-xl border  mb-5'>
                        <div className='pl-5 pt-3'>
                                <div style={{position:'relative'}} className='flex flex-row'>
                                    <img src={post.profilepic||profileicon} alt={profileicon} className='mr-5 h-14 w-14 rounded-full bg-gray-300' onClick={() => openModals(post.profilepic||profileicon)}/>
                                    {isModalOpened && (
                                            <div
                                            className=''
                                            style={{
                                                position: 'fixed',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: 'rgba(92, 91, 91, 0.01)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                zIndex: 9999,
                                            }}
                                            onClick={closeModals}
                                            >
                                            <div className='mb-14 max-w-[80vw] max-h-[80vh]'
                                                
                                                onClick={(e) => e.stopPropagation()} 
                                            >
                                                <img
                                                className=''
                                                src={modalImages}
                                                alt={profileicon}
                                                style={{
                                                    width: '100%',
                                                    height: '90vh',
                                                    borderRadius: '4px',
                                                    
                                                }}
                                                />
                                                <button
                                                onClick={closeModals}
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    background: 'black',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '30px',
                                                    height: '30px',
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                }}
                                                >
                                                X
                                                </button>
                                            </div>
                                            </div>
                                        )}
                                    <Link to={`/otherprofile/${post.Id}`}>
                                        <div style={{display:'flex', flexDirection:'row'}}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    marginRight:'20px'
                                                }}
                                            >
                                                <h1 className='font-bold'>{post.username}</h1>
                                                <h1>{capital(post.role)}</h1>
                                            </div>
                                            <h3 className='absolute md:relative m-1 top-full md:ml-6 mt-1 text-sm text-gray-400'>{formatTimestamp(post.timestamp)}</h3>
                                        </div>
                                    </Link>
                                </div>
                            {post.enableCrowdFunding && (
                                    <>
                                        <button
                                            onClick={() => handlenavigation(post.Id)}
                                            style={{marginLeft:'5px'}}
                                            className="mt-1 -translate-y-14 -translate-x-4 md:translate-x-20 border border-blue-300 hover:border-blue-500 relative group left-[75%] px-2 text-blue-700 h-7 p-2 font-bold text-sm rounded-full flex items-center justify-center pr-4 origin-right"
                                            >
                                            {/* <span className="group-hover:hidden text-xl ">₹</span> */}
                                            <span className=" px-2 ml-2">Fund</span>
                                        </button>
                                    </>   
                            )}
                            {post.isEvent && (
                                <strong>Event ✅🏆</strong>
                            )}
                            <h1 className='pt-5 mt-4 whitespace-pre-wrap'>{post.textPost}</h1>
                        </div>
                        <div>
                            <strong className='flex justify-start md:pl-6 pl-5 md:text-2xl text-[20px]'>
                                {post.title}
                            </strong>
                            {post.isEvent && (
                                <div style={{paddingLeft:'22px',display:'flex', flexDirection:'row', justifyContent:'start', alignItems:'center', alignContent:'center'}}>
                                    <h1>
                                        <strong>Organized by: {post.organizer}</strong> 
                                    </h1>
                                </div>
                            )}
                            {post.isEvent && (
                                <div style={{marginLeft:'22px'}}>
                                    <h1><strong>{post.eventstartdate && 'Event starts on '}</strong> {post.eventstartdate} {post.eventstarttime && 'at'} {post.eventstarttime}</h1>
                                    <h1><strong>{post.eventstartdate && 'Event ends on '}</strong> {post.eventenddate} {post.eventendtime && 'at'} {post.eventendtime}</h1>
                                    <h1><strong>{post.eventlocation && 'Event venue: '}</strong> {post.eventlocation} </h1>
                                </div>
                            )}
                            <br />
                            <h2 style={{marginLeft:'22px'}} className='text-base pr-2 whitespace-pre-wrap'><ReadMore text={post.description} /></h2>
                        </div>
                        {post.images && post.images.length > 0 && (
                            <div className='flex flex-col pl-5 py-1 pr-5'>
                                {post.images.slice(0, 1).map((image, index) => (
                                    <div className="flex bg-gray-50 justify-center rounded-lg py-2">
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Post Image ${index}`}
                                            className='w-fit h-fit md:max-h-[550px] md:max-w-[700px] rounded object-cover cursor-pointer'
                                            onClick={() => openModal(post.images, index)}
                                        />
                                    </div>

                                ))}
                                <br />
                                <div className='flex gap-2 justify-start '>
                                    {post.images.slice(1, 3).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Post Image ${index}`}
                                            className='w-[100px] h-[100px] rounded object-cover cursor-pointer mb-4 border '
                                            onClick={() => openModal(post.images, index)}
                                        />
                                    ))}
                                    {post.images.length > 3 && (
                                        <div
                                            onClick={() => openModal(post.images, 3)}
                                            className='flex justify-center items-center w-[100px] h-[100px] bg-gray-300 rounded cursor-pointer'
                                        >
                                            <span>+{post.images.length - 3}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        <div  className="gap-10" style={{display:'flex', flexDirection:'row',}}>
                            <div className='mb-2 ml-5 mt-4 px-2 flex gap-1 items-center w-fit p-1'>
                            {!post.liked ? (
                                <CiHeart
                                    onClick={() => handlelikes(post.id, post.userId)}
                                    className='h-8 w-8 cursor-pointer scale-[80%]'
                                />
                            ) : (
                                <div onClick={() => handlelikes(post.id, post.userId)}>
                                    <img src={hearticon} alt="Liked" />
                                </div>
                            )}
                                {likeicon? <h1 className='text-blue-400'><strong>{post.likes}</strong></h1> : <h1><strong>{post.likes}</strong></h1>}
                            </div>
                            <div className='gap-3 mt-2' style={{marginLeft:'0%', display:'flex', flexDirection:'row', justifyContent:'start', alignItems:'center'}}>
                                <button onClick={()=>{
                                    setOpenComment(true);
                                    setpostId(post.id);
                                    setPosterId(post.Id)
                                }}><BiCommentDetail className='scale-125' /></button>
                                <h1 className='font-bold'> {post.commentCount} </h1>
                            </div>
                        </div>
                    </div>
                    ))}
                        </>
                    )}
                    {showLive && (
                        <CricketMatches />
                    )}
                </div>
                )}
                {!defaults && (
                    <div className='w-full mt-5 mb-7'>
                    {filteredUsers.map((post) => (
                        <div key={post.id} className='bg-white rounded-xl border  mb-5'>
                            <div className='pl-5 pt-3'>
                                    <div style={{position:'relative'}} className='flex flex-row'>
                                        <img src={post.profilepic||profileicon} alt={profileicon} className='mr-5 h-14 w-14 rounded-full bg-gray-300' onClick={() => openModals(post.profilepic||profileicon)}/>
                                        {isModalOpened && (
                                                <div
                                                className=''
                                                style={{
                                                    position: 'fixed',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    backgroundColor: 'rgba(92, 91, 91, 0.01)',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    zIndex: 9999,
                                                }}
                                                onClick={closeModals}
                                                >
                                                <div className='mb-14 max-w-[80vw] max-h-[80vh]'
                                                    
                                                    onClick={(e) => e.stopPropagation()} 
                                                >
                                                    <img
                                                    className=''
                                                    src={modalImages}
                                                    alt={profileicon}
                                                    style={{
                                                        width: '100%',
                                                        height: '90vh',
                                                        borderRadius: '4px',
                                                        
                                                    }}
                                                    />
                                                    <button
                                                    onClick={closeModals}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '10px',
                                                        right: '10px',
                                                        background: 'black',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '30px',
                                                        height: '30px',
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                    }}
                                                    >
                                                    X
                                                    </button>
                                                </div>
                                                </div>
                                            )}
                                        <Link to={`/otherprofile/${post.Id}`}>
                                            <div style={{display:'flex', flexDirection:'row'}}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        marginRight:'20px'
                                                    }}
                                                >
                                                    <h1 className='font-bold'>{post.username}</h1>
                                                    <h1>{capital(post.role)}</h1>
                                                    
                                                </div>
                                                <h3 className='absolute md:relative m-1 top-full md:ml-6 mt-1 text-sm text-gray-400'>{formatTimestamp(post.timestamp)}</h3>
                                            </div>
                                        </Link>
                                    </div>
                                {post.enableCrowdFunding && (
                                        <>
                                            <button
                                            onClick={() => handlenavigation(post.Id)}
                                            className="mt-1 -translate-y-14 -translate-x-4 md:translate-x-20 hover:scale-105 relative group left-[75%] px-2 border-blue-300 text-blue-700 hover:border-blue-500 border rounded-full h-7 p-2 font-bold text-sm transition-all duration-300 overflow-hidden flex items-center justify-center pr-4 origin-right"
                                          >
                                            {/* <span className="group-hover:hidden text-xl ">₹</span> */}
                                            <span className=" px-2 ml-2">Fund</span>
                                          </button>
                                          </>
                                          
                                            
                                    )}
                                <h1 className='pt-5 mt-4 whitespace-pre-wrap'>{post.textPost}</h1>
                            </div>
                            <div>
                                <strong className='flex justify-start md:pl-6 pl-5 md:text-2xl text-[20px] '>
                                    {post.title}
                                </strong>
                                <h2 className='pl-7 pr-2 text-lg whitespace-pre-wrap'><ReadMore text={post.description} /></h2>
                            </div>
                            {post.images && post.images.length > 0 && (
                                <div className='flex flex-col pl-5 py-1 pr-5'>
                                    {post.images.slice(0, 1).map((image, index) => (
                                        <div className="flex bg-gray-50 justify-center rounded-lg py-2">
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Post Image ${index}`}
                                                className='w-fit h-fit md:max-h-[550px] md:max-w-[700px] rounded object-cover cursor-pointer'
                                                onClick={() => openModal(post.images, index)}
                                            />
                                        </div>

                                    ))}
                                    <br />
                                    <div className='flex gap-2 justify-start '>
                                        {post.images.slice(1, 3).map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Post Image ${index}`}
                                                className='w-[100px] h-[100px] rounded object-cover cursor-pointer mb-4 border '
                                                onClick={() => openModal(post.images, index)}
                                            />
                                        ))}
                                        {post.images.length > 3 && (
                                            <div
                                                onClick={() => openModal(post.images, 3)}
                                                className='flex justify-center items-center w-[100px] h-[100px] bg-gray-300 rounded cursor-pointer'
                                            >
                                                <span>+{post.images.length - 3}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            <div  className="gap-10" style={{display:'flex', flexDirection:'row',}}>
                                <div className='mb-2 ml-5 mt-4 px-2 flex gap-1 items-center w-fit p-1'>
                                {!post.liked ? (
                                    <CiHeart
                                        onClick={() => handlelikes(post.id, post.userId)}
                                        className='h-8 w-8 cursor-pointer scale-[80%]'
                                    />
                                ) : (
                                    <div onClick={() => handlelikes(post.id, post.userId)}>
                                        <img src={hearticon} alt="Liked" />
                                    </div>
                                )}
                                    {likeicon? <h1 className='text-blue-400'><strong>{post.likes}</strong></h1> : <h1><strong>{post.likes}</strong></h1>}
                                </div>
                                <div className='gap-3 mt-2' style={{marginLeft:'0%', display:'flex', flexDirection:'row', justifyContent:'start', alignItems:'center'}}>
                                    <button onClick={()=>{
                                        setOpenComment(true);
                                        setpostId(post.id);
                                        setPosterId(post.Id)
                                    }}><BiCommentDetail className='scale-125' /></button>
                                    <h1 className='font-bold'> {post.commentCount} </h1>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </div>
            {openComment && postId && (
                <CommentModal
                    postId={postId} 
                    posterId={posterId}
                    onClose={() => setOpenComment(false)}
              />
      
            )}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Image Modal"
                className="bg-white p-5 rounded-lg shadow-lg outline-none md:w-[80%] md:h-[95%]"
                overlayClassName="fixed z-20 inset-0 bg-black bg-opacity-30 flex justify-center items-center"
            >
                <div className='flex justify-center'>
                    <img
                        src={imagesToDisplay[currentImageIndex]}
                        alt="Full view"
                        className=' h-[400px] w-[800px] md:h-[600px] md:w-[80%] object-contain'
                    />
                </div>
                <div className='flex justify-between'>
                    <button className='text-xl font-bold russo ml-10' onClick={prevImage}>{"<"}</button>
                    <button className='text-xl font-bold russo mr-10' onClick={nextImage}>{">"}</button>
                </div>
                <button onClick={closeModal} className='mt-4 bg-black text-white rounded-lg px-3 py-1 font-bold hover:scale-105 transition-all'>
                    Close
                </button>
            </Modal>
        </>
    );
};

export default Middle;