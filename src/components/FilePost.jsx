import React, { forwardRef, useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { Button } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import { getDoc } from 'firebase/firestore';

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

const Filepost = (props, ref) => {
    const fileRef = useRef(null);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [file, setFile] = useState(null);
    const [userData, setUserData] = useState([]);

    const getuser = async () => {
        try {
            const userdocument = doc(database, "Users", `${auth.currentUser?.uid}`);
            const data = await getDoc(userdocument);
            setUserData(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getuser();
    }, [])

    function openModal() {
        setTimeout(() => {
            fileRef.current.click();
        }, 200);
        setIsOpen(true);
    }

    function afterOpenModal() {
        subtitle.style.color = 'black';
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile(reader.result); 
            };
            reader.readAsDataURL(selectedFile); 
        }
    }

    const addPost = async () => {
        if (file != []) {
            try {
                const postDocument = doc(database, "Users", `${auth.currentUser?.uid}`);
                const postRef = doc(postDocument, "Posts", `${Math.random()}`);
                await setDoc(postRef, {
                    username: userData._document?.data?.value.mapValue.fields.username.stringValue,
                    role: userData._document?.data?.value.mapValue.fields.role.stringValue,
                    imageURL: file, 
                });

                setIsOpen(false);
                setText("");
                setFile(null);
            } catch (err) {
                console.log(err);
            }
        } else {
            alert('Trying to post without adding your images or text?');
        }
    }

    let subtitle;
    return (
        <div>
            <button ref={ref} style={{ display: 'none' }} onClick={openModal}>
                Open Modal
            </button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <input onChange={handleFileChange} type='file' style={{ display: 'none' }} ref={fileRef} />
                <h2 ref={(_subtitle) => (subtitle = _subtitle)} style={{ color: 'black', fontSize: '30px', marginBottom: '20px' }}>
                    Add an image to enhance your post
                </h2>
                <br />
                {file && <img src={file} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}  {/* Show the preview of selected image */}
                <div className="modal-buttons">
                    <Button
                        variant="outlined"
                        className="closeButton"
                        onClick={closeModal}
                    >
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        className="postButton"
                        onClick={addPost}
                    >
                        Post
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default forwardRef(Filepost);
