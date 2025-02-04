import { Button, TextField } from "@mui/material";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { auth, database } from "../config/firebase";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRequestContext } from '../context/RequestContext';
const Messages = () => {
    const location = useLocation();
    const [message, setmessage] = useState('');
    const [messageData, setmessageData] = useState([]);
    const { oppositeId } = useRequestContext();
    const sendMessage = async () => {
        const userDoc = doc(database, "Users", `${oppositeId}`); 
        const messagedoc = doc(userDoc, "Message", `${oppositeId}`);
        const messageref = collection(messagedoc, `Message-${auth.currentUser?.uid}`);
    
        try {
            await addDoc(messageref, {
                message: message,
                timestamp: new Date().toISOString(),
            });
            setmessage(''); 
            showMessage();
        } catch (err) {
            console.error(err); 
        }
    }
    
    const showMessage = async () => {
        const userDoc = doc(database, "Users", `${auth.currentUser?.uid}`);
        const messagedoc = doc(userDoc, "Message", `${auth.currentUser?.uid}`);
        const messageref = collection(messagedoc, `Message-${oppositeId}`); 
    
        try {
            const data = await getDocs(messageref); 
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            console.log("Filtered message data:", filteredData);
            setmessageData(filteredData);
        } catch (err) {
            console.log(err);
        }
    }
    
    useEffect(() => {
        if (oppositeId) {
            showMessage(); 
        }
    }, [oppositeId]); 
    
    return (
        <div>
            <div style={{ padding: '30px' }}>
                <TextField
                    value={message}
                    onChange={(e) => setmessage(e.target.value)}
                    variant="outlined"
                    label='Start a conversation..'
                    size="small"
                />
                <Button
                    onClick={sendMessage}
                    style={{ backgroundColor: 'green', color: 'white', fontSize: '15px', marginLeft: '30px' }}
                >
                    Send
                </Button>
            </div>
            <div>
                {
                    messageData.map((userMessage) => (
                        <div key={userMessage.id} style={{ marginBottom: '10px' }}>
                            <h5>{userMessage.message}</h5>
                        </div>
                ))}
            </div>
        </div>
    );
}

export default Messages;
