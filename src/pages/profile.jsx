import Navbar from '../components/navbar';
import addprofile from '../assets/profileadd.svg';
import { useUser } from '../components/UserContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Calendar, Edit, Camera, Trash2 } from 'lucide-react';
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { database } from "../config/firebase";
import { getAuth } from "firebase/auth";
import profileicon from '../assets/profileicon.svg'
import Loading from '../components/Loading';

const Profile = () => {
    const { userDetails } = useUser();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const [photourl, setphotourl] = useState(null);
    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];
    const [isEditing, setIsEditing] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;

    const [profile, setProfile] = useState({
        fullName: "",
        dob: "",
        gender: "",
        state: "",
        primarySport: "",
        secondarySport: "",
        experience: "",
        profilePic: "",
    });
    const [loading, setLoading] = useState(true);
    
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);
        const fetchProfile = async () => {
            
            if (user) {
                try {
                    const docRef = doc(database, "Users", user.uid);
                    const doc2Ref = doc(docRef, "profileDetails", "details");
                    const docSnap = await getDoc(doc2Ref);
                    if (docSnap.exists()) {
                        setProfile(docSnap.data());
                        const profilepicref = docSnap.data();
                        setphotourl(profilepicref.profilePic || profileicon);
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    navigate('/signin');
                }
            }
            return () => clearTimeout(timer);
        };
        
        fetchProfile();
    }, [navigate]);
    
    const sportsArray = [
        "Running", "Marathon", "Long Jump", "High Jump", "Shot Put", "Discus Throw", "Javelin Throw", "Sprint", "Hurdles", "Pole Vault",
        "Basketball", "Football", "Cricket", "Hockey", "Badminton", "Tennis", "Table Tennis", "Volleyball", "Swimming", "Boxing", "Wrestling",
        "Gymnastics", "Cycling", "Rugby", "Skiing", "Archery", "Weightlifting", "Fencing", "Rowing", "Handball", "Golf", "Triathlon", "MMA (Mixed Martial Arts)",
        "Surfing", "Skateboarding", "Rock Climbing", "Polo", "Badminton", "Kickboxing"
    ];
    
    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };
    
    const handleSave = async () => {
        if (user) {
            try {
                const documentRef = doc(database, "Users", user.uid);
                const profileDetailsRef = doc(documentRef, "profileDetails", "details");
    
                const updatedProfile = { ...profile };
                if (profile.profilePic !== "") {
                    await setDoc(documentRef, { profilePic: profile.profilePic }, { merge: true });
                    await setDoc(profileDetailsRef, { profilePic: profile.profilePic }, { merge: true });
                }
    
                await setDoc(profileDetailsRef, updatedProfile, { merge: true });
    
                console.log('Profile saved successfully!');
                setIsEditing(false);
            } catch (error) {
                console.error("Error saving profile:", error);
            }
        }
    };
    
    
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, profilePic: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleDelete = async () => {
        if (user) {
            try {
                const docref = doc(database, "Users", user.uid);
                const doc2ref = doc(docref, "profileDetails", "details");
                await deleteDoc(doc2ref);
                setProfile({
                    fullName: "",
                    dob: "",
                    gender: "",
                    state: "",
                    primarySport: "",
                    secondarySport: "",
                    experience: "",
                    profilePic: "",
                });
                setIsEditing(false);
            } catch (error) {
                console.error('Error deleting profile:', error);
            }
        }
    };
    
    if (loading) {
        return <Loading />
    }
    return (
        <>
            <Navbar />
            <div className="grid md:grid-cols-2 gap-6 m-5">
                <div className="bg-white p-4 rounded-lg relative shadow-sm">
                    <div className="flex flex-col items-center mb-4">
                        <label className="relative cursor-pointer">
                            <img src={profile.profilePic || profileicon} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-blue-300" />
                            <span className="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full shadow-md">
                                <Camera size={16} />
                            </span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                    <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                        Personal Information
                        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700 flex items-center justify-center gap-2">
                            <div className='hidden'>Edit Profile</div><div><Edit className='mt-1' size={20} /></div>
                        </button>
                    </h2>
                    <div className="space-y-3">
                        <p><strong>Full Name:</strong> {profile.fullName || "Not provided"}</p>
                        <p><strong>Date of Birth:</strong> {profile.dob || "Not provided"}</p>
                        <p><strong>Gender:</strong> {profile.gender || "Not provided"}</p>
                        <p><strong>State:</strong> {profile.state || "Not provided"}</p>
                    </div>
                </div>

                <div className="bg-white shadow-sm p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Sports Information</h2>
                    <div className="space-y-3">
                        <p><strong>Primary Sport:</strong> {profile.primarySport || "Not provided"}</p>
                        <p><strong>Secondary Sport:</strong> {profile.secondarySport || "Not provided"}</p>
                        <p><strong>Years of Experience:</strong> {profile.experience || "Not provided"}</p>
                    </div>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                            <div className="space-y-3">
                                <label>Upload Profile Picture</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 rounded w-full" />
                                <input type="text" name="fullName" placeholder="Full Name" value={profile.fullName} onChange={handleChange} className="border p-2 rounded w-full" />
                                <input type="date" name="dob" value={profile.dob} onChange={handleChange} className="border p-2 rounded w-full" />
                                <select name="gender" value={profile.gender} onChange={handleChange} className="border p-2 rounded w-full">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <select name="state" value={profile.state} onChange={handleChange} className="border p-2 rounded w-full">
                                    <option value="">Select State</option>
                                    {indianStates.map((state) => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                                <select name="primarySport" value={profile.primarySport} onChange={handleChange} className="border p-2 rounded w-full">
                                    <option value="">Select your primary Sports</option>
                                    {sportsArray.map((state) => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                                <select name="secondarySport" value={profile.secondarySport} onChange={handleChange} className="border p-2 rounded w-full">
                                    <option value="">Select your secondary Sports</option>
                                    {sportsArray.map((state) => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>                                
                                <input type="number" name="experience" placeholder="Years of Experience" value={profile.experience} onChange={handleChange} className="border p-2 rounded w-full" />
                                <div className="flex justify-end space-x-2 mt-4">
                                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 rounded">Exit</button>
                                    <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                                    <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </>
    );
};

export default Profile;
