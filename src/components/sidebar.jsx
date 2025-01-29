import profilepic from '../assets/profileicon.svg'
import { useUser } from '../components/UserContext';
import React, { useState, useEffect } from 'react';
const Sidebar = () => {
    const { userDetails } = useUser();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    useEffect(() => {
            if (userDetails) {
                setUsername(userDetails.username);
                setRole(userDetails.selectedOption); 
                localStorage.setItem("username", userDetails.username);
                localStorage.setItem("role", userDetails.selectedOption);
            } else {
                const storedUsername = localStorage.getItem("username");
                const storedRole = localStorage.getItem("role");
    
                if (storedUsername && storedRole) {
                    setUsername(storedUsername);
                    setRole(storedRole);
                }
            }
        }, [userDetails]);
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
