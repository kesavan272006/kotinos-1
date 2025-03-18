import { addDoc, collection, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import { auth, database } from '../config/firebase';
import { Avatar, Button, ListItem, ListItemText, Paper, List } from '@mui/material';
import profileicon from '../assets/profileicon.svg';
import { Link, useLocation } from 'react-router-dom';
import { useRequestContext } from '../context/RequestContext';
import { setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getDoc } from 'firebase/firestore';
import { IoPersonAddSharp } from "react-icons/io5";
import { FiSearch } from 'react-icons/fi';
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
  useEffect(()=>{
    setFilteredUsers(userData)
  }, [])
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
  const fetchingProfilePic = async (userIds) => {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(userData);
  const [defaults, setdefaults]=useState(true);
  const handleSearchChange = (event) => {
    setdefaults(false);
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = userData.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };
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
    <div className='bg-gray-50'>
      <Navbar />
      <div className="flex justify-center">
        <div className="w-[90%] md:w-[40%]">
          <div className="flex items-center mt-10">
            <IoPersonAddSharp className='text-2xl text-blue-500 mt-1' />
            <h1 className='pl-2 text-gray-800 text-3xl font-bold'>Connect with Others</h1>
          </div>
          <h2 className='text-gray-700 text-base mt-10 mb-10 font-medium ml-3 md:ml-2'>
            Find new people to connect with and grow your network.
          </h2>
          <div className="flex items-center border border-gray-300 bg-gray-100 rounded-full px-3 py-2">
              <FiSearch className="text-gray-500" />
              <input 
                  type="text" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search" 
                  className="w-full ml-2 text-gray-700 outline-none bg-transparent" 
              />
          </div>
          <br />
          {!defaults && (
            filteredUsers.filter(user => user.id !== auth.currentUser?.uid).map((users) => {
              const isRequestAlreadySent = isRequestSent(users.id);
  
              return (
                <div key={users.id} className=''>
  
                  <Paper className='hover:bg-blue-50'>
                    <List>
                      <ListItem className='' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                        <Link to={`/otherprofile/${users.id}`}>
                          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
                            <Avatar className='bg-gray-100' src={profilePics[users.id] || profileicon} sx={{ width: 48, height: 48,}} />
                            <div style={{ marginLeft: '10px' }}>
                              <ListItemText primary={users.username} secondary={users.role} />
                            </div>
                          </div>
                        </Link>
                        {!isRequestAlreadySent && (
                          <button
                            onClick={() => sendRequest(users.id)}
                            className='ml-auto text-blue-500 hover:bg-white hover:border hover:border-blue-500 rounded-full px-2 py-1 transform transition duration-100 ease-in-out'
                          >
                            Connect
                          </button>
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
            })
          )}
          {defaults && (
            userData.filter(user => user.id !== auth.currentUser?.uid).map((users) => {
              const isRequestAlreadySent = isRequestSent(users.id);
  
              return (
                <div key={users.id} className=''>
  
                  <Paper className='hover:bg-blue-50'>
                    <List>
                      <ListItem className='' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                        <Link to={`/otherprofile/${users.id}`}>
                          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
                            <Avatar className='bg-gray-100' src={profilePics[users.id] || profileicon} sx={{ width: 48, height: 48,}} />
                            <div style={{ marginLeft: '10px' }}>
                              <ListItemText primary={users.username} secondary={users.role} />
                            </div>
                          </div>
                        </Link>
                        {!isRequestAlreadySent && (
                          <button
                            onClick={() => sendRequest(users.id)}
                            className='ml-auto text-blue-500 hover:bg-white hover:border hover:border-blue-500 rounded-full px-2 py-1 transform transition duration-100 ease-in-out'
                          >
                            Connect
                          </button>
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
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Connection;
