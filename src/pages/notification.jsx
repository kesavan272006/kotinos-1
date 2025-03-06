
const Notification = ()=>{
    return (
        <h1>hello world</h1>
    )
}
export default Notification
// import { useState, useEffect } from "react";
// import { db } from "../config/firebaseConfig";
// import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";

// const users = {
//   user1: { id: "user1", name: "User 1" },
//   user2: { id: "user2", name: "User 2" },
//   user3: { id: "user3", name: "User 3" },
// };

// const TestCommentSystem = () => {
//   const [commentSections, setCommentSections] = useState([]);
//   const [activeUser, setActiveUser] = useState(users.user1);

//   const addNewCommentSection = async () => {
//     const docRef = await addDoc(collection(db, "posts"), { createdAt: serverTimestamp() });
//     setCommentSections([...commentSections, docRef.id]);
//   };

//   return (
//     <div>
//       <button onClick={addNewCommentSection}>Add New Comment System</button>

//       <div>
//         <p>Post as:</p>
//         {Object.values(users).map((user) => (
//           <button key={user.id} onClick={() => setActiveUser(user)}>
//             {user.name}
//           </button>
//         ))}
//       </div>

//       {commentSections.map((postId) => (
//         <CommentSection key={postId} postId={postId} activeUser={activeUser} />
//       ))}
//     </div>
//   );
// };

// // Comment Section Component
// const CommentSection = ({ postId, activeUser }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   useEffect(() => {
//     const q = query(collection(db, "posts", postId, "comments"), orderBy("timestamp", "asc"));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     });
//     return () => unsubscribe();
//   }, [postId]);

//   const addComment = async () => {
//     if (newComment.trim() === "") return;
//     await addDoc(collection(db, "posts", postId, "comments"), {
//       text: newComment,
//       userId: activeUser.id,
//       userName: activeUser.name,
//       timestamp: serverTimestamp(),
//     });
//     setNewComment("");
//   };

//   return (
//     <div style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
//       <h4>Comment Section (Post ID: {postId})</h4>
//       {comments.map((comment) => (
//         <Comment key={comment.id} postId={postId} comment={comment} activeUser={activeUser} />
//       ))}
//       <input
//         type="text"
//         value={newComment}
//         onChange={(e) => setNewComment(e.target.value)}
//         placeholder="Write a comment..."
//       />
//       <button onClick={addComment}>Post</button>
//     </div>
//   );
// };

// // Individual Comment Component (Includes Reply System)
// const Comment = ({ postId, comment, activeUser }) => {
//   const [replies, setReplies] = useState([]);
//   const [replyText, setReplyText] = useState("");
//   const [showReplyInput, setShowReplyInput] = useState(false);

//   useEffect(() => {
//     const q = query(collection(db, "posts", postId, "comments", comment.id, "replies"), orderBy("timestamp", "asc"));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       setReplies(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     });
//     return () => unsubscribe();
//   }, [postId, comment.id]);

//   const addReply = async () => {
//     if (replyText.trim() === "") return;
//     await addDoc(collection(db, "posts", postId, "comments", comment.id, "replies"), {
//       text: replyText,
//       userId: activeUser.id,
//       userName: activeUser.name,
//       timestamp: serverTimestamp(),
//     });
//     setReplyText("");
//     setShowReplyInput(false);
//   };

//   return (
//     <div style={{ marginLeft: "20px", borderLeft: "2px solid gray", paddingLeft: "10px" }}>
//       <p>
//         <b>{comment.userName}:</b> {comment.text}
//       </p>
//       <button onClick={() => setShowReplyInput(!showReplyInput)}>Reply</button>

//       {showReplyInput && (
//         <div>
//           <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." />
//           <button onClick={addReply}>Post Reply</button>
//         </div>
//       )}

//       {/* Render Replies */}
//       {replies.map((reply) => (
//         <p key={reply.id} style={{ marginLeft: "20px" }}>
//           <b>{reply.userName}:</b> {reply.text}
//         </p>
//       ))}
//     </div>
//   );
// };

// export default TestCommentSystem;