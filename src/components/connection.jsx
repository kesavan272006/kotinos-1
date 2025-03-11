import { addDoc, collection, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, database } from '../config/firebase';
import { Avatar, Button, ListItem, ListItemText, Paper, List } from '@mui/material';
import profileicon from '../assets/profileicon.svg';
import { Link, useLocation } from 'react-router-dom';
import { useRequestContext } from '../context/RequestContext';
import { setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getDoc } from 'firebase/firestore';
const Connection = () => {
  const [userData, setuserdata] = useState([]);
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const location = useLocation();
  const { setOppId } = useRequestContext();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
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
      const fetchUserData = async () => {
        const currentUser = auth.currentUser;
  
        if (currentUser) {
          const userRef = doc(database, "Users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUsername(userData.username || 'No Username');
            setRole(userData.role || 'No Role');
            setEmail(userData.email || 'No email found');
          } else {
            navigate("/signin");
          }
        } else {
          navigate("/signin");
        }
      };
  
      fetchUserData();
    }, [navigate]);
  // const getPendingRequests = async () => {
  //   const requestOutRef = collection(database, "Users", auth.currentUser?.uid, "RequestOut");
  //   try {
  //     const data = await getDocs(requestOutRef);
  //     const requests = data.docs.map(doc => doc.data());
  //     setPendingRequests(requests);
  //   } catch (err) {
  //     console.error("Error fetching requests:", err);
  //   }
  // };

  const sendRequest = async (userId) => {
    const requestDoc = doc(database, "Users", `${userId}`);
    const connectRef = collection(requestDoc, "RequestIn");

    const requestDocRef = doc(connectRef, auth.currentUser?.uid);
    const q = query(connectRef, where("username", "==", username), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        try {
            await setDoc(requestDocRef, {
                username: username,
                role: role,
                status: 'pending',
                requestSenderId: auth.currentUser?.uid,
            });
            setOppId(auth.currentUser?.uid);
            alert(`Request sent successfully!`);
        } catch (err) {
            console.error(err);
        }
    } else {
        alert('Request already sent!');
    }
};
  const fetchingProfilePic = async (userIds) =>{
      const userRef = doc(database, "Users", userIds);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          return userData.profilePic
        } else {
          return profileicon
        }
  }
  const [profilePics, setProfilePics] = useState({});

  useEffect(() => {
    const fetchProfilePics = async () => {
      const newProfilePics = {};

      for (const user of userData) {
        const pic = await fetchingProfilePic(user.id); 
        newProfilePics[user.id] = pic; 
      }

      setProfilePics(newProfilePics); 
    };

    fetchProfilePics();
  }, [userData]);
  const isRequestSent = (userId) => {
      return pendingRequests.some(request => request.userId === userId && request.status === 'pending');
    };

    useEffect(() => {
      getUsers();
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
                  <Link to={`/otherprofile/${users.id}`}>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'start', alignItems:'center'}}>
                      <Avatar src={profilePics[users.id] || profileicon} />
                      <div style={{ marginLeft: '10px' }}>
                        <ListItemText primary={users.username} secondary={users.role} />
                      </div>
                    </div>
                  </Link>
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
