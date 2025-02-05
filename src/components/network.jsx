import React, { useEffect, useState } from 'react';
import { Paper, Avatar, ListItem, ListItemText, List, Button } from '@mui/material';
import profileicon from '../assets/profileicon.svg'; 
import { collection, doc, getDocs } from 'firebase/firestore';
import { database, auth } from '../config/firebase'; 
import Loading from './Loading';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const Network = () => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    
    if (!auth.currentUser) {
        return <Loading /> 
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

    useEffect(() => {
        showRequest();
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            {user.length === 0 ? (
                <div style={{
                    width: '100%', height: '40vw', backgroundColor: '#F1F8F9', textAlign: 'center', 
                    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', display: 'flex', 
                    flexDirection: 'row', fontWeight: 'bolder', fontSize: '40px'
                }}>
                    <span style={{ color: 'red', marginRight: '10px' }}>No </span>friends available!
                </div>
            ) : (
                user.filter(user => user.status === 'connected').map((eachuser) => {
                    return <Paper key={eachuser.id}>
                        <List>
                            <ListItem style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <div style={{display:'flex', flexDirection:'row', justifyContent:'start', alignItems:'center'}}>
                                    <Avatar src={profileicon} />
                                    <div style={{ marginLeft: "10px" }}>
                                        <ListItemText
                                            primary={eachuser.username}
                                            secondary={eachuser.role}
                                        />
                                    </div>
                                </div>
                                <Link to='/messages' state={{username: eachuser.username, role:eachuser.role, id: eachuser.id}}>
                                <Button style={{
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
                                    }}>
                                    Message
                                    </Button>
                                </Link>
                            </ListItem>
                        </List>
                    </Paper>
                })
            )}
        </div>
    );
};

export default Network;

