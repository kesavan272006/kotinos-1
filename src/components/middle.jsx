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

const Middle = ({ userData }) => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const postRef = useRef(null);
    const filePostRef = useRef(null);
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);

    // Modal setup for image display
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagesToDisplay, setImagesToDisplay] = useState([]);

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
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setUsername(userData.username || 'No Username');
                    setRole(userData.role || 'No Role');
                } else {
                    navigate('/signin');
                }
            } else {
                navigate('/signin');
            }
        };

        fetchUserData();
    }, [navigate]);

    const getPost = async () => {
        setTimeout(async () => {
            const postDocument = doc(database, 'Users', `${auth.currentUser?.uid}`);
            const postRef = collection(postDocument, 'Posts');
            try {
                const data = await getDocs(postRef);
                const filteredData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setPosts(filteredData);
            } catch (err) {
                console.error(err);
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

    return (
        <>
            <div className='w-full mt-4 md:w-[50vw] h-full'>
                <div className='bg-white'>
                    <div className='flex justify-evenly pt-4'>
                        <img
                            src={profileicon}
                            alt="Profile"
                            className='h-[70px] w-[70px] rounded-full bg-gray-500'
                        />
                        <input
                            onClick={() => postRef.current?.click()}
                            type="text"
                            placeholder="start a post"
                            className='rounded-lg h-[70px] w-[600px] bg-whitesmoke'
                            value={text}
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
                            className='bg-white border-b border-black mb-5'
                        >
                            <div className='pl-5'>
                                <div className='flex flex-row'>
                                    <img
                                        src={profileicon}
                                        alt="Icon"
                                        className='h-[80px] w-[80px] rounded-full bg-gray-500 mr-5'
                                    />
                                    <div className='flex flex-col justify-center'>
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
                            <br />
                            <br />
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for image display */}
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