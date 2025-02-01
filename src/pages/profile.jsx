import Navbar from '../components/navbar';
import addprofile from '../assets/profileadd.svg';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database, auth } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Loading from '../components/Loading';

const Profile = () => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

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

        return () => clearTimeout(timer);
    }, [navigate]);

    if (loading) {
        return <Loading />;
    }

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
                        <p>Role: {role}</p>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Profile;
