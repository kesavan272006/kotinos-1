import React, { useRef, useState, useEffect } from 'react';
import profileicon from '../assets/profileicon.svg';
import galleryicon from '../assets/gallery.svg';
import videoicon from '../assets/videoicon.svg';
import eventicon from '../assets/eventicon.svg';
import sachin from '../assets/sachin.jpg'; // Placeholder image for posts
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import Posts from './posts';
import FilePost from './FilePost';

const Middle = ({ userData }) => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const postRef = useRef(null);
    const filePostRef = useRef(null);
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState('');
    const [file, setFile] = useState(null); // To handle file upload

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
                    imageURL: file || '', // Store the Base64 image URL
                    timestamp: new Date(),
                };
                await setDoc(postRef, postData);
                setText('');
                setFile(null);
                getPost(); // Refresh posts after posting
            } catch (err) {
                console.error('Error posting:', err);
            }
        } else {
            alert('Please write something before posting!');
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile(reader.result); // Store the Base64 URL of the file
            };
            reader.readAsDataURL(selectedFile);
        }
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
                                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                                    >
                                        <h1>{post.username}</h1>
                                        <h1>{post.role}</h1>
                                    </div>
                                </div>
                                <br />
                                <h1>{post.textPost}</h1>
                            </div>
                            <br />
                            <br />
                            {post.imageURL && (
                                <div
                                    style={{
                                        width: '50vw',
                                        height: '100%',
                                        paddingLeft: '10px',
                                        paddingRight: '10px',
                                    }}
                                >
                                    <img
                                        src={post.imageURL}
                                        alt="post image"
                                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            <br />
                            <br />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Middle;
