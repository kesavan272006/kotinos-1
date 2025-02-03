import Navbar from '../components/navbar';
import addprofile from '../assets/profileadd.svg';
import { useUser } from '../components/UserContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Calendar, Edit, Camera, Trash2 } from 'lucide-react';
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { database } from "../config/firebase";
import { getAuth } from "firebase/auth";

const Profile = () => {
    const { userDetails } = useUser();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
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
    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const docRef = doc(database, "athletes", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setProfile(docSnap.data());
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            }
        };

        fetchProfile();
    }, [user]);


    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };


    const handleSave = async () => {
        if (user) {
            try {
                await setDoc(doc(database, "athletes", user.uid), profile);
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
                await deleteDoc(doc(database, "athletes", user.uid));
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

    return (
        <>
            <Navbar />
            <style>
                {`
                .edit-text {
                        opacity: 0;
                        transform: translateX(20px);
                        transition: opacity 0.3s ease, transform 0.3s ease;
                    }

                    .edit-icon:hover + .edit-text,
                    .edit-text:hover {
                        opacity: 1;
                        transform: translateX(0);
                    }
                `}
            </style>
            <div className="grid md:grid-cols-2 gap-6 m-5">
                {/* Personal Information */}
                <div className="bg-white p-4 rounded-lg relative shadow-sm">
                    <div className="flex flex-col items-center mb-4">
                        <label className="relative cursor-pointer">
                            <img src={profile.profilePic || "/default-avatar.png"} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-blue-300" />
                            <span className="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full shadow-md">
                                <Camera size={16} />
                            </span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                    <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                        Personal Information
                        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700 flex items-center justify-center gap-2 relative">
                            <div className='edit-text opacity-0 transition-all text-[17px] absolute right-0'>Edit Profile</div>
                            <div className='edit-icon'><Edit className='mt-1' size={20} /></div>
                        </button>
                    </h2>
                    <div className="space-y-3">
                        <p><strong>Full Name:</strong> {profile.fullName || "Not provided"}</p>
                        <p><strong>Date of Birth:</strong> {profile.dob || "Not provided"}</p>
                        <p><strong>Gender:</strong> {profile.gender || "Not provided"}</p>
                        <p><strong>State:</strong> {profile.state || "Not provided"}</p>
                    </div>
                </div>

                {/* Sports Information */}
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
                                <input type="text" name="primarySport" placeholder="Primary Sport" value={profile.primarySport} onChange={handleChange} className="border p-2 rounded w-full" />
                                <input type="text" name="secondarySport" placeholder="Secondary Sport" value={profile.secondarySport} onChange={handleChange} className="border p-2 rounded w-full" />
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