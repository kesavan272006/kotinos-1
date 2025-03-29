import Navbar from '../components/navbar';
import addprofile from '../assets/profileadd.svg';
import { useUser } from '../components/UserContext';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import ReadMore from '../components/Readmore';
const OtherProfile = () => {
    const { userId } = useParams();  
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const [photourl, setphotourl] = useState(null);
    const [email, setemail]=useState('');
    const auth = getAuth();
    const user = auth.currentUser;
    const [posts, setPosts] = useState([]);
    const [displayevent, setdisplayevent] = useState(false);
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
    const [achievementPost, setAchievementPost]=useState([]);
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
    const [displaypost, setdisplaypost]=useState(true);
    const [displayachievement, setdisplayachievement]=useState(false);
    const [displaycrowdfunding, setdisplaycrowdfunding]=useState(false);
    const closeModals = () => {
        setIsModalOpened(false);
    };
    const [CrowdfundingPost, setCrowdfundPost]=useState([]);
    const getPost = async () => {
        setTimeout(async () => {
            try {
                const postRef = collection(database, 'Users', `${userId}`, 'Posts');
    
                const postSnapshot = await getDocs(postRef);
                const postsData = postSnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                    userId: `${userId}`,
                }));
    
                const sortedPosts = postsData.sort((a, b) => {
                    const aTimestamp = a.timestamp?.seconds || 0;
                    const bTimestamp = b.timestamp?.seconds || 0;
                    return bTimestamp - aTimestamp;
                });
                const achievementPosts = postsData.filter(post => post.isAchievement === true);
                const Crowdfundingpost = postsData.filter(post => post.enableCrowdFunding === true);
                if (postsData) {
                    setPosts(sortedPosts);
                    setAchievementPost(achievementPosts); 
                    setCrowdfundPost(Crowdfundingpost);
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
    useEffect(() => {
        const fetchProfile = async () => {
            if (auth.currentUser) {
                try {
                    const docRef = doc(database, "Users", `${userId}`);
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
    
    const decidingathlete = role === 'athlete'; 
    const decidingcoach = role === 'coach'; 
    const decidinguser = role === 'user';
    const decidingorganization = role === 'organization';
    const handlenavigation = (userId) => {
        navigate(`/displayQr/${userId}`);
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        const fetchProfile2 = async () => {
            
            if (user) {
                try {
                    const docRef = doc(database, "Users", `${userId}`);
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
                            <img src={profile.profilePic || profileicon} alt="Profile" onClick={()=>openModals(profile.profilePic || profileicon)} className="w-24 h-24 rounded-full object-cover border-2 border-blue-300" />
                        </label>
                    </div>
                    {!decidingorganization && (
                        <>
                            <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                                Personal Information
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
                                <p style={{whiteSpace:'pre-line'}}><strong>Mission or Brief Description of your Organization:</strong> <br /><ReadMore text={profile.mission || "Not provided"} /></p>
                            </div>
                        </>
                    )}
                </div>
                {decidingorganization && (
                    <div className="bg-white shadow-sm p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Sports Information</h2>
                        <div className="space-y-3">
                            <p><strong>The sports which you focus primarily: </strong> {profile.primarySport || "None"}</p>
                            <p><strong>Other sports of focus: </strong> {profile.secondarySport || "None"}</p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Type of services offered: </strong> <br /> <ReadMore text={profile.servicesOffered || "None"} /></p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Achievement Highlights: </strong> <ReadMore text={profile.achievements || "None"} /></p>
                        </div>
                    </div>
                )}
                {decidingathlete && (
                    <div className="bg-white shadow-sm p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Sports Information</h2>
                        <div className="space-y-3">
                            <p><strong>Primary Sport:</strong> {profile.primarySport || "None"}</p>
                            <p><strong>Secondary Sport:</strong> {profile.secondarySport || "None"}</p>
                            <p><strong>Years of Experience:</strong> {profile.experience || "None"}</p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Teams they have played for: </strong> <br /> <ReadMore text={profile.teamName || "None"} /></p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Achievements as a player: </strong> <br /> <ReadMore text={profile.achievements || "None"} /></p>
                        </div>
                    </div>
                )}
                {decidingcoach && (
                    <div className="bg-white shadow-sm p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Sports Information</h2>
                        <div className="space-y-3">
                            <p><strong>Primary Sport of coaching: </strong> {profile.primarySport || "None"}</p>
                            <p><strong>Secondary Sport of coaching</strong> {profile.secondarySport || "None"}</p>
                            <p><strong>Years of Experience:</strong> {profile.experience || "None"}</p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Teams {username} have coached for: </strong> <ReadMore text={profile.teamName || "None"} /></p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Achievements as a coach: </strong> <br /> <ReadMore text={profile.achievements || "None"} /></p>
                        </div>
                    </div>
                )}
                {decidinguser && (
                    <div className="bg-white shadow-sm p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Sports Information</h2>
                        <div className="space-y-3">
                            <p><strong>The sports which majorly interests them: </strong> {profile.primarySport || "None"}</p>
                            <p><strong>The other sport which interests them: </strong> {profile.secondarySport || "None"}</p>
                            <p><strong>Approximate number of years they have been interested in these sports: </strong> {profile.experience || "None"}</p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Favourite sports Moments: </strong> <br /> <ReadMore text={profile.achievements || "None"} /></p>
                            <p style={{whiteSpace:'pre-line'}}><strong>Favourite teams: </strong> <br /> <ReadMore text={profile.teamName || "None"} /></p>
                        </div>
                    </div>
                )}
                    <div className=' mt-5 mb-7 md:col-span-2 flex flex-col items-center'>
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
                                                </div>

                                                <br />
                                                <h1 style={{whiteSpace:'pre-line'}} className='ml-5'><ReadMore text={post.textPost} /></h1>
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
                                                            onClick={() => handlenavigation(post.Id)}
                                                        >
                                                            <h1 className='font-bold text-lg mt-5'>{post.username}</h1>
                                                            <h1>{capital(post.role)}</h1>
                                                        </div>
                                                        <h3 className='mt-8 text-gray-400 text-sm ml-4'>{formatTimestamp(post.timestamp)}</h3>
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

export default OtherProfile;
