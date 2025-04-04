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
import { IoTrashOutline } from "react-icons/io5";
import ReadMore from '../components/Readmore';
const Profile = () => {
    const handleNavigation = () => {
        navigate('/addQR');
    }
    const { userDetails } = useUser();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const [photourl, setphotourl] = useState(null);
    const [email, setemail] = useState('');
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
    const [profilepic, setprofilepic] = useState(null);
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
    const [CrowdfundingPost, setCrowdfundPost] = useState([]);
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
                const achievementPosts = postsData.filter(post => post.isAchievement === true);
                const CrowdfundingPost = postsData.filter(post => post.enableCrowdFunding === true);
                if (postsData) {
                    setPosts(sortedPosts);
                    setAchievementPost(achievementPosts);
                    setCrowdfundPost(CrowdfundingPost);
                }
            } catch (err) {
                console.error("Error fetching posts:", err);
            }
        }, 1000);
    };
    const deletePost = async (postId) => {
        try {
            const postRef = doc(database, "Users", `${auth.currentUser?.uid}`, "Posts", `${postId}`);
            await deleteDoc(postRef);
            getPost();
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
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
    const [displaypost, setdisplaypost] = useState(true);
    const [displayachievement, setdisplayachievement] = useState(false);
    const [displaycrowdfunding, setdisplaycrowdfunding] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const handledisplaypost = () => {
        setdisplaypost(true);
        setdisplayachievement(false);
        setdisplaycrowdfunding(false);
        setdisplayevent(false);
    }
    const handledisplayachievements = () => {
        setdisplaypost(false);
        setdisplayachievement(true);
        setdisplaycrowdfunding(false);
        setdisplayevent(false);
    }
    const handledisplaycrowd = () => {
        setdisplaypost(false);
        setdisplayachievement(false);
        setdisplaycrowdfunding(true);
        setdisplayevent(false);
    }
    const handledisplayevent = () => {
        setdisplayevent(true);
        setdisplaypost(false);
        setdisplayachievement(false);
        setdisplaycrowdfunding(false);
    }
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
                        setLoading(false);
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
                        setLoading(false);
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
                    await setDoc(documentRef, { isDisabled: isDisabled }, { merge: true });
                    await setDoc(documentRef, { gender: profile.gender || "none" }, { merge: true });
                    await setDoc(profileDetailsRef, { profilePic: profile.profilePic }, { merge: true });
                    const postRef = collection(database, 'Users', `${auth.currentUser?.uid}`, 'Posts');
                    const postSnapshot = await getDocs(postRef);
                    const postsData = postSnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    const updatePromises = postsData.map(async (post) => {
                        const postDocRef = doc(database, 'Users', `${auth.currentUser?.uid}`, 'Posts', post.id);
                        await setDoc(postDocRef, { profilepic: profile.profilePic }, { merge: true });
                    });
                    await Promise.all(updatePromises);
                }

                await setDoc(profileDetailsRef, updatedProfile, { merge: true });

                console.log('Profile and posts updated successfully!');
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
    const capital = (role) => {
        if (role === 'user') {
            return 'User'
        }
        else if (role === 'coach') {
            return 'Coach'
        }
        else if (role === 'athlete') {
            return 'Athlete'
        }
        else if (role === 'organization') {
            return 'Organization '
        }
    };
    const [isDisabled, setisDisabled] = useState("");

  const handleDisabledChange = (e) => {
    setisDisabled(e.target.value);
    setProfile({ ...profile, [e.target.name]: e.target.value })
  };
    const [achievementPost, setAchievementPost] = useState([]);
    const servicesOffered = [
        "Event Hosting",
        "Athlete Training",
        "Coaching",
        "Facility Rental",
        "Sports Equipment Supply",
        "Sports Therapy",
        "Sports Nutrition",
        "Youth Development Programs"
    ];
    const handleChanges = (e, service) => {
        const { checked } = e.target;
        setProfile((prevProfile) => {
            const currentServices = prevProfile.servicesOffered
                ? prevProfile.servicesOffered.split(', ')
                : [];

            if (checked) {
                if (!currentServices.includes(service)) {
                    currentServices.push(service);
                }
            } else {
                const index = currentServices.indexOf(service);
                if (index > -1) {
                    currentServices.splice(index, 1);
                }
            }
            return {
                ...prevProfile,
                servicesOffered: currentServices.join(', '),
            };
        });
    };
    const [displayevent, setdisplayevent] = useState(false);
    if (loading) {
        return <Loading />
    }
    return (
        <>
            <Navbar />
            <h1 style={{ textAlign: 'center', opacity: '0.8', paddingTop: '1%' }}></h1>
            <div className="grid md:grid-cols-2 md:gap-0 gap-6 md:my-4 my-2 md:px-10">
                <div className="bg-white p-4  rounded-lg relative shadow-sm border_grad w-full max-w-2xl">
                    <div className="flex flex-col items-center mb-4">
                        <label className="relative cursor-pointer">
                            <img src={profile.profilePic || profileicon} alt="Profile" onClick={() => openModals(profile.profilePic || profileicon)} className="w-24 h-24 rounded-full object-cover border-2 border-blue-300" />
                        </label>
                    </div>
                    {!decidingorganization && (
                        <>
                            <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                                Personal Information
                                <button onClick={() => setIsEditing(true)} className="flex items-center text-sm text-blue-700 hover:text-blue-300 transition-colors">
                                    <span>Edit Profile</span>
                                </button>
                            </h2>
                            <div className="space-y-3">
                                <p><strong>User Name:</strong> {username || "Not provided"}</p>
                                <p><strong>Logged in as:</strong> {role || "Not provided"}</p>
                                <p><strong>emailId: </strong> {email || "Not provided"}</p>
                                <p><strong>Date of Birth:</strong> {profile.dob || "Not provided"}</p>
                                <p><strong>Gender:</strong> {profile.gender || "Not provided"}</p>
                                <p><strong>State:</strong> {profile.state || "Not provided"}</p>
                            </div>
                        </>
                    )}
                    {decidingorganization && (
                        <>
                            <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                                Organization Information
                                <button onClick={() => setIsEditing(true)} className="flex items-center text-sm text-blue-700 hover:text-blue-400 transition-colors">
                                    <span>Edit Profile</span>
                                </button>
                            </h2>
                            <div className="space-y-3">
                                <p><strong>Organization Name:</strong> {username || "Not provided"}</p>
                                <p><strong>Primary Contact Person:</strong> {profile.primaryPerson || "Not provided"}</p>
                                <p><strong>Email of primary Contact Person:</strong> {profile.primaryPersonEmail || "Not provided"}</p>
                                <p><strong>Logged in as:</strong> {role || "Not provided"}</p>
                                <p><strong>Organization's emailId: </strong> {email || "Not provided"}</p>
                                <p><strong>Date of Establishment:</strong> {profile.dob || "Not provided"}</p>
                                <p><strong>State of main Operation:</strong> {profile.state || "Not provided"}</p>
                                <p><strong>Website URL:</strong> {profile.websiteUrl || "Not provided"}</p>
                                <p><strong>Organization Type:</strong> {profile.organizationType || "Not provided"}</p>
                                <p style={{whiteSpace:'pre-line'}}><strong>Mission or Brief Description of your Organization:</strong> <br />{profile.mission || "Not provided"}</p>
                            </div>
                        </>
                    )}
                </div>

                {decidingathlete && (
                    <div className="bg-white shadow-sm p-4 rounded-lg h-full border_grad">
                        <h2 className="text-xl font-semibold mb-4">Sports Information</h2>
                        <div className="space-y-3">
                            <p><strong>Primary Sport:</strong> {profile.primarySport || "None"}</p>
                            <p><strong>Secondary Sport:</strong> {profile.secondarySport || "None"}</p>
                            <p><strong>Years of Experience:</strong> {profile.experience || "None"}</p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Teams You have played for: </strong> <br /> {profile.teamName || "None"}</p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Your achievements as a player: </strong> <br /> <ReadMore text={profile.achievements || "None"} /> </p>
                            <h1><strong>Upload your QR code to receive financial support for your athletic journey</strong></h1>
                            <Button onClick={handleNavigation}>Upload QR Code</Button>
                        </div>
                    </div>

                )}
                {decidingcoach && (
                    <div className="bg-white shadow-sm p-4 rounded-lg h-full border_grad ">
                        <h2 className="text-xl font-semibold mb-4">Sports Information</h2>
                        <div className="space-y-3">
                            <p><strong>Your primary Sport of coaching: </strong> {profile.primarySport || "None"}</p>
                            <p><strong>Your secondary Sport of coaching:</strong> {profile.secondarySport || "None"}</p>
                            <p ><strong>Years of Experience:</strong> {profile.experience || "None"}</p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Teams You have coached for: </strong> <ReadMore text={profile.teamName || "None"} /></p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Your achievements as a coach: </strong> <br /> <ReadMore text={profile.achievements || "None"} /></p>
                            <p><strong>Kindly upload your QR code to facilitate donations for training your students.</strong></p>
                            <Button onClick={handleNavigation}>Upload QR Code</Button>
                        </div>
                    </div>


                )}
                {decidinguser && (
                    <div className="bg-white shadow-sm p-4 rounded-lg h-full border_grad">
                        <h2 className="text-xl font-semibold mb-4">Sports Information</h2>
                        <div className="space-y-3">
                            <p><strong>The sports which majorly interest you: </strong> {profile.primarySport || "None"}</p>
                            <p><strong>The other sport which interests you: </strong> {profile.secondarySport || "None"}</p>
                            <p style={{whiteSpace:'pre-line'}}><strong style={{whiteSpace:'pre-line'}}>Your favorite sports moments: </strong> <br /> {profile.achievements || "None"}</p>
                            <p style={{whiteSpace:'pre-line'}}><strong style={{whiteSpace:'pre-line'}}>Your favorite teams: </strong> <br /> {profile.teamName || "None"}</p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Approximate number of years you have been interested in these sports: </strong> {profile.experience || "None"}</p>
                            <p><strong>Kindly upload your QR code to facilitate money transactions between your network</strong></p>
                            <Button onClick={handleNavigation}>Upload QR Code</Button>
                        </div>
                    </div>

                )}
                {decidingorganization && (
                    <div className="bg-white shadow-sm p-4 rounded-lg h-full border_grad">
                        <h2 className="text-xl font-semibold mb-4">Sports Information</h2>
                        <div className="space-y-3">
                            <p><strong>The sports which you focus primarily: </strong> {profile.primarySport || "None"}</p>
                            <p><strong>Other sports of focus: </strong> {profile.secondarySport || "None"}</p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Type of services offered: </strong> <br /> <ReadMore text={profile.servicesOffered || "None"} /></p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Achievement Highlights: </strong> <ReadMore text={profile.achievements || "None"} /></p>
                        </div>
                    </div>

                )}
                {isEditing && (
                    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                            <div className="space-y-3">
                                <label>Upload Profile Picture</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 rounded w-full" />
                                {decidingorganization && (
                                    <h1>Date of Establishment:</h1>
                                )}
                                <input type="date" name="dob" value={profile.dob} onChange={handleChange} className="border p-2 rounded w-full" />
                                {!decidingorganization && (
                                    <select name="gender" value={profile.gender} onChange={handleChange} className="border p-2 rounded w-full">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                )}
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
                                        <br />
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            }}>
                                            <h1 style={{ fontSize: '18px', marginBottom: '15px' }}>
                                                <strong>Are you an athlete with a disability?</strong>
                                            </h1>

                                            <div style={{ display: 'flex', gap: '20px' }}>
                                                <label style={{ fontSize: '16px' }}>
                                                <input
                                                    type="radio"
                                                    name="isDisabled"
                                                    value="yes"
                                                    checked={isDisabled === "yes"}
                                                    onChange={handleDisabledChange}
                                                    style={{ marginRight: '8px' }}
                                                />
                                                Yes
                                                </label>

                                                <label style={{ fontSize: '16px' }}>
                                                <input
                                                    type="radio"
                                                    name="isDisabled"
                                                    value="no"
                                                    checked={isDisabled === "no"}
                                                    onChange={handleDisabledChange}
                                                    style={{ marginRight: '8px' }}
                                                />
                                                No
                                                </label>
                                            </div>
                                        </div>
                                        <br />
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
                                {decidingorganization && (
                                    <>
                                        <input type="text" name="primaryPersonEmail" placeholder="Email of the primary contact person" value={profile.primaryPersonEmail} onChange={handleChange} className="border p-2 rounded w-full" />
                                        <input type="text" name="primaryPerson" placeholder="name of the primary contact person" value={profile.primaryPerson} onChange={handleChange} className="border p-2 rounded w-full" />
                                        <select name="primarySport" value={profile.primarySport} onChange={handleChange} className="border p-2 rounded w-full">
                                            <option value="">Select the sports which you focus primarily</option>
                                            {sportsArray.map((state) => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                        <select name="secondarySport" value={profile.secondarySport} onChange={handleChange} className="border p-2 rounded w-full">
                                            <option value="">Select the other sports which you focus</option>
                                            {sportsArray.map((state) => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                        <h1>Types of services offered:</h1>
                                        <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            {servicesOffered.map((service) => (
                                                <label key={service}>
                                                    <input
                                                        type="checkbox"
                                                        name="servicesOffered"
                                                        value={service}
                                                        checked={(profile.servicesOffered || "").split(', ').includes(service)} // Check if the service is selected
                                                        onChange={(e) => handleChanges(e, service)}
                                                        className="form-checkbox text-blue-500"
                                                    />
                                                    <span className="ml-2">{service}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <textarea name='achievements' placeholder='Your achievements as an organization' value={profile.achievements} onChange={handleChange} style={textareaStyle} onFocus={(e) => e.target.style.border = focusStyle.border} onBlur={(e) => e.target.style.border = blurStyle.border} />
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

                <div className=' mt- mb-7 md:col-span-2 flex flex-col items-center'>
                    {decidinguser && (
                        <>
                            <nav className="flex items-center justify-center w-full p-4 rounded-xl">

                                <button
                                    onClick={() => setdisplayevent(true)}
                                    style={{ backgroundColor: displayevent ? "blue" : "rgb(219 234 254)", color: displayevent ? "white" : "rgb(29 78 216)" }}
                                    className="mx-3 rounded-full border text-md py-2 px-6  transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
                                >
                                    Events
                                </button>

                                <button
                                    onClick={() => setdisplayevent(false)}
                                    style={{ backgroundColor: displayevent ? "rgb(219 234 254)" : "blue", color: displayevent ? "rgb(29 78 216)" : "white" }}
                                    className="mx-3 rounded-full border text-md py-2 px-6  transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none "
                                >
                                    All Posts
                                </button>
                            </nav>

                            {!displayevent && (
                                <>
                                    {posts.map((post) => (
                                        <div
                                            key={post.id}
                                            className='bg-white rounded-xl mb-5 md:w-[70%] w-[98%]'
                                        >
                                            <div className='pl-5'>
                                                <div className='flex flex-row' style={{ justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                                        {post.isEvent && (
                                                            <div className='absolute w-full'>

                                                                <div className='absolute right-0 rounded-full border px-3 text-center border-blue-700 md:mt-4 mt-14 '>Event ✅</div>
                                                            </div>
                                                        )}
                                                        <img
                                                            className='cursor-pointer mt-6'
                                                            src={profile.profilePic || profileicon}
                                                            alt={profileicon}
                                                            style={{
                                                                height: '65px',
                                                                width: '65px',
                                                                borderRadius: '50%',
                                                                backgroundColor: 'gray',
                                                                marginRight: '20px',
                                                            }}
                                                            onClick={() => openModals(profile.profilePic || profileicon)}
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
                                                                            background: 'black',
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
                                                            <h1 className='font-bold text-lg mt-5'>{post.username}</h1>
                                                            <h1>{capital(post.role)}</h1>
                                                        </div>
                                                        <h3 className='mt-8 text-gray-400 text-sm ml-4'>{formatTimestamp(post.timestamp)}</h3>
                                                    </div>
                                                    <div style={{ position: "relative" }}>
                                                        {/* Three Dots Button */}
                                                        <button onClick={() => setOpenDropdownId(openDropdownId === post.id ? null : post.id)} className='font-extrabold mr-3 mt-3 hover:bg-gray-200 focus:bg-gray-200 px-2.5 rounded-full'>⋮</button>

                                                        {/* Dropdown Menu */}
                                                        {openDropdownId === post.id && (
                                                            <div onClick={() => deletePost(post.id)} className='md:w-[10vw] w-[30vw] border rounded-lg cursor-pointer hover:bg-gray-50 bg-white mr-0.5' style={{
                                                                position: "absolute",
                                                                right: 0,
                                                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                                padding: "5px"
                                                            }}>
                                                                <button  style={{ display: "flex", alignItems: "center", border: "none", background: "none", cursor: "pointer" }}>
                                                                <IoTrashOutline className='text-red-600 ml-0.5 text-base' />
                                                                    <p className='ml-3 text-red-600'>Delete</p>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <br />
                                                <h1 className='ml-5'><ReadMore text={post.textPost} /></h1>
                                            </div>
                                            <div>
                                                <div className='text-2xl font-bold ml-5 mb-3'>
                                                    {post.title}
                                                </div>
                                                {post.isEvent && (
                                                    <div className='ml-6' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', alignContent: 'center' }}>
                                                        <h1>
                                                            <strong>Organized by: {post.organizer}</strong>
                                                        </h1>
                                                    </div>
                                                )}
                                                {post.isEvent && (
                                                    <div className='ml-6'>
                                                        <h1><strong>{post.eventstartdate && 'Event starts on: '}</strong> {post.eventstartdate} {post.eventstarttime && 'at'} {post.eventstarttime}</h1>
                                                        <h1><strong>{post.eventstartdate && 'Event ends on: '}</strong> {post.eventenddate} {post.eventendtime && 'at'} {post.eventendtime}</h1>
                                                        <h1><strong>{post.eventlocation && 'Event venue: '}</strong> {post.eventlocation} </h1>
                                                    </div>
                                                )}
                                                <br />
                                                <h2 className='whitespace-pre-wrap text-base ml-6 mr-2'><ReadMore text={post.description} /></h2>
                                            </div>

                                            {post.images && post.images.length > 0 && (
                                                <div className='flex flex-col pl-5 py-1 pr-5'>
                                                    {post.images.slice(0, 1).map((image, index) => (
                                                        <div className='flex bg-gray-50 justify-center rounded-lg py-2'>
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Post Image ${index}`}
                                                                className='w-fit h-fit md:max-h-[550px] md:max-w-[700px] rounded object-cover cursor-pointer'
                                                                onClick={() => openModal(post.images, index)}
                                                            />
                                                        </div>
                                                    ))}
                                                    <div className='flex gap-2 justify-start '>
                                                        {post.images.slice(1, 3).map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Post Image ${index}`}
                                                                className='w-[100px] h-[100px] rounded object-cover cursor-pointer mb-4 border '
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
                                                </div>
                                            )}
                                            
                                        </div>
                                    ))}
                                </>
                            )}
                            {displayevent && (
                                <>
                                    {posts.filter(post => post.isEvent === true).map((post) => (
                                        <div
                                            key={post.id}
                                            className='bg-white rounded-xl mb-5 md:w-[70%] w-[98%]'
                                        >
                                            <div className='pl-5'>
                                                <div className='flex flex-row' style={{ justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                                        {post.isEvent && (
                                                            <div className='absolute w-full'>

                                                                <div className='absolute right-0 rounded-full border px-3 text-center border-blue-700 md:mt-4 mt-14 '>Event ✅</div>
                                                            </div>
                                                        )}
                                                        <img
                                                            className='mt-6'
                                                            src={profile.profilePic || profileicon}
                                                            alt={profileicon}
                                                            style={{
                                                                height: '65px',
                                                                width: '65px',
                                                                borderRadius: '50%',
                                                                backgroundColor: 'gray',
                                                                marginRight: '20px',
                                                            }}
                                                            onClick={() => openModals(profile.profilePic || profileicon)}
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
                                                                            background: 'black',
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
                                                            <h1 className='font-bold text-lg mt-5'>{post.username}</h1>
                                                            <h1>{capital(post.role)}</h1>
                                                        </div>
                                                        <h3 className='mt-8 text-gray-400 text-sm ml-4'>{formatTimestamp(post.timestamp)}</h3>
                                                    </div>
                                                    <div style={{ position: "relative" }}>
                                                        {/* Three Dots Button */}
                                                        <button onClick={() => setOpenDropdownId(openDropdownId === post.id ? null : post.id)} className='font-extrabold mr-3 mt-3 hover:bg-gray-200 focus:bg-gray-200 px-2.5 rounded-full'>⋮</button>

                                                        {/* Dropdown Menu */}
                                                        {openDropdownId === post.id && (
                                                            <div onClick={() => deletePost(post.id)} className='md:w-[10vw] w-[30vw] border rounded-lg cursor-pointer hover:bg-gray-50 bg-white mr-0.5' style={{
                                                                position: "absolute",
                                                                right: 0,
                                                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                                padding: "5px"
                                                            }}>
                                                                <button  style={{ display: "flex", alignItems: "center", border: "none", background: "none", cursor: "pointer" }}>
                                                                <IoTrashOutline className='text-red-600 ml-0.5 text-base' />
                                                                    <p className='ml-3 text-red-600'>Delete</p>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>                                              
                                                </div>

                                                <br />
                                                <h1 className='ml-5'><ReadMore text={post.textPost} /></h1>
                                            </div>
                                            <div>
                                                <div className='text-2xl font-bold ml-5 mb-3'>
                                                    {post.title}
                                                </div>
                                                {post.isEvent && (
                                                    <div className='ml-6' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', alignContent: 'center' }}>
                                                        <h1>
                                                            <strong>Organized by: {post.organizer}</strong>
                                                        </h1>
                                                    </div>
                                                )}
                                                {post.isEvent && (
                                                    <div className='ml-6'>
                                                        <h1><strong>{post.eventstartdate && 'Event starts on: '}</strong> {post.eventstartdate} {post.eventstarttime && 'at'} {post.eventstarttime}</h1>
                                                        <h1><strong>{post.eventstartdate && 'Event ends on: '}</strong> {post.eventenddate} {post.eventendtime && 'at'} {post.eventendtime}</h1>
                                                        <h1><strong>{post.eventlocation && 'Event venue: '}</strong> {post.eventlocation} </h1>
                                                    </div>
                                                )}
                                                <br />
                                                <h2 className='whitespace-pre-wrap text-base ml-6 mr-2'><ReadMore text={post.description} /></h2>
                                            </div>
                                            <br />
                                            {post.images && post.images.length > 0 && (
                                                <div className='flex flex-col pl-5 py-1 pr-5'>
                                                    {post.images.slice(0, 1).map((image, index) => (
                                                        <div className="flex bg-gray-50 justify-center rounded-lg py-2">
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Post Image ${index}`}
                                                                className='w-fit h-fit md:max-h-[550px] md:max-w-[700px] rounded object-cover cursor-pointer'
                                                                onClick={() => openModal(post.images, index)}
                                                            />
                                                        </div>

                                                    ))}
                                                    <br />
                                                    <div className='flex gap-2 justify-start '>
                                                        {post.images.slice(1, 3).map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Post Image ${index}`}
                                                                className='w-[100px] h-[100px] rounded object-cover cursor-pointer mb-4 border '
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
                                                </div>
                                            )}

                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                    {!decidinguser && (
                        <>
                            <nav style={{ justifyContent: 'space-evenly' }} className="w-full flex items-center p-1 rounded-full bg-gradient-to-r from-black via-black to-gray-900 shadow-lg justify-center my-3 mt-6">
                                <button onClick={() => handledisplaypost()} className="text-white text-center text-xs font-semibold rounded-full hover:bg-blue-700 py-1 md:px-2 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300">
                                    <h1 className="px-2">Posts</h1>
                                </button>
                                <p className='text-white mb-2 text-xl'>|</p>
                                <button onClick={() => handledisplayachievements()} className="text-white text-xs font-semibold rounded-full hover:bg-blue-700 py-1 md:px-2 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300">
                                    <h1 className="px-2">Achievement</h1>
                                </button>
                                <p className='text-white mb-2 text-xl'>|</p>
                                <button onClick={() => handledisplayevent()} className="text-white text-xs font-semibold rounded-full hover:bg-blue-700 py-1 md:px-2 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300">
                                    <h1 className="px-2">Events</h1>
                                </button>
                                <p className='text-white mb-2 text-xl'>|</p>
                                <button onClick={() => handledisplaycrowd()} className="text-white text-xs font-semibold rounded-full hover:bg-blue-700 py-1 md:px-2 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300">
                                    <h1 className='px-2'>Crowdfunding</h1>
                                </button>
                            </nav>

                            <br />
                            {displayevent && (
                                <>
                                    {posts.filter(post => post.isEvent === true).map((post) => (
                                        <div
                                            key={post.id}
                                            className='bg-white rounded-xl mb-5 md:w-[70%] w-[98%]'
                                        >
                                            <div className='pl-5'>
                                                <div className='flex flex-row' style={{ justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                                        {post.isEvent && (
                                                            <div className='absolute w-full'>

                                                                <div className='absolute right-0 rounded-full border px-3 text-center border-blue-700 md:mt-4 mt-14 '>Event ✅</div>
                                                            </div>
                                                        )}
                                                        <img
                                                            className='mt-5'
                                                            src={profile.profilePic || profileicon}
                                                            alt={profileicon}
                                                            style={{
                                                                height: '65px',
                                                                width: '65px',
                                                                borderRadius: '50%',
                                                                backgroundColor: 'gray',
                                                                marginRight: '20px',
                                                            }}
                                                            onClick={() => openModals(profile.profilePic || profileicon)}
                                                        />
                                                        {isModalOpened && (
                                                            <div
                                                                style={{
                                                                    position: 'fixed',
                                                                    top: 0,
                                                                    left: 0,
                                                                    right: 0,
                                                                    bottom: 0,
                                                                    backgroundColor: 'rgba(86, 84, 84, 0.1)',
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
                                                                            background: 'black',
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

                                                            <h1 className='font-bold text-lg mt-5'>{post.username}</h1>
                                                            <h1>{capital(post.role)}</h1>

                                                        </div>
                                                        <h3 className='mt-8 text-gray-400 text-sm ml-4'>{formatTimestamp(post.timestamp)}</h3>
                                                    </div>
                                                    <div style={{ position: "relative" }}>
                                                        {/* Three Dots Button */}
                                                        <button onClick={() => setOpenDropdownId(openDropdownId === post.id ? null : post.id)} className='font-extrabold mr-3 mt-3 hover:bg-gray-200 focus:bg-gray-200 px-2.5 rounded-full'>⋮</button>

                                                        {/* Dropdown Menu */}
                                                        {openDropdownId === post.id && (
                                                            <div onClick={() => deletePost(post.id)} className='md:w-[10vw] w-[30vw] border rounded-lg cursor-pointer hover:bg-gray-50 bg-white mr-0.5' style={{
                                                                position: "absolute",
                                                                right: 0,
                                                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                                padding: "5px"
                                                            }}>
                                                                <button  style={{ display: "flex", alignItems: "center", border: "none", background: "none", cursor: "pointer" }}>
                                                                <IoTrashOutline className='text-red-600 ml-0.5 text-base' />
                                                                    <p className='ml-3 text-red-600'>Delete</p>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>                                       
                                                </div>

                                                <h1 className='ml-5'><ReadMore text={post.textPost} /></h1>
                                            </div>
                                            <div>
                                                <div className='text-2xl font-bold ml-5 mb-3'>
                                                    {post.title}
                                                </div>
                                                {post.isEvent && (
                                                    <div className='ml-6' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', alignContent: 'center' }}>
                                                        <h1>
                                                            <strong>Organized by: {post.organizer}</strong>
                                                        </h1>
                                                    </div>
                                                )}
                                                {post.isEvent && (
                                                    <div className='ml-6'>
                                                        <h1><strong>{post.eventstartdate && 'Event starts on: '}</strong> {post.eventstartdate} {post.eventstarttime && 'at'} {post.eventstarttime}</h1>
                                                        <h1><strong>{post.eventstartdate && 'Event ends on: '}</strong> {post.eventenddate} {post.eventendtime && 'at'} {post.eventendtime}</h1>
                                                        <h1><strong>{post.eventlocation && 'Event venue: '}</strong> {post.eventlocation} </h1>
                                                    </div>
                                                )}
                                                <br />
                                                <h2 className='whitespace-pre-wrap text-base ml-6 mr-2'><ReadMore text={post.description} /></h2>
                                            </div>

                                            {post.images && post.images.length > 0 && (
                                                <div className='flex flex-col pl-5 py-1 pr-5'>
                                                    {post.images.slice(0, 1).map((image, index) => (
                                                        <div className="flex bg-gray-50 justify-center rounded-lg py-2">
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Post Image ${index}`}
                                                                className='w-fit h-fit md:max-h-[550px] md:max-w-[700px] rounded object-cover cursor-pointer'
                                                                onClick={() => openModal(post.images, index)}
                                                            />
                                                        </div>

                                                    ))}
                                                    <br />
                                                    <div className='flex gap-2 justify-start '>
                                                        {post.images.slice(1, 3).map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Post Image ${index}`}
                                                                className='w-[100px] h-[100px] rounded object-cover cursor-pointer mb-4 border '
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
                                                </div>
                                            )}

                                        </div>
                                    ))}
                                </>
                            )}
                            {displaypost && (
                                <>
                                    {posts.map((post) => (

                                        <div
                                            key={post.id}
                                            className='bg-white rounded-xl mb-5 md:w-[70%] w-[98%]'
                                        >
                                            <div className='pl-5'>
                                                <div className='flex flex-row' style={{ justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                                        {post.isEvent && (
                                                            <div className='absolute w-full'>

                                                                <div className='absolute right-0 rounded-full border px-3 text-center border-blue-700 md:mt-4 mt-14 '>Event ✅</div>
                                                            </div>
                                                        )}
                                                        <img
                                                            className='mt-6'
                                                            src={profile.profilePic || profileicon}
                                                            alt={profileicon}
                                                            style={{
                                                                height: '65px',
                                                                width: '65px',
                                                                borderRadius: '50%',
                                                                backgroundColor: 'gray',
                                                                marginRight: '20px',
                                                            }}
                                                            onClick={() => openModals(profile.profilePic || profileicon)}
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
                                                                            background: 'black',
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
                                                            <h1 className='font-bold text-lg mt-5'>{post.username}</h1>
                                                            <h1>{capital(post.role)}</h1>
                                                        </div>
                                                        <h3 className='mt-8 text-gray-400 text-sm ml-4'>{formatTimestamp(post.timestamp)}</h3>
                                                    </div>
                                                    <div style={{ position: "relative" }}>
                                                        {/* Three Dots Button */}
                                                        <button onClick={() => setOpenDropdownId(openDropdownId === post.id ? null : post.id)} className='font-extrabold mr-3 mt-3 hover:bg-gray-200 focus:bg-gray-200 px-2.5 rounded-full'>⋮</button>

                                                        {/* Dropdown Menu */}
                                                        {openDropdownId === post.id && (
                                                            <div onClick={() => deletePost(post.id)} className='md:w-[10vw] w-[30vw] border rounded-lg cursor-pointer hover:bg-gray-50 bg-white mr-0.5' style={{
                                                                position: "absolute",
                                                                right: 0,
                                                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                                padding: "5px"
                                                            }}>
                                                                <button  style={{ display: "flex", alignItems: "center", border: "none", background: "none", cursor: "pointer" }}>
                                                                <IoTrashOutline className='text-red-600 ml-0.5 text-base' />
                                                                    <p className='ml-3 text-red-600'>Delete</p>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>                                                
                                                </div>
                                                <br />
                                                <h1><ReadMore text={post.textPost} /></h1>
                                            </div>
                                            <div>
                                                <div className='text-2xl font-bold ml-4'>
                                                    {post.title}
                                                </div>
                                                <h2 className='whitespace-pre-wrap text-base ml-6 mr-2'><ReadMore text={post.description} /></h2>
                                            </div>

                                            {post.images && post.images.length > 0 && (
                                                <div className='flex flex-col pl-5 py-1 pr-5'>
                                                    {post.images.slice(0, 1).map((image, index) => (
                                                        <div className="flex bg-gray-50 justify-center rounded-lg py-2">
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Post Image ${index}`}
                                                                className='w-fit h-fit md:max-h-[550px] md:max-w-[700px] rounded object-cover cursor-pointer'
                                                                onClick={() => openModal(post.images, index)}
                                                            />
                                                        </div>

                                                    ))}
                                                    <br />
                                                    <div className='flex gap-2 justify-start '>
                                                        {post.images.slice(1, 3).map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Post Image ${index}`}
                                                                className='w-[100px] h-[100px] rounded object-cover cursor-pointer mb-4 border '
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
                                                </div>
                                            )}

                                        </div>
                                    ))}
                                </>
                            )}
                            {displayachievement && (
                                <>
                                    {achievementPost.map((post) => (

                                        <div
                                            key={post.id}
                                            className='bg-white rounded-xl mb-5 w-[98%] md:w-[70%]'
                                        >
                                            <div className='pl-5'>
                                                <div className='flex flex-row' style={{ justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                                        <img
                                                            className='mt-6'
                                                            src={profile.profilePic || profileicon}
                                                            alt={profileicon}
                                                            style={{
                                                                height: '65px',
                                                                width: '65px',
                                                                borderRadius: '50%',
                                                                backgroundColor: 'gray',
                                                                marginRight: '20px',
                                                            }}
                                                            onClick={() => openModals(profile.profilePic || profileicon)}
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
                                                                            background: 'black',
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
                                                            <h1 className='font-bold text-lg mt-5'>{post.username}</h1>
                                                            <h1>{capital(post.role)}</h1>
                                                        </div>
                                                        <h3 className='mt-8 text-gray-400 text-sm ml-4'>{formatTimestamp(post.timestamp)}</h3>
                                                    </div>
                                                    <div style={{ position: "relative" }}>
                                                        {/* Three Dots Button */}
                                                        <button onClick={() => setOpenDropdownId(openDropdownId === post.id ? null : post.id)} className='font-extrabold mr-3 mt-3 hover:bg-gray-200 focus:bg-gray-200 px-2.5 rounded-full'>⋮</button>

                                                        {/* Dropdown Menu */}
                                                        {openDropdownId === post.id && (
                                                            <div onClick={() => deletePost(post.id)} className='md:w-[10vw] w-[30vw] border rounded-lg cursor-pointer hover:bg-gray-50 bg-white mr-0.5' style={{
                                                                position: "absolute",
                                                                right: 0,
                                                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                                padding: "5px"
                                                            }}>
                                                                <button  style={{ display: "flex", alignItems: "center", border: "none", background: "none", cursor: "pointer" }}>
                                                                <IoTrashOutline className='text-red-600 ml-0.5 text-base' />
                                                                    <p className='ml-3 text-red-600'>Delete</p>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>                                                
                                                </div>
                                                <br />
                                                <h1 className='md:mx-4 whitespace-pre-wrap'><ReadMore text={post.textPost} /></h1>
                                            </div>
                                            <div>
                                                <div className='text-2xl font-bold ml-4'>
                                                    {post.title}
                                                </div>
                                                <h2 className='whitespace-pre-wrap text-base ml-6 mr-2'><ReadMore text={post.description} /></h2>
                                            </div>

                                            {post.images && post.images.length > 0 && (
                                                <div className='flex flex-col pl-5 py-1 pr-5'>
                                                    {post.images.slice(0, 1).map((image, index) => (
                                                        <div className="flex bg-gray-50 justify-center rounded-lg py-2">
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Post Image ${index}`}
                                                                className='w-fit h-fit md:max-h-[550px] md:max-w-[700px] rounded object-cover cursor-pointer'
                                                                onClick={() => openModal(post.images, index)}
                                                            />
                                                        </div>

                                                    ))}
                                                    <br />
                                                    <div className='flex gap-2 justify-start '>
                                                        {post.images.slice(1, 3).map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Post Image ${index}`}
                                                                className='w-[100px] h-[100px] rounded object-cover cursor-pointer mb-4 border '
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
                                                </div>
                                            )}

                                        </div>
                                    ))}
                                </>
                            )}
                            {displaycrowdfunding && (
                                <>
                                    {CrowdfundingPost.map((post) => (

                                        <div
                                            key={post.id}
                                            className='bg-white rounded-xl mb-5 w-[98%] md:w-[70%]'
                                        >
                                            <div className='pl-5'>
                                                <div className='flex flex-row justify-between'>
                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                                        <img
                                                            className='mt-6'
                                                            src={profile.profilePic || profileicon}
                                                            alt={profileicon}
                                                            style={{
                                                                height: '65px',
                                                                width: '65px',
                                                                borderRadius: '50%',
                                                                backgroundColor: 'gray',
                                                                marginRight: '20px',
                                                            }}
                                                            onClick={() => openModals(profile.profilePic || profileicon)}
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
                                                            <h1 className='font-bold text-lg mt-5'>{post.username}</h1>
                                                            <h1>{capital(post.role)}</h1>
                                                        </div>
                                                        <h3 className='mt-8 text-gray-400 text-sm ml-4'>{formatTimestamp(post.timestamp)}</h3>
                                                    </div>
                                                    <div style={{ position: "relative" }}>
                                                        {/* Three Dots Button */}
                                                        <button onClick={() => setOpenDropdownId(openDropdownId === post.id ? null : post.id)} className='font-extrabold mr-3 mt-3 hover:bg-gray-200 focus:bg-gray-200 px-2.5 rounded-full'>⋮</button>

                                                        {/* Dropdown Menu */}
                                                        {openDropdownId === post.id && (
                                                            <div onClick={() => deletePost(post.id)} className='md:w-[10vw] w-[30vw] border rounded-lg cursor-pointer hover:bg-gray-50 bg-white mr-0.5' style={{
                                                                position: "absolute",
                                                                right: 0,
                                                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                                padding: "5px"
                                                            }}>
                                                                <button  style={{ display: "flex", alignItems: "center", border: "none", background: "none", cursor: "pointer" }}>
                                                                <IoTrashOutline className='text-red-600 ml-0.5 text-base' />
                                                                    <p className='ml-3 text-red-600'>Delete</p>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>                                                
                                                </div>
                                                <h1 className='whitespace-pre-wrap text-base mr-2 mt-4'><ReadMore text={post.textPost} /></h1>
                                            </div>
                                            <div>
                                                <div className='text-2xl font-bold ml-4'>
                                                    {post.title}
                                                </div>
                                                <h2 className='whitespace-pre-wrap text-base ml-6 mr-2'><ReadMore text={post.description} /></h2>
                                            </div>

                                            {post.images && post.images.length > 0 && (
                                                <div className='flex flex-col pl-5 py-1 pr-5'>
                                                    {post.images.slice(0, 1).map((image, index) => (
                                                        <div className="flex bg-gray-50 justify-center rounded-lg py-2">
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Post Image ${index}`}
                                                                className='w-fit h-fit md:max-h-[550px] md:max-w-[700px] rounded object-cover cursor-pointer'
                                                                onClick={() => openModal(post.images, index)}
                                                            />
                                                        </div>

                                                    ))}
                                                    <br />
                                                    <div className='flex gap-2 justify-start '>
                                                        {post.images.slice(1, 3).map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Post Image ${index}`}
                                                                className='w-[100px] h-[100px] rounded object-cover cursor-pointer mb-4 border '
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
                                                </div>
                                            )}

                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Image Modal"
                className="bg-white p-5 rounded-lg shadow-lg outline-none md:w-[80%] md:h-[85%] md:mt-20 m-4"
                overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center"
            >
                <div className='flex justify-center'>
                    <img
                        src={imagesToDisplay[currentImageIndex]}
                        alt="Full view"
                        className='h-[400px] w-[800px] md:h-[500px] md:w-[80%] object-contain'
                    />
                </div>
                <div className='flex justify-between'>
                    <button className='text-xl font-bold russo ml-10' onClick={prevImage}>{"<"}</button>
                    <button className='text-xl font-bold russo mr-10' onClick={nextImage}>{">"}</button>
                </div>
                <button onClick={closeModal} className='mt-4 ml-7 bg-black text-white rounded-lg px-3 py-1 font-bold hover:scale-105 transition-all'>
                    Close
                </button>
            </Modal>
            <Footer />
        </>
    );
};

export default Profile;
