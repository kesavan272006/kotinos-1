import React, { forwardRef, useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import { Button } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import { getDoc } from 'firebase/firestore';
import addicon from '../assets/addicon.svg';
import deleteicon from '../assets/deleteicon.svg';
import profileicon from '../assets/profileicon.svg';
import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
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
    maxHeight: '90vh',  
    overflowY: 'auto', 
  },
};

Modal.setAppElement('#root');

const FilePost = (props, ref) => {
  const fileRef = useRef(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userData, setUserData] = useState([]);
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [profiledata, setprofiledata]=useState('');
  const [isfunding, setIsfunding]=useState(false);
  const [role, setrole]=useState("");
  const user = auth.currentUser;
  useEffect(() => {
    const fetchProfile2 = async () => {
        
        if (user) {
            try {
                const docRef = doc(database, "Users", auth.currentUser?.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const reference = docSnap.data();
                    setrole(reference.role);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                navigate('/signin');
            }
        }
        return () => clearTimeout(timer);
    };
    
    fetchProfile2();
  }, [role]);
  const getUserData = async () => {
    try {
      const userDocument = doc(database, 'Users', `${auth.currentUser?.uid}`);
      const data = await getDoc(userDocument);
      const userprofiledata = doc(userDocument, "profileDetails", "details");
      const profiledatas = await getDoc(userprofiledata);
      const profilesnap = profiledatas.data();
      setprofiledata(profilesnap.profilePic || profileicon);
      setUserData(data);
    } catch (err) {
      console.log(err);
    }
  };
  const decidingathlete = role === 'athlete'; 
  const decidingcoach = role === 'coach'; 
  const decidinguser = role === 'user';
  const decidingorganization = role === 'organization';
  useEffect(() => {
    getUserData();
  }, []);

  const openModal = () => {
    setTimeout(() => {
      if (fileRef.current) {
        fileRef.current.click();
      }
    }, 200);
    setIsOpen(true);
  };

  const closeModal = () => {
    setDescription("");
    setTitle("");
    setIsfunding(false);
    setFiles([]);
    setIsOpen(false);
  };

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setImageModalIsOpen(true);
  };

  const closeImageModal = () => {
    setImageModalIsOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % files.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? files.length - 1 : prevIndex - 1
    );
  };
  const handleSwitchChange = (event) => {
    if (event.target.checked) {
      setIsfunding(true);
    } else {
      setIsfunding(false);  
    }
  };
  const [achievement, setAchievement]=useState(false);
  const handleAchievement = (event) => {
    if (event.target.checked) {
      setAchievement(true);
    } else {
      setAchievement(false);  
    }
  };
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length) {
      const filesArray = Array.from(selectedFiles).map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filesArray).then((fileURLs) => {
        setFiles([...files, ...fileURLs]);
      });
    }
  };

  const deleteFile = (index) => {
    setFiles(files.filter((_, idx) => idx !== index));
  };

  const addPost = async () => {
    if (files.length > 0 && title !== '' && description !== '') {
      try {
        const postDocument = doc(database, 'Users', `${auth.currentUser?.uid}`);
        const postRef = doc(postDocument, 'Posts', `${Math.random()}`);
        await setDoc(postRef, {
          username: userData._document?.data?.value.mapValue.fields.username.stringValue,
          role: userData._document?.data?.value.mapValue.fields.role.stringValue,
          title: title,
          description: description,
          images: files,
          timestamp: new Date(),
          profilepic: `${profiledata}`,
          Id: auth.currentUser?.uid,
          enableCrowdFunding: isfunding,
          isAchievement: achievement,
          likes: 0,
          likedBy: [],
          comments: [],
        });
        setIsOpen(false);
        setTitle('');
        setDescription('');
        setFiles([]);
        setIsfunding(false);
        setAchievement(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('Please add title, description, and images before posting.');
    }
  };

  return (
    <div>
      <button ref={ref} style={{ display: 'none' }} onClick={openModal}>
        Open Modal
      </button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Add Images">
        <input onChange={handleFileChange} type="file" multiple style={{ display: 'none' }} ref={fileRef} />
        <h2 style={{ color: 'black', fontSize: '30px', marginBottom: '20px' }}>Add a post</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
          }}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Post Description"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            minHeight: '100px',
            borderRadius: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
          }}
        />
        <div className="preview-images" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {files.slice(0, 3).map((file, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={file}
                alt={`Preview ${index}`}
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                }}
              />
              <img
                src={deleteicon}
                onClick={() => deleteFile(index)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '20px',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)',
                }}
              />
            </div>
          ))}
          {files.length > 3 && (
            <div
              onClick={() => openImageModal(3)}
              style={{
                width: '200px',
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#e0e0e0',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#333',
              }}
            >
              +{files.length - 3}
            </div>
          )}
        </div>
        <br />
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
          <input onChange={handleFileChange} type="file" multiple ref={fileRef} style={{ display: 'none' }} />
          <button
            onClick={() => fileRef.current.click()}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <img src={addicon} alt="Add files" style={{ width: '30px', height: '30px' }} />
          </button>
          <h1><strong>Add Images</strong></h1>
        </div>
        <br />
        {decidingathlete && (
          <>
              <div style={{display:'flex',flexDirection:'row', justifyContent:'center'}}>
                <Switch
                  onChange={handleSwitchChange} 
                />
                <h1 style={{color:'black'}}><strong>Enable Crowdfunding for this post</strong></h1>
              </div>
              <br />
              <div style={{display:'flex',flexDirection:'row', justifyContent:'center'}}>
                <Switch
                  onChange={handleAchievement} 
                />
                <h1 style={{color:'black'}}><strong>Add this post to your achievements section</strong></h1>
              </div>
          </>
        
        )}
        {decidingcoach && (
          <>
              <div style={{display:'flex',flexDirection:'row', justifyContent:'center'}}>
                <Switch
                  onChange={handleSwitchChange} 
                />
                <h1 style={{color:'black'}}><strong>Enable Crowdfunding for this post</strong></h1>
              </div>
              <br />
              <div style={{display:'flex',flexDirection:'row', justifyContent:'center'}}>
                <Switch
                  onChange={handleAchievement} 
                />
                <h1 style={{color:'black'}}><strong>Add this post to your achievements section</strong></h1>
              </div>
          </>
        )}
        {decidingorganization && (
          <>
              <div style={{display:'flex',flexDirection:'row', justifyContent:'center'}}>
                <Switch
                  onChange={handleSwitchChange} 
                />
                <h1 style={{color:'black'}}><strong>Enable Crowdfunding for this post</strong></h1>
              </div>
              <br />
              <div style={{display:'flex',flexDirection:'row', justifyContent:'center'}}>
                <Switch
                  onChange={handleAchievement} 
                />
                <h1 style={{color:'black'}}><strong>Add this post to your achievements section</strong></h1>
              </div>
          </>
        )}
        <div className="modal-buttons" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" className="closeButton" onClick={closeModal}>
            Close
          </Button>
          <Button variant="contained" className="postButton bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-500 " onClick={addPost}>
            Post
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={imageModalIsOpen}
        onRequestClose={closeImageModal}
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
            src={files[currentImageIndex]}
            alt="Full view"
            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={prevImage} style={{ padding: '10px' }}>
            {"<"}
          </button>
          <Button
            onClick={() => {
              setImageToDelete(files[currentImageIndex]);
              deleteFile(currentImageIndex);
              closeImageModal();
            }}
            style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}
          >
            Delete
          </Button>
          <button onClick={nextImage} style={{ padding: '10px' }}>
            {">"}
          </button>
        </div>
        <button onClick={closeImageModal} style={{ marginTop: '10px' }}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default forwardRef(FilePost);
