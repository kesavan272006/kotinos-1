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
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);
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
    const handledisplaypost = ()=>{
        setdisplaypost(true);
        setdisplayachievement(false);
        setdisplaycrowdfunding(false)
    }
    const handledisplayachievements = ()=>{
        setdisplaypost(false);
        setdisplayachievement(true);
        setdisplaycrowdfunding(false)
    }
    const handledisplaycrowd = ()=>{
        setdisplaypost(false);
        setdisplayachievement(false);
        setdisplaycrowdfunding(true)
    }
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
                                <p><strong>Mission or Brief Description of your Organization:</strong> <br />{profile.mission || "Not provided"}</p>
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
                            <p><strong>Type of services offered: </strong> <br /> {profile.servicesOffered || "None"}</p>
                            <p><strong>Achievement Highlights: </strong> {profile.achievements || "None"}</p>
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
                            <p><strong>Teams they have played for: </strong> <br /> {profile.teamName || "None"}</p>
                            <p><strong>Achievements as a player: </strong> <br /> {profile.achievements || "None"}</p>
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
                            <p><strong>Teams they have coached for: </strong> {profile.teamName || "None"}</p>
                            <p><strong>Achievements as a coach: </strong> <br /> {profile.achievements || "None"}</p>
                        </div>
                    </div>
                )}
                {decidinguser && (
                    <div className="bg-white shadow-sm p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Sports Information</h2>
                        <div className="space-y-3">
                            <p><strong>The sports which majorly interests them: </strong> {profile.primarySport || "None"}</p>
                            <p><strong>The other sport which interests them: </strong> {profile.secondarySport || "None"}</p>
                            <p><strong>Favourite sports Moments: </strong> <br /> {profile.achievements || "None"}</p>
                            <p><strong>Favourite teams: </strong> <br /> {profile.teamName || "None"}</p>
                            <p><strong>Approximate number of years they have been interested in these sports: </strong> {profile.experience || "None"}</p>
                        </div>
                    </div>
                )}
                    <div className=' mt-5 mb-7 md:col-span-2 flex flex-col items-center'>
                    {decidinguser && (
                        <>
                           <h1 className='russo' style={{ textAlign: 'center', fontSize: '40px', color: 'black' }}>{username}'s Posts</h1>
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
                                <br />
                                <br />
                            </div>
                        ))}
                        </>
                    )}
                    {!decidinguser && (
                        <>
                            <nav style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', padding: '10px', boxSizing: 'border-box', border: '2px solid black' }}>
                        <button onClick={()=>handledisplaypost()}><h1 style={{ borderRight: '2px solid black', paddingRight: '20px' }}>Posts</h1></button>
                        <button onClick={()=>handledisplayachievements()}><h1 style={{ borderRight: '2px solid black', paddingRight: '20px' }}>Achievements</h1></button>
                        <button onClick={()=>handledisplaycrowd()}><h1>Crowdfunding</h1></button>
                    </nav>
                    
                    {displaypost && (
                        <>
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
                                    <br />
                                    <br />
                                </div>
                            ))}
                        </>
                    )}
                    {displayachievement && (
                        <>
                            {achievementPost.map((post) => (
                                    
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
                                    <br />
                                    <br />
                                </div>
                            ))}
                        </>
                    )}
                    {displaycrowdfunding && (
                        <>
                            {CrowdfundingPost.map((post) => (
                                    
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
                                    <br />
                                    <br />
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
