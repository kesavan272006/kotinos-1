import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const Profile = () => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div>
            <p>Welcome to your profile!</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Profile;
