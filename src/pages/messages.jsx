import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import MessageNav from "../components/navbar2";
import { useLocation } from "react-router-dom";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { database } from "../config/firebase";
import { auth } from "../config/firebase";
import { useEffect, useState } from "react";
const Messages = () => {
    const location = useLocation();
    const [message, setMessage]=useState([]);
    const [messageData, setMessageData]=useState([]);
    const sendMessage = async ()=>{
        const userDoc = doc(database, "Users", `${location.state.id}`);
        const messageDoc = doc(userDoc, "Message", `${location.state.id}`);
        const messageRef = collection(messageDoc, `Message-${auth.currentUser?.uid}`);
        try {
            await addDoc(messageRef, {
                message: message,

            })
        } catch (err) {
            console.error(err);
        }
    }
    const showMessage = async ()=>{
        const userDoc = doc(database, "Users", `${auth.currentUser?.uid}`);
        const messageDoc = doc(userDoc, "Message", `${auth.currentUser?.uid}`);
        const messageRef = collection(messageDoc, `Message-${location.state.id}`);
        try {
            const data = await getDocs(messageRef);
            const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id: doc.id,
            }))
            setMessageData(filteredData);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(()=>{
        showMessage();
    }, []);
  return (
    <div>
        <MessageNav username={location.state.username} role={location.state.role} />
        <div
        style={{
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            bottom: "0",
            left: "0",
            width: "100%",
            padding: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        }}
        >
        <div
            style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%", 
            }}
        >
            <TextField
            onChange={(e)=>setMessage(e.target.value)}
            label="Start a conversation"
            style={{
                width: "400px",
                marginRight: "10px",
            }}
            />
            <Button
            onClick={sendMessage}
            style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                transition: "background-color 0.3s ease",
            }}
            >
            Send
            </Button>
        </div>
        <div>
            {messageData.map((userMessage)=>{
                return <>
                    <h1>{userMessage.message}</h1>
                </>
            })}
        </div>
        </div>
    </div>
  );
};

export default Messages;
