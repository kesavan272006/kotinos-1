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
            try {
                const usersRef = collection(database, 'Users');
                const usersSnapshot = await getDocs(usersRef);
    
                let allPosts = [];
    
                for (let userDoc of usersSnapshot.docs) {
                    const userId = userDoc.id;
                    const postRef = collection(database, 'Users', userId, 'Posts'); // Get posts from each user
    
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
    
                // Set the posts to the state
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

    return (
        <>
            <div style={{ width: '50vw', height: '100%', marginTop: '50px' }}>
                <div style={{ backgroundColor: 'white' }}>
                    <div
                        style={{
                            display: 'flex',
                            paddingTop: '20px',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                        }}
                    >
                        <img
                            src={profileicon}
                            alt="Profile"
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
                            style={{
                                borderRadius: '10px',
                                height: '70px',
                                width: '600px',
                                backgroundColor: 'whitesmoke',
                            }}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Posts ref={postRef} />
                        <FilePost ref={filePostRef} />
                    </div>
                    <div
                        style={{
                            height: '50px',
                            marginTop: '10px',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                        }}
                    >
                        <div
                            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
                        >
                            <img
                                onClick={() => filePostRef.current?.click()}
                                src={galleryicon}
                                alt="photos"
                                style={{ height: '30px', width: '30px', borderRadius: '50%' }}
                            />
                            <h3>Photo</h3>
                        </div>
                        <div
                            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
                        >
                            <img
                                onClick={() => filePostRef.current?.click()}
                                src={videoicon}
                                alt="videos"
                                style={{ height: '30px', width: '30px', borderRadius: '50%' }}
                            />
                            <h3>Video</h3>
                        </div>
                        <div
                            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
                        >
                            <img
                                src={eventicon}
                                alt="events"
                                style={{ height: '30px', width: '30px', borderRadius: '50%' }}
                            />
                            <h3>Events</h3>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        height: '100%',
                        width: '50vw',
                        marginTop: '20px',
                        marginBottom: '30px',
                    }}
                >
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            style={{
                                backgroundColor: 'white',
                                borderBottomWidth: '1px',
                                borderBottomStyle: 'solid',
                                borderBottomColor: 'black',
                                marginBottom: '20px',
                            }}
                        >
                            <div style={{ paddingLeft: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <img
                                        src={profileicon}
                                        alt="Icon"
                                        style={{
                                            height: '80px',
                                            width: '80px',
                                            borderRadius: '50%',
                                            backgroundColor: 'gray',
                                            marginRight: '20px',
                                        }}
                                    />
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
                                <strong style={{ fontSize: '30px', textAlign: 'center' }}>
                                    {post.title}
                                </strong>
                                <h2>{post.description}</h2>
                            </div>
                            <br />
                            <br />
                            {post.images && post.images.length > 0 && (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '10px',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    {post.images.slice(0, 3).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Post Image ${index}`}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => openModal(post.images, index)}
                                        />
                                    ))}
                                    {post.images.length > 3 && (
                                        <div
                                            onClick={() => openModal(post.images, 3)}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '100px',
                                                height: '100px',
                                                backgroundColor: '#e0e0e0',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                            }}
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
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={imagesToDisplay[currentImageIndex]}
                        alt="Full view"
                        style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={prevImage}>{"<"}</button>
                    <button onClick={nextImage}>{">"}</button>
                </div>
                <button onClick={closeModal} style={{ marginTop: '10px' }}>
                    Close
                </button>
            </Modal>
        </>
    );
};

export default Middle;
