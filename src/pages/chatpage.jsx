import Navbar from '../components/navbar';
import React, { useEffect, useState, useRef } from 'react';
import { Paper, Avatar, ListItem, ListItemText, List, Button, TextField, Modal, Box, Icon, Alert } from '@mui/material';
import profileicon from '../assets/profileicon.svg';
import { collection, doc, getDocs, addDoc, deleteDoc, getDoc, setDoc, query, where, updateDoc } from 'firebase/firestore';
import { database, auth } from '../config/firebase';
import Loading from '../components/Loading';
import addphoto from '../assets/addphoto.svg';
import deleteIcon from '../assets/deleteicon.svg'
import { useNavigate } from 'react-router-dom';
import currencyicon from '../assets/currencyicon.svg'
import chatsystembg from '../assets/chatsystembg.webp'
import logo from '../assets/logo.png'
import Autocomplete from '@mui/material/Autocomplete';
const ChatPage = () => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageData, setMessageData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing]=useState(false);
    const [groupName, setGroupName]=useState('');
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [username, setUsername]=useState('');
    const [role, setRole]=useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedGroup, setSelectedGroup]=useState(null);
    const [groups, setGroups] = useState([]); 
    const [grpmessage, setGrpMessage] = useState(""); 
    const [messages, setMessages] = useState([]);
    const [groupNames, setGroupNames] = useState({});
    const [senderNames, setSenderNames] = useState({});
    useEffect(() => {
        const fetchGroupNames = async () => {
            const groupNamesData = {};

            for (let groupId of groups) {
                const groupRef = doc(database, 'Groups', groupId);
                const groupDoc = await getDoc(groupRef);

                if (groupDoc.exists()) {
                    const groupData = groupDoc.data();
                    groupNamesData[groupId] = groupData.groupName; 
                }
            }

            setGroupNames(groupNamesData); 
        };

        fetchGroupNames();
    }, [groups, database]);
    const handleuserselection =(eachuser)=>{
        setSelectedUser(eachuser);
        setSelectedGroup(null);
    }
    useEffect(() => {
        const fetchUserData = async () => {
          const currentUser = auth.currentUser;
    
          if (currentUser) {
            const userRef = doc(database, "Users", currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              setUsername(userData.username || 'No Username');
              setRole(userData.role || 'No Role');
            } else {
              navigate("/signin");
            }
          } else {
            navigate("/signin");
          }
        };
    
        fetchUserData();
      }, [navigate]);
      
      useEffect(() => {
        const fetchUserGroups = async () => {
            const userGroupsRef = collection(database, 'Users', auth.currentUser?.uid, 'Groups');
            const querySnapshot = await getDocs(userGroupsRef);

            const userGroups = [];
            querySnapshot.forEach((doc) => {
                userGroups.push(doc.id); 
            });
            setGroups(userGroups);
        };

        fetchUserGroups();
    }, [auth.currentUser]);
    if (!auth.currentUser) {
        return <Loading />;
    }
    const handlenavigation = (userId)=>{
        navigate(`/displayQr/${userId}`);
    }
    const handleImageClick = () => {
        fileInputRef.current.click();
    };
      
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 3) {
            alert("You can select a maximum of 3 images.");
            return;
        }
        const newImages = [...images, ...files];
        setImages(newImages);

        const previewUrls = newImages.map((file) => URL.createObjectURL(file));
        setPreviewImages(previewUrls);
    };

    const handleDeletePreviewImage = (imageUrl) => {
        const updatedPreviewImages = previewImages.filter(image => image !== imageUrl);
        setPreviewImages(updatedPreviewImages);

        const updatedImages = images.filter(image => URL.createObjectURL(image) !== imageUrl);
        setImages(updatedImages);
    };

    const fetchGroupMessages = async (groupId) => {
        const groupRef = doc(database, 'Groups', groupId);
        const messagesRef = collection(groupRef, 'messages');
        const querySnapshot = await getDocs(messagesRef);

        const groupMessages = [];
        querySnapshot.forEach((doc) => {
            groupMessages.push(doc.data());
        });
        const sortedMessages = groupMessages.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
        setMessages(sortedMessages);
    };
    const handleGroupClick = async (groupId) => {
        setSelectedGroup(groupId);
        setSelectedUser(null);
        await fetchGroupMessages(groupId);
    };
    
    const sendMessage = async () => {
        if (!selectedUser || (!message && images.length === 0)) return;

        const imageUrls = await Promise.all(images.map(async (file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(file);
            });
        }));
        const userDocSender = doc(database, "Users", `${auth.currentUser?.uid}`);
        const messageDocSender = doc(userDocSender, "Message", `${auth.currentUser?.uid}`);
        const messageRefSender = collection(messageDocSender, `Message-${selectedUser.id}`);

        try {
            await addDoc(messageRefSender, {
                message: message,
                images: imageUrls,
                timestamp: new Date(),
                senderId: auth.currentUser?.uid,
            });

            const userDocReceiver = doc(database, "Users", `${selectedUser.id}`);
            const messageDocReceiver = doc(userDocReceiver, "Message", `${selectedUser.id}`);
            const messageRefReceiver = collection(messageDocReceiver, `Message-${auth.currentUser?.uid}`);

            await addDoc(messageRefReceiver, {
                message: message,
                images: imageUrls,
                timestamp: new Date(),
                senderId: auth.currentUser?.uid,
            });

            setMessage('');
            setImages([]);
            setPreviewImages([]);
            setOpenModal(false);
            showMessage();
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };
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
    useEffect(()=>{
        if(selectedGroup){
            fetchGroupMessages();
        }
    }, [selectedGroup]);
    useEffect(() => {
        const fetchSenderNames = async () => {
            const names = {};
            for (let message of messages) {
                if (!names[message.senderId]) {
                    const name = await senderName(message.senderId);
                    names[message.senderId] = name;
                }
            }
            setSenderNames(names);
        };

        fetchSenderNames();
    }, [messages, database]);
    const handleSendMessage = async (groupids) => {
        if (!grpmessage) {
            alert('Please enter a message!');
            return;
        }

        const newMessage = {
            senderId: auth.currentUser?.uid,
            username: username,
            message: grpmessage,
            timestamp: new Date(),
        };
        const groupRef = doc(database, 'Groups', selectedGroup);
        const messagesRef = collection(groupRef, 'messages');
        const newMessageRef = doc(messagesRef, `${Math.random()}`); 
        await setDoc(newMessageRef, newMessage);
        await updateDoc(groupRef, {
            lastMessage: newMessage.message, 
            lastMessageTimestamp: newMessage.timestamp,
        });
        fetchGroupMessages(groupids);
        setGrpMessage(''); 
    };
    useEffect(() => {
        showRequest();
    }, []);
    const senderName = async (userId) => {
        const docRef = doc(database, "Users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().username;
        } else {
            return "Loading...";
        }
    };
    useEffect(() => {
        if (selectedUser) {
            showMessage();
        }
    }, [selectedUser]);

    if (loading) {
        return <Loading />;
    }
    const deleteMessage = async (messageId, selecteduserId) => {
        const userDocSender = doc(database, "Users", `${auth.currentUser?.uid}`);
        const messageDocSender = doc(userDocSender, "Message", `${auth.currentUser?.uid}`);
        const messageRefSender = collection(messageDocSender, `Message-${selecteduserId}`);
        const messageToDeleteSender = doc(messageRefSender, messageId);

        const userDocReceiver = doc(database, "Users", `${selecteduserId}`);
        const messageDocReceiver = doc(userDocReceiver, "Message", `${selecteduserId}`);
        const messageRefReceiver = collection(messageDocReceiver, `Message-${auth.currentUser?.uid}`);
        const messageToDeleteReceiver = doc(messageRefReceiver, messageId);

        try {
            await deleteDoc(messageToDeleteSender);
            await deleteDoc(messageToDeleteReceiver);
        } catch (err) {
            console.error("Error deleting message:", err);
        }
    };
    const connectedUsers = user.filter(user => user.status === 'connected');
    const handleOpen = ()=>{
        setSelectedUser(null);
        setIsEditing(true);
    }
    const handleClose = ()=>{
        setIsEditing(false);
        setGroupName('');
        setSelectedUser(null);
    }
    const handlenamechange =(e) =>{
        setGroupName(e.target.value);
    }
    
    const handleSave = async () => {
        if (groupName === '') {
            alert('Kindly Enter a Group Name');
            setGroupName('');
        } else if (groupName.includes(' ')) {
            alert('Invalid Group Name. Group name cannot have spaces, instead try using underscore _');
            setGroupName('');
        } else {
            try {
                const userGroupsRef = collection(database, 'Users', auth.currentUser?.uid, 'Groups');
                const q = query(userGroupsRef, where('groupName', '==', groupName));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    alert(`You have already created a group with the name ${groupName}. Please choose a different name.`);
                    setGroupName('');
                    return;
                }
                if(selectedUsers.length<2){
                    alert('Atleast two members are required to create a Group.');
                    return;
                }
                const membersDetails = selectedUsers.map((user) => ({
                    username: user.username,
                    id: user.id,
                    role: user.role,
                }));
                const groupRef = doc(userGroupsRef, `${groupName}-${auth.currentUser?.uid}`);
                await setDoc(groupRef, {
                    createdBy: username,
                    adminId: auth.currentUser?.uid,
                    groupName: groupName,
                    members: membersDetails,
                    timestamp: new Date(),
                });
                const groupsReference = doc(database, 'Groups', `${groupName}-${auth.currentUser?.uid}`);
                await setDoc(groupsReference, {
                    createdBy: username,
                    adminId: auth.currentUser?.uid,
                    groupName: groupName,
                    members: membersDetails,
                    timestamp: new Date(),
                });
    
                const userPromises = selectedUsers.map(async (user) => {
                    const individualGroupDoc = doc(database, 'Users', `${user.id}`);
                    const indiGroupRef = doc(individualGroupDoc, 'Groups', `${groupName}-${auth.currentUser?.uid}`);
                    await setDoc(indiGroupRef, {
                        createdBy: username,
                        adminId: auth.currentUser?.uid,
                        groupName: groupName,
                        members: membersDetails,
                        timestamp: new Date(),
                    });
                });
    
                await Promise.all(userPromises);
                setIsEditing(false);
                setGroupName('');
                setSelectedUsers([]);
            } catch (err) {
                console.log(err);
                setIsEditing(false);
                setGroupName('');
                setSelectedUsers([]);
            }
        }
    };
    
    return (
        <>
            <Navbar />
            <div className='flex h-[90vh]'>
                
                <div style={{ width: '25%', borderRight: '1px solid #ddd' }}>
                    <Button onClick={handleOpen}>Create a Group</Button>
                    <h3 className="font-bold pl-1">Groups</h3>
                    <List>
                        {groups.map((groupId) => {
                            return (
                                <Paper key={groupId} style={{ marginBottom: '10px' }}>
                                    <ListItem button onClick={() => handleGroupClick(groupId)}>
                                        <Avatar />
                                        <div style={{ marginLeft: '10px' }}>
                                            <ListItemText primary={groupNames[groupId] || 'Loading...'} />
                                        </div>
                                    </ListItem>
                                </Paper>
                            );
                        })}
                    </List>
                    <h3 className='font-bold pl-1'>Chats</h3>
                    <List>
                        {user.filter(user => user.status === 'connected').map((eachuser) => {
                            return (
                                <Paper key={eachuser.id} style={{ marginBottom: '10px' }}>
                                    <ListItem button onClick={()=>handleuserselection(eachuser)}>
                                        <Avatar src={eachuser.profilePic} />
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
                    {isEditing && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                                <h1><strong>Create a Group</strong></h1>
                                <br />
                                <TextField label='Group Name' value={groupName} onChange={handlenamechange} />
                                <br />
                                <Autocomplete
                                    disablePortal
                                    multiple
                                    options={connectedUsers}
                                    getOptionLabel={(option)=>option.username}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="members" />}
                                    onChange={(event, value) => setSelectedUsers(value)}
                                />
                                <div>
                                    <Button onClick={handleClose}>close</Button>
                                    <Button disabled={groupName==''} onClick={handleSave}>Save</Button>
                                </div>
                            </div>
                        </div>
                    )}
                    {selectedGroup && (
                            <>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd'
                                }}>
                                    <Avatar src={profileicon} />
                                    <div style={{ marginLeft: '10px' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                            {groupNames[selectedGroup]}
                                        </div>
                                    </div>
                                </div>

                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flex: 1,
                                    overflowY: 'scroll',
                                    paddingBottom: '80px',
                                    backgroundImage: `url(${chatsystembg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundAttachment: 'fixed',
                                    height: '100%',
                                    width: '100%',
                                }}>
                                    {messages.map((message, index) => {
                                        const isCurrentUser = message.senderId === auth.currentUser?.uid;
                                        return (
                                            <div key={index} style={{
                                                display: 'flex',
                                                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                                                marginBottom: '15px',
                                                paddingLeft: '10px',
                                                paddingRight: '10px',
                                            }}>
                                                <div style={{ fontSize: '10px', color: 'white', marginTop: '5px' }}>
                                                    {new Date(message.timestamp.seconds * 1000).toLocaleString()}
                                                </div>
                                                <div style={{
                                                    backgroundColor: isCurrentUser ? '#375ecc' : '#FFFFFF',
                                                    color: isCurrentUser ? '#FFFFFF' : '#000',
                                                    padding: '10px',
                                                    borderRadius: '15px',
                                                    maxWidth: '80%',
                                                    display: 'inline-block',
                                                    wordBreak: 'break-word',
                                                    marginLeft: isCurrentUser ? '10px' : '0',
                                                    marginRight: isCurrentUser ? '0' : '10px',
                                                }}>
                                                    <span style={{fontSize:'15px', textDecoration:'underline', fontWeight:'bolder'}}>{senderNames[message.senderId] || "Loading..."}</span>
                                                    <br />
                                                    {message.images && message.images.map((img, index) => (
                                                        <img
                                                            key={index}
                                                            src={img}
                                                            alt={`Image-${index}`}
                                                            style={{
                                                                width: '100px',
                                                                height: '100px',
                                                                marginTop: '5px',
                                                                borderRadius: '10px',
                                                                display: 'block',
                                                                marginBottom: '5px'
                                                            }}
                                                        />
                                                    ))}
                                                    {message.message && <span style={{ fontSize: '14px' }}>{message.message}</span>}
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
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                            multiple
                                        />
                                        <img
                                            src={addphoto}
                                            alt="Img"
                                            onClick={() => {
                                                setOpenModal(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </div>
                                    <TextField
                                        value={grpmessage}
                                        onChange={(e) => setGrpMessage(e.target.value)}
                                        label="Start a conversation"
                                        style={{
                                            width: '85%',
                                            marginRight: '10px',
                                            backgroundColor: '#f1f1f1',
                                            borderRadius: '15px',
                                        }}
                                    />
                                    <Button
                                        onClick={()=>handleSendMessage(selectedGroup)}
                                        variant="contained"
                                        className="postButton bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-500"
                                    >
                                        Send
                                    </Button>
                                </div>
                            </>
                        )}

                    {selectedUser && (
                        <>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px',
                                borderBottom: '1px solid #ddd'
                            }}>
                                <Avatar src={selectedUser.profilePic} />
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
                                backgroundImage: `url(${chatsystembg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundAttachment: 'fixed',
                                height:'100%',
                                width:'100%'
                            }}
                            >
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
                                            <div style={{ fontSize: '10px', color: 'white', marginTop: '5px' }}>
                                                {new Date(userMessage.timestamp.seconds * 1000).toLocaleString()}
                                            </div>
                                            <div style={{
                                                backgroundColor: isCurrentUser ? '#375ecc' : '#FFFFFF',
                                                color: isCurrentUser ? '#FFFFFF' : '#000',
                                                padding: '10px',
                                                borderRadius: '15px',
                                                maxWidth: '80%',
                                                display: 'inline-block',
                                                wordBreak: 'break-word',
                                                marginLeft: isCurrentUser ? '10px' : '0',
                                                marginRight: isCurrentUser ? '0' : '10px',
                                            }}>
                                                {userMessage.images && userMessage.images.map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={img}
                                                        alt={`Image-${index}`}
                                                        style={{
                                                            width: '100px',
                                                            height: '100px',
                                                            marginTop: '5px',
                                                            borderRadius: '10px',
                                                            display: 'block',
                                                            marginBottom: '5px'
                                                        }}
                                                    />
                                                ))}
                                                {userMessage.message && <span style={{ fontSize: '14px' }}>{userMessage.message}</span>}
                                            </div>
                                            {isCurrentUser && (
                                                <button
                                                    onClick={() => {
                                                        deleteMessage(userMessage.id, selectedUser.id)
                                                        alert('The message is deleted only for you!');
                                                        showMessage();
                                                    }}
                                                    style={{
                                                        cursor: 'pointer',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        marginTop: '5px',
                                                        marginLeft: '5px',
                                                        fontSize: '16px',
                                                        color: 'red'
                                                    }}
                                                >
                                                    <img src={deleteIcon} className='w-5 h-5' alt="❌" />
                                                </button>
                                            )}
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
                                <div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                        multiple
                                    />
                                    <img
                                        src={addphoto}
                                        alt="Img"
                                        onClick={() => {
                                            handleImageClick
                                            setOpenModal(true)
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
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
                                <Button onClick={()=>handlenavigation(selectedUser.id)}> <img src={currencyicon} alt="" /> </Button>
                                <Button
                                    onClick={sendMessage}
                                    variant="contained" className="postButton bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-500 "
                                >
                                    Send
                                </Button>
                            </div>
                        </>
                    )}
                    {!selectedUser && !selectedGroup && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center', 
                            alignItems: 'center',      
                            height: '100vh'             
                        }}>
                            <div style={{
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}>
                                <img src={logo} style={{height:'200px', width:'200px', borderRadius:'50%', alignSelf:'center'}} />
                                <div style={{
                                    background: 'linear-gradient(to right, #1e3a8a, #1d4ed8, #22d3ee)', 
                                    WebkitBackgroundClip: 'text',  
                                    color: 'transparent',  
                                    fontSize: '4rem', 
                                    fontWeight: 'bold', 
                                }}>
                                    Kotinos
                                </div>
                                <h1 style={{fontSize:'2rem', color:'black', fontWeight:'bold'}}>Your Dream, our Platform</h1>
                                <h1>Select a chat to start your conversation</h1>
                            </div>
                        </div>
                        
                        
                    )}
                </div>

                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                >
                    <Box sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: 24,
                        width: 400, textAlign: 'center'
                    }}>
                        <h3>Choose Images (Max 3)</h3>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            multiple
                        />
                        <Button onClick={handleImageClick}>Choose Files</Button>
                        <div style={{ marginTop: '10px' }}>
                            {previewImages.map((imageUrl, index) => (
                                <div key={index} style={{ marginBottom: '10px' }} className=' bg-blue-50 p-2 w-fit rounded-xl'>
                                    <img src={imageUrl} alt={`Preview-${index}`} style={{ width: '100px', height: '100px', margin: '0 10px' }} />
                                    <Button onClick={() => handleDeletePreviewImage(imageUrl)} className='' style={{ color: 'red' }}>
                                        <img src={deleteIcon} className='' alt="Delete" style={{ width: '20px' }} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <TextField
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            label="Add a Descreption"
                            className=''
                            style={{
                                width: '85%',
                                marginRight: '10px',
                            }}
                        />
                        <Button
                            onClick={sendMessage}
                            className='bg-gradient-to-r from-blue-900/80 via-blue-700/80 to-cyan-500/80'
                            style={{
                                
                                color: '#fff',
                                padding: '12px 24px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                marginTop: '20px',
                            }}
                        >
                            Send
                        </Button>
                    </Box>
                </Modal>
            </div>
        </>
    );
};

export default ChatPage;
