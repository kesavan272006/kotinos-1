import { addDoc, collection, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, database } from '../config/firebase';
import { Avatar, Button, ListItem, ListItemText, Paper, List } from '@mui/material';
import profileicon from '../assets/profileicon.svg';
import { useLocation } from 'react-router-dom';
import { useRequestContext } from '../context/RequestContext';
import { setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
const Connection = () => {
  const [userData, setuserdata] = useState([]);
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const location = useLocation();
  const { setOppId } = useRequestContext();
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

  const getPendingRequests = async () => {
    const requestOutRef = collection(database, "Users", auth.currentUser?.uid, "RequestOut");
    try {
      const data = await getDocs(requestOutRef);
      const requests = data.docs.map(doc => doc.data());
      setPendingRequests(requests);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const sendRequest = async (userId) => {
    const requestDoc = doc(database, "Users", `${userId}`);
    const connectRef = collection(requestDoc, "RequestIn");

    const requestDocRef = doc(connectRef, auth.currentUser?.uid);
    const q = query(connectRef, where("username", "==", location.state.username), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        try {
            await setDoc(requestDocRef, {
                username: location.state.username,
                role: location.state.role,
                status: 'pending',
                requestSenderId: auth.currentUser?.uid,
            });
            setOppId(auth.currentUser?.uid);
            alert(`Request sent successfully!`);
            getPendingRequests();
        } catch (err) {
            console.error(err);
        }
    } else {
        alert('Request already sent!');
    }
};

  
  

  const isRequestSent = (userId) => {
    return pendingRequests.some(request => request.userId === userId && request.status === 'pending');
  };

  useEffect(() => {
    getUsers();
    getPendingRequests();
  }, []);

  return (
    <div>
      {userData.filter(user => user.id !== auth.currentUser?.uid).map((users) => {
        const isRequestAlreadySent = isRequestSent(users.id);

        return (
          <div key={users.id}>
            <Paper>
              <List>
                <ListItem style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                  <Avatar src={profileicon} />
                  <div style={{ marginLeft: '10px' }}>
                    <ListItemText primary={users.username} secondary={users.role} />
                  </div>
                  {!isRequestAlreadySent && (
                    <Button
                      onClick={() => sendRequest(users.id)}
                      style={{ backgroundColor: 'green', color: 'white', fontSize: '20px', marginLeft: 'auto' }}
                    >
                      Connect
                    </Button>
                  )}
                  {isRequestAlreadySent && (
                    <Button
                      disabled
                      style={{ backgroundColor: 'grey', color: 'white', fontSize: '20px', marginLeft: 'auto' }}
                    >
                      Request Sent
                    </Button>
                  )}
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
