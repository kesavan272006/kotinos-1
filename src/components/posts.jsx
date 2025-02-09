import React, { forwardRef, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { doc, setDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import { getDoc } from 'firebase/firestore';
import profileicon from '../assets/profileicon.svg';
import { useNavigate } from 'react-router-dom';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    minWidth: '400px',
  },
};

Modal.setAppElement('#root');

const Posts = (props, ref) => {
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const getUserData = async () => {
    try {
      const userDoc = doc(database, 'Users', `${auth.currentUser?.uid}`);
      const data = await getDoc(userDoc);
      setUserData(data.data());
      getAllPosts(data.data().connections); 
    } catch (err) {
      console.log(err);
    }
  };
  const [username, setUsername]=useState('');
  const [role, setRole]=useState('');
  const [profilepic, setprofilepic]=useState(null);
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
  const getAllPosts = async (connections) => {
    try {
      const postsQuery = query(collection(database, 'Posts'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(postsQuery);
      const allPosts = [];

      querySnapshot.forEach((doc) => {
        const post = doc.data();
        const isConnection = connections.includes(post.username);
        allPosts.push({ ...post, id: doc.id, isConnection });
      });
      setPosts(allPosts);
    } catch (err) {
      console.log(err);
    }
  };

  const addPost = async () => {
    const postDocument = doc(database, 'Users', `${auth.currentUser?.uid}`);
    const postRef = doc(postDocument, 'Posts', `${Math.random()}`);
    try {
      if (text !== '') {
        await setDoc(postRef, {
          textPost: text,
          username: userData.username,
          role: userData.role,
          timestamp: new Date(),
          profilepic: profilepic,
        });
        getAllPosts(userData.connections);
      } else {
        alert('Trying to post?? but without adding your thoughts through text??...');
      }
    } catch (err) {
      console.log(err);
    }
    setIsOpen(false);
    setText('');
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div>
      <button ref={ref} style={{ display: 'none' }} onClick={openModal}>
        Open Modal
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Create a Post"
      >
        <h2 style={{ color: 'black', fontSize: '30px', marginBottom: '20px' }}>What do you want to talk about?</h2>
        <br />
        <TextField
          id="outlined-multiline-static"
          label="Add your thoughts here..."
          multiline
          rows={4}
          onChange={(e) => setText(e.target.value)}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'black',
              borderRadius: '5px',
            },
            '& .MuiInputLabel-root': {
              backgroundColor: 'white',
              paddingLeft: '5px',
              paddingRight: '5px',
            },
          }}
        />
        <div className="modal-buttons">
          <Button variant="outlined" className="closeButton" onClick={closeModal}>
            Close
          </Button>
          <Button variant="contained" className="postButton" onClick={addPost}>
            Post
          </Button>
        </div>
      </Modal>

      <div style={{ marginTop: '30px' }}>
        {posts.map((post) => (
          <div key={post.id} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            {post.isConnection && (
              <div style={{ color: 'green', fontWeight: 'bold', marginBottom: '10px' }}>Connection Post</div>
            )}
            <h3 style={{ marginBottom: '10px' }}>{post.username}</h3>
            <p>{post.textPost}</p>
            <p style={{ fontSize: '12px', color: '#888' }}>
              {new Date(post.timestamp.seconds * 1000).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default forwardRef(Posts);
