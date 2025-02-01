import React, { forwardRef, useRef, useState } from 'react';
import Modal from 'react-modal';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
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
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = 'black';
  }

  function closeModal() {
    setIsOpen(false);
  }
  const [text, setText]=useState("");
  const addPost = async ()=>{
    const postDocument = doc(database, `User-${auth.currentUser?.uid}`, `${auth.currentUser?.uid}`)
    const postRef = doc(postDocument, "Posts", `${Math.random()}`)
    try {
        await setDoc(postRef, {
            textPost: text,
            
        });
    } catch (err) {
        console.log(err);
    }
    setIsOpen(false);
  }
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
        <h2 ref={(_subtitle) => (subtitle = _subtitle)} style={{ color:'black', fontSize: '30px', marginBottom: '20px' }}>
          What do you want to talk about?
        </h2>
        <br />
        <TextField
            id="outlined-multiline-static"
            label="Add your thoughts here..."
            multiline
            rows={4}
            onChange={(e)=>setText(e.target.value)}
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

export default forwardRef(Posts);