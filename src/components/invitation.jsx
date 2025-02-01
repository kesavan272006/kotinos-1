import React, { useEffect, useState } from 'react'
import { Paper, ListItem, Avatar, ListItemText, List } from '@mui/material'
import profileicon from '../assets/profileicon.svg'
import { Button } from '@mui/material'
import { collection, doc, getDocs } from 'firebase/firestore'
import { auth, database } from '../config/firebase'
import Loading from './Loading'

const Invitation = () => {
    const requestref = doc(database, "Users", `${auth.currentUser?.uid}`)
    const requestInRef = collection(requestref, "RequestIn");
    const [user, setuser] = useState([]);
    const [loading, setLoading] = useState(true);

    const showrequest = async () => {
        try {
            const data = await getDocs(requestInRef);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            // Save data to localStorage
            localStorage.setItem('invitationData', JSON.stringify(filteredData));

            setuser(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const savedData = localStorage.getItem('invitationData');
        if (savedData) {
            setuser(JSON.parse(savedData));
            setLoading(false);
        } else {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    showrequest();
                } else {
                    console.log("No user is logged in");
                }
            });
            return () => unsubscribe();
        }
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            {user.map((eachuser) => {
                return (
                    <Paper key={eachuser.id}>
                        <List>
                            <ListItem style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                                <Avatar src={profileicon} />
                                <div style={{ marginLeft: '10px' }}>
                                    <ListItemText primary={eachuser.username} secondary={eachuser.role} />
                                </div>
                                <Button
                                    style={{ backgroundColor: 'red', color: 'white', fontSize: '20px', marginLeft: 'auto' }}
                                >
                                    Reject
                                </Button>
                                <Button
                                    style={{ backgroundColor: '#01D836', color: 'white', fontSize: '20px', marginLeft: '15px' }}
                                >
                                    Connect
                                </Button>
                            </ListItem>
                        </List>
                    </Paper>
                );
            })}
        </div>
    );
}

export default Invitation;
