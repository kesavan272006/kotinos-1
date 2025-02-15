import React, { useRef, useState, useEffect } from 'react';
import profileicon from '../assets/profileicon.svg';
import galleryicon from '../assets/gallery.svg';
import videoicon from '../assets/videoicon.svg';
import eventicon from '../assets/eventicon.svg';
import sachin from '../assets/sachin.jpg';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import Posts from './posts';
import FilePost from './FilePost';
import Modal from 'react-modal';
import LikeButton from './LikeButton';
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
    return (
        <>
            <h1 className='russo text-center mt-2 text-4xl'>POSTS</h1>
            <div className='w-full  md:mt-3 md:w-[50vw] h-[100vh] overflow-y-auto'>
                
                <div className='bg-white rounded-xl'>
                    <div className='flex justify-evenly pt-4'>
                        <img
                            src={profilepic||profileicon}
                            onClick={() => openModals(profilepic||profileicon)}
                            alt='profilepic'
                            className='h-[70px] w-[70px] rounded-full bg-gray-500'
                            style={{
                                height: '70px',
                                width: '70px',
                                borderRadius: '50%',
                                backgroundColor: 'gray',
                            }}
                        />
                        <input
                            onClick={() => postRef.current?.click()}
                            type="text"
                            placeholder="start a post"
                            className='rounded-lg h-[70px] w-[600px] bg-whitesmoke'
                            value={text}
                            style={{border:'1px solid black'}}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Posts ref={postRef} />
                        <FilePost ref={filePostRef} />
                    </div>
                    <div className='h-[50px] mt-2 flex flex-row justify-evenly'>
                        <div className='flex flex-row justify-center'>
                            <img
                                onClick={() => filePostRef.current?.click()}
                                src={galleryicon}
                                alt="photos"
                                className='h-[30px] w-[30px] rounded-full'
                            />
                            <h3>Photo</h3>
                        </div>
                        <div className='flex flex-row justify-center'>
                            <img
                                onClick={() => filePostRef.current?.click()}
                                src={videoicon}
                                alt="videos"
                                className='h-[30px] w-[30px] rounded-full'
                            />
                            <h3>Video</h3>
                        </div>
                        <div className='flex flex-row justify-center'>
                            <img
                                src={eventicon}
                                alt="events"
                                className='h-[30px] w-[30px] rounded-full'
                            />
                            <h3>Events</h3>
                        </div>
                    </div>
                </div>

                <div className='w-full mt-5 mb-7'>
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className='bg-white rounded-xl mb-5'
                        >
                            <div className='pl-5'>
                                <div className='flex flex-row'>
                                    <img
                                        src={post.profilepic||profileicon}
                                        alt={profileicon}
                                        style={{
                                            height: '80px',
                                            width: '80px',
                                            borderRadius: '50%',
                                            backgroundColor: 'gray',
                                            marginRight: '20px',
                                        }}
                                        onClick={() => openModals(post.profilepic||profileicon)}
                                    />
                                    {isModalOpened && (
                                            <div
                                            style={{
                                                position: 'fixed',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: 'rgba(86, 84, 84, 0.7)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                zIndex: 9999,
                                            }}
                                            onClick={closeModals}
                                            >
                                            <div
                                                style={{
                                                position: 'relative',
                                                maxWidth: '90%',
                                                maxHeight: '90%',
                                                }}
                                                onClick={(e) => e.stopPropagation()} 
                                            >
                                                <img
                                                src={modalImages}
                                                alt={profileicon}
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    borderRadius: '8px',
                                                }}
                                                />
                                                <button
                                                onClick={closeModals}
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    background: 'red',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '30px',
                                                    height: '30px',
                                                    fontSize: '18px',
                                                    cursor: 'pointer',
                                                }}
                                                >
                                                X
                                                </button>
                                            </div>
                                            </div>
                                        )}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <h1>{post.username}</h1>
                                        <h1>{post.role}</h1>
                                        <h3>{formatTimestamp(post.timestamp)}</h3>
                                    </div>
                                </div>
                                <br />
                                <h1>{post.textPost}</h1>
                            </div>
                            <div>
                                <strong className='text-2xl text-center'>
                                    {post.title}
                                </strong>
                                <h2>{post.description}</h2>
                            </div>
                            <br />
                            <br />
                            {post.images && post.images.length > 0 && (
                                <div className='flex flex-wrap gap-2 pl-2'>
                                    {post.images.slice(0, 3).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Post Image ${index}`}
                                            className='w-[100px] h-[100px] object-cover cursor-pointer'
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
                            <LikeButton />
                            <br />
                            <br />
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Image Modal"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        maxWidth: '80%',
                    },
                }}
            >
                <div className='flex justify-center'>
                    <img
                        src={imagesToDisplay[currentImageIndex]}
                        alt="Full view"
                        className='w-full max-h-[500px] object-contain'
                    />
                </div>
                <div className='flex justify-between'>
                    <button onClick={prevImage}>{"<"}</button>
                    <button onClick={nextImage}>{">"}</button>
                </div>
                <button onClick={closeModal} className='mt-2'>
                    Close
                </button>
            </Modal>
        </>
    );
};

export default Middle;