import { addDoc, collection, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, database } from '../config/firebase';
import { Avatar, Button, ListItem, ListItemText, Paper, List } from '@mui/material';
import profileicon from '../assets/profileicon.svg';
import { useLocation } from 'react-router-dom';

const Connection = () => {
  const [userData, setuserdata] = useState([]);
  const location = useLocation();

  const getUsers = async () => {
    const userRef = collection(database, "Users");
    try {
      const data = await getDocs(userRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setuserdata(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const sendRequest = async (userId) => {
    const requestDoc = doc(database, "Users", `${userId}`);
    const connectRef = collection(requestDoc, "RequestIn");
    try {
      await addDoc(connectRef, {
        username: location.state.username,
        role: location.state.role,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {userData.filter(user => user.id !== auth.currentUser?.uid).map((users) => {
        return (
          <div key={users.id}>
            <Paper>
              <List>
                <ListItem style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                  <Avatar src={profileicon} />
                  <div style={{ marginLeft: '10px' }}>
                    <ListItemText primary={users.username} secondary={users.role} />
                  </div>
                  <Button
                    onClick={() => sendRequest(users.id)}
                    style={{ backgroundColor: 'green', color: 'white', fontSize: '20px', marginLeft: 'auto' }}
                  >
                    Connect
                  </Button>
                </ListItem>
              </List>
            </Paper>
          </div>
        );
      })}
    </div>
  );
};

export default Connection;
