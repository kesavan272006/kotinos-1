import React, { useState, useEffect } from "react";
import { auth, database } from "../../config/firebase";
import { 
  collection, doc, addDoc, getDoc, onSnapshot, serverTimestamp, orderBy, query 
} from "firebase/firestore";
import sendicon from '../../assets/sendicon.svg'
import { Link } from "react-router-dom";
const ReplySection = ({ postId, commentId, posterId }) => {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");

  useEffect(() => {
    const postRef = doc(database, 'Users', `${posterId}`, 'Posts', postId);
    const repliesRef = collection(postRef, 'comments', `${commentId}` , 'Replies');
    const q = query(repliesRef, orderBy("repliedAt", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const repliesData = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const replyData = docSnap.data();
        let userName = "Unknown User";
        let role = 'none';
        let userId = "none";
        if (replyData.Id) {
          const userRef = doc(database, "Users", replyData.Id);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            userName = userSnap.data().username;
            role = userSnap.data().role;
            userId = userSnap.data().id;
          }
        }

        return {
          id: docSnap.id,
          content: replyData.content || "No content",
          userName,
          role,
          userId: replyData.Id,
          repliedAt: replyData.repliedAt?.toDate().toLocaleString() || "Unknown Time",
        };
      }));
      setReplies(repliesData);
    });

    return () => unsubscribe();
  }, [postId, commentId]);

  const addReply = async () => {
    if (!newReply.trim()) return;

    try {
      const userRef = doc(database, "Users", `${auth.currentUser?.uid}`);
      const userSnap = await getDoc(userRef);
      let userName = "Unknown User";
      let role = "none";
      const Id = auth.currentUser?.uid;
      if (userSnap.exists() && userSnap.data().username) {
        userName = userSnap.data().username;
        role = userSnap.data().role;
      }

      const replyData = {
        content: newReply,
        Id,
        userName,
        role,
        repliedAt: serverTimestamp(),
      };
      const postRef = doc(database, 'Users', `${posterId}`, 'Posts', postId);
      const repliesRef = collection(postRef, 'comments', `${commentId}` , 'Replies');
      await addDoc(repliesRef, replyData);

      setNewReply("");
    } catch (error) {
      console.error("❌ Error adding reply:", error);
    }
  };

  return (
    <div className="reply-section">
      <div className="reply-input-container">
            <input 
                type="text" 
                placeholder="Write a reply..." 
                value={newReply} 
                onChange={(e) => setNewReply(e.target.value)} 
            />
            <button 
                onClick={addReply} 
                style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '10px',
                background: '#28a745',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
                }}
            >
                <h3 style={{color:'white'}}>-&gt;</h3>
            </button>
            </div>


      {replies.length === 0 ? (
        <p className="no-replies"></p>
      ) : (
        replies.map((reply) => (
          <div key={reply.id} className="reply-box">
            <Link to={`/otherprofile/${reply.userId}`}><strong>{reply.userName} <span style={{color:'red', marginLeft:'2px', fontSize:'15px'}}> {reply.role}</span></strong></Link>
            <h3>{reply.content}</h3>
            <small>Replied At: {reply.repliedAt}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default ReplySection;