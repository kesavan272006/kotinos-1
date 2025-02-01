import profilepic from '../assets/profileicon.svg'
import { useUser } from '../components/UserContext';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { doc } from 'firebase/firestore';
import { database } from '../config/firebase';
import { getDoc } from 'firebase/firestore';
const Sidebar = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
      const fetchUserData = async () => {
          const currentUser = auth.currentUser;

          if (currentUser) {
              const userRef = doc(database, "users", currentUser.uid);
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
  return (
    <div style={{width: '20vw', height:'500px', backgroundColor: 'white', marginTop: '50px', borderWidth: '1px', borderColor: 'black', borderStyle: 'solid'}}>
      <div style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>
        <img src={profilepic} alt="Profile" style={{height: '100px', width: '100px', borderRadius:'50%', backgroundColor:'gray', marginTop:'20px'}} />
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <h1>{username}</h1>
            <h3>Logged in as {role}</h3>
        </div>
      </div>
      <br />
      <div style={{borderWidth: '1px', borderStyle:'solid', borderColor:'black'}}>
        <h4>friends</h4>
        <h4>Invitations</h4>
      </div>
    </div>
  )
}

export default Sidebar
