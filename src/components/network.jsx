import React, { useEffect, useState } from 'react';
import { Paper, Avatar, ListItem, ListItemText, List, Button } from '@mui/material';
import profileicon from '../assets/profileicon.svg';
import { collection, doc, getDocs } from 'firebase/firestore';
import { database, auth } from '../config/firebase';
import Loading from './Loading';
import { Link, useNavigate } from 'react-router-dom';
import { useRequestContext } from "../context/RequestContext";
import { useLocation } from 'react-router-dom';
const Network = () => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const requestInRef = collection(database, "Users", auth.currentUser?.uid, "RequestIn");
    const { setOppositeId } = useRequestContext();
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
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsAuthenticated(true);  
                showRequest();           
            } else {
                setIsAuthenticated(false);
                setLoading(false);        
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <Loading />;
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
                    console.log(eachuser.id);
                    return <Paper key={eachuser.id}>
                    <List>
                        <ListItem style={{ display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                                <Avatar src={profileicon} style={{ alignSelf: 'center' }} />
                                <div style={{ marginLeft: "10px" }}>
                                    <ListItemText
                                        primary={eachuser.username}
                                        secondary={eachuser.role}
                                    />
                                </div>
                            </div>
                            <Link to='/messages' state = {{username: eachuser.username, id: eachuser.id}}><Button
                                onClick={()=>setOppositeId(eachuser.id)}
                                style={{ backgroundColor: 'green', color: 'white', fontSize: '20px', marginLeft: 'auto' }}
                            >
                                Message
                            </Button></Link>
                        </ListItem>
                    </List>
                </Paper>
                })
            )}
        </div>
    );
};

export default Network;
