import React, { useEffect, useState } from 'react';
import { Paper, Avatar, ListItem, ListItemText, List, Button, TextField } from '@mui/material';
import profileicon from '../assets/profileicon.svg';
import { collection, doc, getDocs } from 'firebase/firestore';
import { database, auth } from '../config/firebase';
import { Link, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import { addDoc } from 'firebase/firestore';
const ChatPage = () => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageData, setMessageData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    if (!auth.currentUser) {
        return <Loading />;
    }

    const requestInRef = collection(database, "Users", auth.currentUser?.uid, "RequestIn");

    const showRequest = async () => {
        try {
            const data = await getDocs(requestInRef);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            const uniqueUsers = Array.from(new Set(filteredData.map(user => user.id)))
                .map(id => filteredData.find(user => user.id === id));

            setUser(uniqueUsers);
        } catch (err) {
            console.error("Error fetching requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const addMessage = async () => {
        const userDoc = doc(database, "Users", `${auth.currentUser?.uid}`);
        const messageDoc = doc(userDoc, "Message", `${auth.currentUser?.uid}`);
        const messageRef = collection(messageDoc, `Message-${selectedUser.id}`);
        try {
            await addDoc(messageRef, {
                message: message,
                timestamp: new Date(), 
                senderId: `${auth.currentUser?.uid}`
            })
        } catch (err) {
            console.error(err);
        }
    }

    const sendMessage = async () => {
        if (!selectedUser || !message) return;
    
        const userDocSender = doc(database, "Users", `${auth.currentUser?.uid}`);
        const messageDocSender = doc(userDocSender, "Message", `${auth.currentUser?.uid}`);
        const messageRefSender = collection(messageDocSender, `Message-${selectedUser.id}`);
        
        try {
            await addDoc(messageRefSender, {
                message: message,
                timestamp: new Date(),
                senderId: auth.currentUser?.uid,
            });
    
            const userDocReceiver = doc(database, "Users", `${selectedUser.id}`);
            const messageDocReceiver = doc(userDocReceiver, "Message", `${selectedUser.id}`);
            const messageRefReceiver = collection(messageDocReceiver, `Message-${auth.currentUser?.uid}`);
            
            await addDoc(messageRefReceiver, {
                message: message,
                timestamp: new Date(),
                senderId: auth.currentUser?.uid,
            });
    
            setMessage(''); 
            showMessage();  
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };
    
    

    const showMessage = async () => {
        if (!selectedUser) return;
        const userDoc = doc(database, "Users", `${auth.currentUser?.uid}`);
        const messageDoc = doc(userDoc, "Message", `${auth.currentUser?.uid}`);
        const messageRef = collection(messageDoc, `Message-${selectedUser.id}`);
        try {
            const data = await getDocs(messageRef);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
    
            const sortedMessages = filteredData.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
    
            setMessageData(sortedMessages);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        showRequest();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            showMessage();
        }
    }, [selectedUser]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '25%', borderRight: '1px solid #ddd', padding: '10px' }}>
                <h3>Friends</h3>
                <List>
                    {user.filter(user => user.status === 'connected').map((eachuser) => {
                        return (
                            <Paper key={eachuser.id} style={{ marginBottom: '10px' }}>
                                <ListItem button onClick={() => setSelectedUser(eachuser)}>
                                    <Avatar src={profileicon} />
                                    <div style={{ marginLeft: "10px" }}>
                                        <ListItemText
                                            primary={eachuser.username}
                                            secondary={eachuser.role}
                                        />
                                    </div>
                                </ListItem>
                            </Paper>
                        );
                    })}
                </List>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {selectedUser && (
                    <>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px',
                            padding: '10px',
                            borderBottom: '1px solid #ddd'
                        }}>
                            <Avatar src={profileicon} />
                            <div style={{ marginLeft: '10px' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                    {selectedUser.username}
                                </div>
                                <div style={{ fontSize: '14px', color: '#888' }}>
                                    {selectedUser.role}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                            overflowY: 'scroll',
                            paddingBottom: '80px',
                        }}>
                            {messageData.map((userMessage, index) => {
                                const isCurrentUser = userMessage.senderId === auth.currentUser?.uid;
                                return (
                                    <div key={index} style={{
                                        display: 'flex',
                                        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                                        marginBottom: '15px',
                                        paddingLeft: '10px',
                                        paddingRight: '10px',
                                    }}>
                                        <div style={{
                                            backgroundColor: isCurrentUser ? '#DCF8C6' : '#FFFFFF',
                                            padding: '10px',
                                            borderRadius: '15px',
                                            maxWidth: '80%',
                                            display: 'inline-block',
                                            boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.1)',
                                            wordBreak: 'break-word',
                                            marginLeft: isCurrentUser ? '10px' : '0',
                                            marginRight: isCurrentUser ? '0' : '10px',
                                        }}>
                                            <span style={{ fontSize: '14px' }}>{userMessage.message}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#fff',
                            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <TextField
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                label="Start a conversation"
                                style={{
                                    width: '85%',
                                    marginRight: '10px',
                                    backgroundColor: '#f1f1f1',
                                    borderRadius: '15px',
                                }}
                            />
                            <Button
                                onClick={sendMessage}
                                style={{
                                    backgroundColor: '#28a745',
                                    color: '#fff',
                                    padding: '12px 24px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'background-color 0.3s ease',
                                }}
                            >
                                Send
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
