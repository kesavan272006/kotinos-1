import Navbar from '../components/navbar';
import addprofile from '../assets/profileadd.svg';
import { useUser } from '../components/UserContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { userDetails } = useUser();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (userDetails) {
            setUsername(userDetails.username);
            setRole(userDetails.selectedOption);  // Use selectedOption here
            localStorage.setItem("username", userDetails.username);
            localStorage.setItem("role", userDetails.selectedOption); // Store selectedOption as role
        } else {
            const storedUsername = localStorage.getItem("username");
            const storedRole = localStorage.getItem("role");

            if (storedUsername && storedRole) {
                setUsername(storedUsername);
                setRole(storedRole);
            } else {
                navigate("/signin");
            }
        }
    }, [userDetails, navigate]);

    return (
        <div>
            <Navbar />
            <h1>Welcome {username}</h1>
            <div style={{ width: '648px', height: '700px', backgroundColor: 'white', marginLeft: '80px', marginTop: '60px' }}>
                <nav style={{ backgroundColor: 'white', height: '200px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ height: '150px', width: '150px', borderRadius: '75%', backgroundColor: 'rgb(217, 217, 217)', alignContent: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <img src={addprofile} alt="add a profile pic" style={{ height: '50px', width: '50px', borderRadius: '25%' }} />
                        </div>
                        <h1>{username}</h1>
                        <p>Role: {role}</p> {/* Display the role */}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Profile;
