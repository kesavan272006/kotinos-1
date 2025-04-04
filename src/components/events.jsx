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
import trophyicon from '../assets/trophyicon.svg'
import { IoMdAdd } from "react-icons/io";
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

const Events = (props, ref) => {
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
  const [organizer, setorganizer]=useState('');
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
    setorganizer('');
    setIsOpen(false);
    seteventstartdate(null);
    seteventenddate(null);
    seteventstarttime(null);
    seteventendtime(null);
    seteventlocation(null);
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
  const [eventstartdate,seteventstartdate]=useState(null);
  const [eventenddate, seteventenddate]=useState(null);
  const [eventstarttime, seteventstarttime]=useState(null);
  const [eventendtime, seteventendtime]=useState(null);
  const [eventlocation,seteventlocation]=useState(null);
  const addPost = async () => {
    if (title !== '' && description !== '' && eventstartdate!==null) {
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
          likes: 0,
          likedBy: [],
          comments: [],
          isEvent: true,
          organizer: organizer,
          eventstartdate: eventstartdate,
          eventenddate: eventenddate,
          eventstarttime: eventstarttime,
          eventendtime: eventendtime,
          eventlocation: eventlocation,
        });
        setTitle('');
        setDescription('');
        setFiles([]);
        setIsfunding(false);
        setAchievement(false);
        setorganizer('');
        seteventstartdate(null);
        seteventenddate(null);
        seteventstarttime(null);
        seteventendtime(null);
        seteventlocation(null);
        setIsOpen(false);
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
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <h2 style={{ color: 'black', fontSize: '30px', marginBottom: '20px' }}>Post about an Event</h2>
            <img src={trophyicon} style={{ marginBottom: '6px', verticalAlign: 'middle', marginLeft: '10px' }} />
        </div>
        <h1>Name of the event:</h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Name of the event"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
          }}
        />
        <h1>Name of the organizer:</h1>
        <input
          type="text"
          value={organizer}
          onChange={(e) => setorganizer(e.target.value)}
          placeholder="Event Organizer"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
          }}
        />
        <h1>Starting date of the event:</h1>
        <input
          type="date"
          value={eventstartdate}
          onChange={(e) => seteventstartdate(e.target.value)}
          placeholder="Event starting Date"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
          }}
        />
        <h1>Starting time of the event:</h1>
        <input
          type="time"
          value={eventstarttime}
          onChange={(e) => seteventstarttime(e.target.value)}
          placeholder="Event starting Time"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
          }}
        />
        <h1>Ending date of the event:</h1>
        <input
          type="date"
          value={eventenddate}
          onChange={(e) => seteventenddate(e.target.value)}
          placeholder="Event ending Date"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
          }}
        />
        <h1>Ending time of the event:</h1>
        <input
          type="time"
          value={eventendtime}
          onChange={(e) => seteventendtime(e.target.value)}
          placeholder="Event starting Time"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
          }}
        />
        <h1>Event venue: </h1>
        <input
          type="location"
          value={eventlocation}
          onChange={(e) => seteventlocation(e.target.value)}
          placeholder="Event venue"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
          }}
        />
        <h1>Description of the event:</h1>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Give information about the event"
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
        <div onClick={() => fileRef.current.click()} className='cursor-pointer' style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
          <input onChange={handleFileChange} type="file" multiple ref={fileRef} style={{ display: 'none' }} />
          <button
            
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <IoMdAdd className='mt-0.5 mr-1'/>
          </button>
          <h1><strong>Add Images about the event</strong></h1>
        </div>
        <br />
        <div style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
            <Switch
            onChange={handleSwitchChange} 
            />
            <h1 style={{color:'black'}}><strong>Enable crowdfunding for this event</strong></h1>
        </div>
        <div className="modal-buttons mt-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="outlined" className="closeButton bg-white border px-4 rounded-xl border-blue-700" onClick={closeModal}>
                    Close
                  </Button>
                  <button variant="contained" className="postButton bg-blue-700 text-white border-2 rounded px-5" onClick={addPost}>
                    Post
                  </button>
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
            style={{ padding: '10px', backgroundColor: 'black', color: 'white' }}
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

export default forwardRef(Events);
