import React, { useState, useEffect } from "react";
import { auth, database } from "../../config/firebase";
import { 
  collection, doc, addDoc, getDoc, onSnapshot, serverTimestamp, orderBy, query 
} from "firebase/firestore";
import ReplySection from "./replysection";
import sendicon from '../../assets/sendicon.svg'
import { Link } from "react-router-dom";
const CommentSection = ({ postId, posterId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!postId) return; 
    const postRef = doc(database, 'Users', `${posterId}`, 'Posts', postId);
    const commentsRef = collection(postRef, 'comments');
    const q = query(commentsRef, orderBy("commentedAt", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const commentsData = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const commentData = docSnap.data();
        let userName = "Unknown User";
        let userId = 'none';
        let userRole = 'none';
        // ✅ Fetch the commenter's username
        if (commentData.Id) {
          const userRef = doc(database, "Users", commentData.Id);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            userName = userSnap.data().username;
            userId = userSnap.data().id;
            userRole = userSnap.data().role;
          }
        }

        return {
          id: docSnap.id,
          userId: userId,
          content: commentData.content || "No content",
          userName,
          userRole,
          commentedAt: commentData.commentedAt
            ? new Date(commentData.commentedAt.seconds * 1000).toLocaleString()
            : "Unknown Time",
        };
      }));
      setComments(commentsData);
    });

    return () => unsubscribe(); 
  }, [postId]);
  const [username, setUsername]=useState('')
  const [role, setRole]=useState('');

  const addComment = async () => {
    if (!newComment.trim() || !postId) return;

    try {

      const docRef = doc(database, "Users", auth.currentUser?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const reference = docSnap.data();
            setUsername(reference.username)
            setRole(reference.role);
        }
      const Id = auth.currentUser?.uid;
      const commentData = {
        content: newComment,
        Id,
        commentedAt: serverTimestamp(),
      };
      const postRef = doc(database, 'Users', `${posterId}`, 'Posts', postId);
      const commentsRef = collection(postRef, 'comments');
      await addDoc(commentsRef, commentData);
      setNewComment("");
    } catch (error) {
      console.error("❌ Error adding comment:", error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>

      {/* Input box for new comment */}
      <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
      <input 
        value={newComment} 
        onChange={(e) => setNewComment(e.target.value)} 
        placeholder="Write a comment..." 
        className="comment-input"
      />
      <button onClick={addComment} className="comment-button"> <img src={sendicon} alt="send" /> </button>
      </div>

      {/* Scrollable comment section */}
      <div className="comment-list">
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-box">
                <Link to={`/otherprofile/${comment.userId}`}><strong>{comment.userName}  <span style={{color:'red', marginLeft:'5px'}}> {comment.userRole}</span></strong></Link>
              <h3>{comment.content}</h3>
              <p><small>Commented At: {comment.commentedAt}</small></p>

              {/* Reply Section */}
              <ReplySection posterId={posterId} postId={postId} commentId={comment.id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;