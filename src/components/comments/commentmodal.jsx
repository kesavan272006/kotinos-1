import React from "react";
import CommentSection from "./commentsection";
import closeicon from '../../assets/closeicon.svg'
const CommentModal = ({posterId, postId, onClose }) => {
  return (
    <div style={modalStyles}>
      <div style={modalContentStyles}>
        <button onClick={onClose} style={closeButtonStyles}> <img src={closeicon} alt="X" /> </button>
        <CommentSection posterId={posterId} postId={postId} />
      </div>
    </div>
  );
};

const modalStyles = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContentStyles = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  width: "400px",
};

const closeButtonStyles = {
  position: "absolute",
  top: "5px",
  right: "10px",
  cursor: "pointer",
};

export default CommentModal;