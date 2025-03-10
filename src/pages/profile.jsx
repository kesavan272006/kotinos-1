import Navbar from '../components/navbar';
import addprofile from '../assets/profileadd.svg';
import { useUser } from '../components/UserContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Calendar, Edit, Camera, Trash2 } from 'lucide-react';
import { doc, setDoc, getDoc, deleteDoc, collection } from "firebase/firestore";
import { database } from "../config/firebase";
import { getAuth } from "firebase/auth";
import profileicon from '../assets/profileicon.svg'
import { FaRegHeart } from "react-icons/fa";
import Loading from '../components/Loading';
import { Button, TextField } from '@mui/material';
import Footer from '../components/footer';
import { getDocs } from 'firebase/firestore';
import Modal from 'react-modal';
import { signOut } from 'firebase/auth';
const Profile = () => {
    const handleNavigation = ()=>{
        navigate('/addQR');
    }
    const { userDetails } = useUser();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const [photourl, setphotourl] = useState(null);
    const [email, setemail]=useState('');
    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];
    const [isEditing, setIsEditing] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;
    const [posts, setPosts] = useState([]);
    const [profile, setProfile] = useState({
        username: username,
        fullName: "",
        dob: "",
        gender: "",
        state: "",
        primarySport: "",
        secondarySport: "",
        experience: "",
        profilePic: "",
        qrCode: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagesToDisplay, setImagesToDisplay] = useState([]);
    const [profilepic, setprofilepic]=useState(null);
    const openModal = (images, index) => {
        setImagesToDisplay(images);
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesToDisplay.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? imagesToDisplay.length - 1 : prevIndex - 1
        );
    };
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [modalImages, setModalImages] = useState('');

    const openModals = (imageUrl) => {
        setModalImages(imageUrl);
        setIsModalOpened(true);
    };

    const closeModals = () => {
        setIsModalOpened(false);
    };
    const getPost = async () => {
        setTimeout(async () => {
            try {
    
                const postRef = collection(database, 'Users', `${auth.currentUser?.uid}`, 'Posts');

                const postSnapshot = await getDocs(postRef);
                const postsData = postSnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                    userId: `${auth.currentUser?.uid}`,
                }));
    
                const sortedPosts = postsData.sort((a, b) => {
                    const aTimestamp = a.timestamp?.seconds || 0;
                    const bTimestamp = b.timestamp?.seconds || 0;
                    return bTimestamp - aTimestamp;
                });
    
                if(postsData){
                    setPosts(sortedPosts);
                }
            } catch (err) {
                console.error("Error fetching posts:", err);
            }
        }, 1000);
    };
    useEffect(() => {
        getPost();
    }, []);
    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleString();
        }
        return '';
    };
    const [loading, setLoading] = useState(true);
    const decidingathlete = role === 'athlete'; 
    const decidingcoach = role === 'coach'; 
    const decidinguser = role === 'user';
    const decidingorganization = role === 'organization';
    useEffect(() => {
        const fetchProfile = async () => {
            if (auth.currentUser) {
                try {
                    const docRef = doc(database, "Users", auth.currentUser?.uid);
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
        };
        fetchProfile();
    }, [user, navigate, role]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);
        const fetchProfile2 = async () => {
            
            if (user) {
                try {
                    const docRef = doc(database, "Users", auth.currentUser?.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const reference = docSnap.data();
                        setUsername(reference.username)
                        setRole(reference.role);
                        setemail(reference.email)
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    navigate('/signin');
                }
            }
            return () => clearTimeout(timer);
        };
        
        fetchProfile2();
    }, [user, navigate, role]);
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
                const documentRef = doc(database, "Users", auth.currentUser?.uid);
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
    const textareaStyle = {
        height: '150px',
        width: '100%',
        alignItems: 'center',
        border: '2px solid #4CAF50',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
      };
      
      const focusStyle = {
        border: '2px solid #3E8E41',
      };
      
      const blurStyle = {
        border: '2px solid #4CAF50',
      };
    const logout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    const handleDelete = async () => {
        if (user) {
            try {
                const docref = doc(database, "Users", auth.currentUser?.uid);
                const doc2ref = doc(docref, "profileDetails", "details");
                await deleteDoc(doc2ref);
                setProfile({
                    username: username,
                    fullName: "",
                    dob: "",
                    gender: "",
                    state: "",
                    primarySport: "",
                    secondarySport: "",
                    userPrimarySport: "",
                    userSecondarySport: "",
                    experience: "",
                    profilePic: "",
                    teamName: "",
                    achievements: "",
                    qrCode: "",
                    decodedQr: "",
                });
                await setDoc(docref, { profilePic: "" }, { merge: true });
                setIsEditing(false);
                logout();
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
            <h1 style={{textAlign:'center', opacity:'0.8', paddingTop:'1%'}}>If you find any error, just refresh the page.</h1>
            <div className="grid md:grid-cols-2 gap-6 m-5">
                <div className="bg-white p-4 rounded-lg relative shadow-sm">
                    <div className="flex flex-col items-center mb-4">
                        <label className="relative cursor-pointer">
                            <img src={profile.profilePic || profileicon} alt="Profile" onClick={()=>openModals(profile.profilePic || profileicon)} className="w-24 h-24 rounded-full object-cover border-2 border-blue-300" />
                        </label>
                    </div>
                    <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                        Personal Information
                        <button onClick={() => setIsEditing(true)} className="flex items-center text-sm text-blue-700 hover:text-green-600 transition-colors">
                            <span>Edit Profile</span>
                            {/* <Edit className="mr-2" size={18} /> */}
                        </button>

                    </h2>
                    <div className="space-y-3">
                        <p><strong>User Name:</strong> {username || "Not provided"}</p>
                        {/* <p><strong>Full Name:</strong> {profile.fullName || "Not provided"}</p> */}
                        <p><strong>Logged in as:</strong> {role || "Not provided"}</p>
                        <p><strong>Your emailId: </strong> {email || "Not provided"}</p>
                        <p><strong>Date of Birth:</strong> {profile.dob || "Not provided"}</p>
                        <p><strong>Gender:</strong> {profile.gender || "Not provided"}</p>
                        <p><strong>State:</strong> {profile.state || "Not provided"}</p>
                    </div>
                </div>

                {decidingathlete && (
                    <div className="bg-white shadow-sm p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Sports Information</h2>
                        <div className="space-y-3">
                            <p><strong>Primary Sport:</strong> {profile.primarySport || "None"}</p>
                            <p><strong>Secondary Sport:</strong> {profile.secondarySport || "None"}</p>
                            <p><strong>Years of Experience:</strong> {profile.experience || "None"}</p>
                            <p><strong>Teams You have played for: </strong> <br /> {profile.teamName || "None"}</p>
                            <p><strong>Your achievements as a player: </strong> <br /> {profile.achievements || "None"}</p>
                            <h1><strong>upload your QR code to receive financial support for your athletic journey</strong></h1>
                            <Button onClick={handleNavigation}>upload QR code</Button>
                        </div>
                    </div>
                )}
                {decidingcoach && (
                    <div className="bg-white shadow-sm p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Sports Information</h2>
                        <div className="space-y-3">
                            <p><strong>Your primary Sport of coaching: </strong> {profile.primarySport || "None"}</p>
                            <p><strong>Your secondary Sport of coaching</strong> {profile.secondarySport || "None"}</p>
                            <p><strong>Years of Experience:</strong> {profile.experience || "None"}</p>
                            <p><strong>Teams You have coached for: </strong> {profile.teamName || "None"}</p>
                            <p><strong>Your achievements as a coach: </strong> <br /> {profile.achievements || "None"}</p>
                            <p><strong>Kindly upload your QR code to facilitate donations for training your students.</strong></p>
                            <Button onClick={handleNavigation}>upload QR code</Button>
                        </div>
                    </div>
                )}
                {decidinguser && (
                    <div className="bg-white shadow-sm p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Sports Information</h2>
                        <div className="space-y-3">
                            <p><strong>The sports which majorly interests you: </strong> {profile.primarySport || "None"}</p>
                            <p><strong>The other sport which interests you: </strong> {profile.secondarySport || "None"}</p>
                            <p><strong>Your favourite sports Moments: </strong> <br /> {profile.achievements || "None"}</p>
                            <p><strong>Your favourite teams: </strong> <br /> {profile.teamName || "None"}</p>
                            <p><strong>Approximate number of years you have been interested in these sports: </strong> {profile.experience || "None"}</p>
                        </div>
                    </div>
                )}
                {isEditing && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                            <div className="space-y-3">
                                <label>Upload Profile Picture</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 rounded w-full" />
                                {/* <input type="text" name="fullName" placeholder="Full Name" value={profile.fullName} onChange={handleChange} className="border p-2 rounded w-full" /> */}
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
                                {decidingathlete && (
                                    <>
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
                                        <textarea name='teamName' placeholder='Please enter the name of the teams you have played for' value={profile.teamName} onChange={handleChange} style={textareaStyle} onFocus={(e) => e.target.style.border = focusStyle.border} onBlur={(e) => e.target.style.border = blurStyle.border} />                               
                                        <textarea name='achievements' placeholder='Please enter your achievements as a player' value={profile.achievements} onChange={handleChange} style={textareaStyle} onFocus={(e) => e.target.style.border = focusStyle.border} onBlur={(e) => e.target.style.border = blurStyle.border} />
                                        <input type="number" name="experience" placeholder="Years of Experience" value={profile.experience} onChange={handleChange} className="border p-2 rounded w-full" />
                                    </>
                                )}
                                {decidingcoach && (
                                    <>
                                        <select name="primarySport" value={profile.primarySport} onChange={handleChange} className="border p-2 rounded w-full">
                                        <option value="">Select your primary Sports of coaching</option>
                                        {sportsArray.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                        </select>
                                        <select name="secondarySport" value={profile.secondarySport} onChange={handleChange} className="border p-2 rounded w-full">
                                            <option value="">Select your secondary Sports of coaching</option>
                                            {sportsArray.map((state) => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select> 
                                        <textarea name='teamName' placeholder='Please enter the name of the teams you have coached for' value={profile.teamName} onChange={handleChange} style={textareaStyle} onFocus={(e) => e.target.style.border = focusStyle.border} onBlur={(e) => e.target.style.border = blurStyle.border} />                               
                                        <textarea name='achievements' placeholder='Your achievements as a coach' value={profile.achievements} onChange={handleChange} style={textareaStyle} onFocus={(e) => e.target.style.border = focusStyle.border} onBlur={(e) => e.target.style.border = blurStyle.border} /> 
                                        <input type="text" name="experience" placeholder="Years of Experience as a coach" value={profile.experience} onChange={handleChange} className="border p-2 rounded w-full" />
                                    </>
                                )}
                                {decidinguser && (
                                    <>
                                        <select name="primarySport" value={profile.primarySport} onChange={handleChange} className="border p-2 rounded w-full">
                                            <option value="">Select your most favourite sport</option>
                                            {sportsArray.map((state) => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                        <select name="secondarySport" value={profile.secondarySport} onChange={handleChange} className="border p-2 rounded w-full">
                                            <option value="">Select your second most favourite sport</option>
                                            {sportsArray.map((state) => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select> 
                                        <textarea name='teamName' placeholder='Please enter your favourite teams and mention the sport too' value={profile.teamName} onChange={handleChange} style={textareaStyle} onFocus={(e) => e.target.style.border = focusStyle.border} onBlur={(e) => e.target.style.border = blurStyle.border} />
                                        <textarea name='achievements' placeholder='Please enter your favourite sport moments' value={profile.achievements} onChange={handleChange} style={textareaStyle} onFocus={(e) => e.target.style.border = focusStyle.border} onBlur={(e) => e.target.style.border = blurStyle.border} />                               
                                        <input type="number" name="experience" placeholder="approximate number of years you have interest in these sports" value={profile.experience} onChange={handleChange} className="border p-2 rounded w-full" />
                                    </>
                                )}
                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 rounded">Exit</button>
                                        <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                                        <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className=' mt-5 mb-7 md:col-span-2 flex flex-col items-center'>
                        <h1 className='russo' style={{textAlign:'center', fontSize:'40px', color:'black'}}>Your Posts</h1>
                    {posts.map((post) => (
                        
                        <div
                            key={post.id}
                            className='bg-white rounded-xl mb-5 w-[50%]'
                        >
                            <div className='pl-5'>
                                <div className='flex flex-row'>
                                    <img
                                        src={profile.profilePic||profileicon}
                                        alt={profileicon}
                                        style={{
                                            height: '80px',
                                            width: '80px',
                                            borderRadius: '50%',
                                            backgroundColor: 'gray',
                                            marginRight: '20px',
                                        }}
                                        onClick={() => openModals(profile.profilePic||profileicon)}
                                    />
                                    {isModalOpened && (
                                            <div
                                            style={{
                                                position: 'fixed',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: 'rgba(86, 84, 84, 0.7)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                zIndex: 9999,
                                            }}
                                            onClick={closeModals}
                                            >
                                            <div
                                                style={{
                                                position: 'relative',
                                                maxWidth: '90%',
                                                maxHeight: '90%',
                                                }}
                                                onClick={(e) => e.stopPropagation()} 
                                            >
                                                <img
                                                src={modalImages}
                                                alt={profileicon}
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    borderRadius: '8px',
                                                }}
                                                />
                                                <button
                                                onClick={closeModals}
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    background: 'red',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '30px',
                                                    height: '30px',
                                                    fontSize: '18px',
                                                    cursor: 'pointer',
                                                }}
                                                >
                                                X
                                                </button>
                                            </div>
                                            </div>
                                        )}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <h1>{post.username}</h1>
                                        <h1>{post.role}</h1>
                                        <h3>{formatTimestamp(post.timestamp)}</h3>
                                    </div>
                                </div>
                                <br />
                                <h1>{post.textPost}</h1>
                            </div>
                            <div>
                                <strong className='text-2xl text-center'>
                                    {post.title}
                                </strong>
                                <h2>{post.description}</h2>
                            </div>
                            <br />
                            <br />
                            {post.images && post.images.length > 0 && (
                                <div className='flex flex-wrap gap-2 pl-2'>
                                    {post.images.slice(0, 3).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Post Image ${index}`}
                                            className='w-[100px] h-[100px] object-cover cursor-pointer'
                                            onClick={() => openModal(post.images, index)}
                                        />
                                    ))}
                                    {post.images.length > 3 && (
                                        <div
                                            onClick={() => openModal(post.images, 3)}
                                            className='flex justify-center items-center w-[100px] h-[100px] bg-gray-300 rounded cursor-pointer'
                                        >
                                            <span>+{post.images.length - 3}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            <FaRegHeart />

                            <br />
                            <br />
                        </div>
                    ))}
                </div>
                </div>
                 <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="Image Modal"
                        style={{
                            content: {
                                top: '50%',
                                left: '50%',
                                right: 'auto',
                                bottom: 'auto',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'white',
                                padding: '20px',
                                borderRadius: '10px',
                                maxWidth: '80%',
                            },
                        }}
                    >
                        <div className='flex justify-center'>
                            <img
                                src={imagesToDisplay[currentImageIndex]}
                                alt="Full view"
                                className='w-full max-h-[500px] object-contain'
                            />
                        </div>
                        <div className='flex justify-between'>
                            <button onClick={prevImage}>{"<"}</button>
                            <button onClick={nextImage}>{">"}</button>
                        </div>
                        <button onClick={closeModal} className='mt-2'>
                            Close
                        </button>
                    </Modal>
                <Footer />
        </>
    );
};

export default Profile;
