import React, { forwardRef, useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import { Button } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import { getDoc } from 'firebase/firestore';
import addicon from '../assets/addicon.svg'
import deleteicon from '../assets/deleteicon.svg'
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

const FilePost = (props, ref) => {
    const fileRef = useRef(null);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [userData, setUserData] = useState([]);
    
    const getUserData = async () => {
        try {
            const userDocument = doc(database, 'Users', `${auth.currentUser?.uid}`);
            const data = await getDoc(userDocument);
            setUserData(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    function openModal() {
        setTimeout(() => {
            if (fileRef.current) {
                fileRef.current.click();
            }
        }, 200);
        setIsOpen(true);
    }
    

    function closeModal() {
        setIsOpen(false);
    }

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
                });
                setIsOpen(false);
                setTitle('');
                setDescription('');
                setFiles([]);
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
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Add Images"
            >
                <input
                    onChange={handleFileChange}
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    ref={fileRef}
                />
                <h2 style={{ color: 'black', fontSize: '30px', marginBottom: '20px' }}>
                    Add a post
                </h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post Title"
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Post Description"
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', minHeight: '100px' }}
                />
                <div className="preview-images">
                    {files.length > 0 &&
                        files.map((file, index) => (
                            <div key={index} style={{ display: 'inline-block', margin: '5px' }}>
                                <img
                                    src={file}
                                    alt={`Preview ${index}`}
                                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                />
                                <img src={deleteicon} onClick={() => setFiles(files.filter((_, idx) => idx !== index))} />
                            </div>
                        ))}
                </div>
                <br />
                <div>
                    <input onChange={handleFileChange} type="file" multiple ref={fileRef} style={{ display: 'none' }} />
                    <button onClick={() => fileRef.current.click()} style={{ border: 'none', background: 'none' }}>
                        <img src={addicon} alt="Add files" />
                    </button>
                </div>

                <br />
                <div className="modal-buttons">
                    <Button variant="outlined" className="closeButton" onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant="contained" className="postButton" onClick={addPost}>
                        Post
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default forwardRef(FilePost);
