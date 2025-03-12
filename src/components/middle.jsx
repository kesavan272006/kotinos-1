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
import { Button } from '@mui/material';
import likebutton from '../assets/likebutton.svg'
import commenticon from '../assets/comment.svg'
import { CiHeart } from "react-icons/ci";
import liked from '../assets/liked.svg';


const Middle = ({ userData }) => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const postRef = useRef(null);
    const filePostRef = useRef(null);
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagesToDisplay, setImagesToDisplay] = useState([]);
    const [profilepic, setprofilepic]=useState(null);
    const openModal = (images, index) => {
        setImagesToDisplay(images);
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };
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
        setTimeout(async () => {
            try {
                const usersRef = collection(database, 'Users');
                const usersSnapshot = await getDocs(usersRef);
    
                let allPosts = [];
    
                for (let userDoc of usersSnapshot.docs) {
                    const userId = userDoc.id;
                    const postRef = collection(database, 'Users', userId, 'Posts');
    
                    const postSnapshot = await getDocs(postRef);
                    const postsData = postSnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                        userId: userId,
                    }));
    
                    allPosts = allPosts.concat(postsData);
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
        }, 1000);
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
                
                if (likedBy.includes(currentUserId)) {
                    await updateDoc(postDocument, {
                        likes: increment(-1),
                        setlikeicon: false,
                        likedBy: arrayRemove(currentUserId)
                    });
                } else {
                    await updateDoc(postDocument, {
                        likes: increment(1), 
                        likedBy: arrayUnion(currentUserId),
                        setlikeicon: true,
                    });
                }
            }
            getPost();
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };
    const [isEditing, setIsEditing]=useState(false);
    const handleediting = ()=>{
        setIsEditing(!isEditing);
    }
    return (
        <>
            <h1 className='russo text-center mt-2 text-4xl w-full '>POSTS</h1>
            <div className='w-[92%] ml-3 md:ml-5 md:mt-1 md:w-[50vw] h-[100vh] overflow-y-auto scrollbar-hide'>
            <div className="relative p-[2px] rounded-xl bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-500">
                
                <div className='bg-white rounded-xl p-4'>
                    <div className='flex justify-evenly pt-4'>
                        
                        <img src={profilepic||profileicon} onClick={() => openModals(profilepic||profileicon)} alt='profilepic' className='h-14 w-14 md:mt-4 rounded-full ml-1 bg-gray-300 '/>
                        <input onClick={() => postRef.current?.click()} type="text" placeholder="What's on your mind?" className='rounded-lg md:rounded-full border bg-[#1E3A8A] hover:bg-gradient-to-r hover:from-blue-900/5 hover:via-blue-700/5 hover:to-cyan-500/5 bg-opacity-[0.03] border-[#1E3A8A] mt-4 h-[3vh] md:h-[6vh] w-[90%] md:w-[80%] pl-3 ml-3' value={text} onChange={(e) => setText(e.target.value)}/>
                        <Posts ref={postRef} />
                        <FilePost ref={filePostRef} />
                        
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
                        <div className='flex flex-row justify-center items-center mb-4 cursor-pointer rounded-full transition-all hover:bg-opacity-10 p-2 hover:bg-gradient-to-r hover:from-blue-900/15 hover:via-blue-700/15 hover:to-cyan-500/15' onClick={() => filePostRef.current?.click()}>
                            <MdEvent  alt="photos" className='h-[30px] w-[30px] rounded-full' />
                            <h3 className='font-bold mt-1 ml-1 '>Events</h3>
                        </div>
                    </div>
                </div>
                </div>

                <div className='w-full mt-5 mb-7'>
                    {posts.map((post) => (
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
                                                    <h1>{post.role}</h1>
                                                    
                                                </div>
                                                <h3 className='absolute md:relative m-1 top-full md:ml-6 mt-1 text-sm text-gray-400'>{formatTimestamp(post.timestamp)}</h3>
                                            </div>
                                        </Link>
                                    </div>
                                {post.enableCrowdFunding && (
                                        <>
                                            <button
                                            onClick={() => handlenavigation(post.Id)}
                                            className="mt-1 -translate-y-14 -translate-x-4 md:translate-x-20 hover:scale-105 relative group left-[75%] px-2 bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-500 text-white h-7 p-2 font-bold text-sm transition-all duration-300 rounded-lg overflow-hidden flex items-center justify-center pr-4 origin-right"
                                          >
                                            {/* <span className="group-hover:hidden text-xl ">₹</span> */}
                                            <span className=" px-2 ml-2">FUND</span>
                                          </button>
                                          </>
                                          
                                            
                                    )}
                                <h1 className='pt-5 mt-4'>{post.textPost}</h1>
                            </div>
                            <div>
                                <strong className='text-2xl text-center pl-6'>
                                    {post.title}
                                </strong>
                                <h2 className='pl-7 text-lg'>{post.description}</h2>
                            </div>
                            {post.images && post.images.length > 0 && (
                                <div className='flex flex-wrap gap-2 pl-5'>
                                    {post.images.slice(0, 3).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Post Image ${index}`}
                                            className='w-[100px] h-[100px] object-cover rounded-xl cursor-pointer'
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
                                
                            )}
                            
                            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>
                                <div className='mb-2 ml-5 mt-4 px-2 flex gap-1 items-center w-fit hover:bg-gradient-to-r hover:from-blue-900/20 hover:via-blue-700/20 hover:to-cyan-500/20 rounded-xl p-1'>
                                    <CiHeart  onClick={() => handlelikes(post.id, post.userId)} className='h-8 w-8  cursor-pointer scale-[80%]'/>
                                    {likeicon? <h1 className='text-blue-400'><strong>{post.likes}</strong></h1> : <h1><strong>{post.likes}</strong></h1>}
                                </div>
                                <div style={{marginLeft:'0%', display:'flex', flexDirection:'row', justifyContent:'start', alignItems:'center'}}>
                                    <Button ><img src={commenticon} /></Button>
                                    <h1 style={{fontSize:'25px'}}><strong>Comments</strong></h1>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Image Modal"
                className="bg-white p-5 rounded-lg shadow-lg outline-none md:w-[80%] md:h-[95%]"
                overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center"
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