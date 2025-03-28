import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import { Paper, Avatar, ListItem, ListItemText, List, Button } from '@mui/material';
import profileicon from '../assets/profileicon.svg'; 
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { database, auth } from '../config/firebase';
import Loading from './Loading';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { IoPersonAdd } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
import { FiSearch } from 'react-icons/fi';

const Network = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!auth.currentUser) {
        return <Loading /> 
    }

    const requestInRef = collection(database, "Users", auth.currentUser?.uid, "RequestIn");
    const showRequest = async () => {
        try {
            const data = await getDocs(requestInRef);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            const uniqueUsers = Array.from(new Set(filteredData.map(user => user.id)))
                .map(id => filteredData.find(user => user.id === id));

            setUser(uniqueUsers);
        } catch (err) {
            console.error("Error fetching requests:", err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsAuthenticated(true);  
                showRequest();           
            } else {
                setIsAuthenticated(false);
                setLoading(false);        
            }
        });

        return () => unsubscribe();
    }, []);
    const [profilePics, setProfilePics] = useState({});
    const fetchingProfilePic = async (userIds) => {
    const userRef = doc(database, "Users", userIds);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.profilePic
    } else {
        return profileicon
    }
    }
    useEffect(() => {
    const fetchProfilePics = async () => {
        const newProfilePics = {};

        for (const users of user) {
        const pic = await fetchingProfilePic(users.id);
        newProfilePics[users.id] = pic;
        }

        setProfilePics(newProfilePics);
    };

    fetchProfilePics();
    }, [user]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(user);
    const [defaults, setdefaults]=useState(true);
    const handleSearchChange = (event) => {
    setdefaults(false);
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = user.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
    };
    if (loading) {
        return <Loading />;
    }
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
            return 'Organization'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto pt-20 px-4 pb-12">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <IoIosPeople className="mr-2 text-blue-500 text-3xl" />
                        My Network
                    </h1>
                    <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                        {user.filter(user => user.status === 'connected').length} Connections
                    </div>
                </div>

                {user.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IoIosPeople className="text-blue-400 text-5xl" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Your network is empty</h2>
                        <p className="text-gray-500 mb-6">Connect with others to build your professional network</p>
                        <Button 
                            className=''
                            onClick={()=>navigate('/connection')}
                            variant="contained" 
                            style={{ 
                                backgroundColor: '#2BCEE0', 
                                textTransform: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px'
                            }}
                            startIcon={<IoPersonAdd />}
                        >
                            Find Connections
                        </Button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                            <h2 className="font-medium text-gray-700">Your Connections</h2>
                        <div className="flex items-center border border-gray-300 bg-gray-100 rounded-full px-3 py-2 focus-within:bg-blue-100 focus-within:border-blue-300">
                            <FiSearch className="text-gray-500" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search" 
                                className="w-full ml-2 text-gray-700 outline-none bg-transparent" 
                            />
                        </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {defaults && (
                                user.filter(user => user.status === 'connected').map((eachuser) => (
                                    <Link 
                                        to={`/otherprofile/${eachuser.id}`} 
                                        key={eachuser.id} 
                                        className="block hover:bg-blue-50 transition-colors duration-200"
                                    >
                                        <div className="px-4 py-3 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Avatar className='bg-gray-100'
                                                    src={profilePics[eachuser.id]} 
                                                    sx={{ 
                                                        width: 48, 
                                                        height: 48,

                                                    }}
                                                />
                                                <div className="ml-3">
                                                    <p className="font-medium text-gray-800">{eachuser.username}</p>
                                                    <p className="text-sm text-gray-500">{capital(eachuser.role)}</p>
                                                </div>
                                            </div>
                                            <Button 
                                                variant="text" 
                                                className="text-blue-500 hover:bg-blue-50"
                                                style={{ minWidth: 'auto', padding: '6px' }}
                                            >
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                </svg>
                                            </Button>
                                        </div>
                                    </Link>
                                ))
                            )}
                            {!defaults && (
                                filteredUsers.filter(user => user.status === 'connected').map((eachuser) => (
                                    <Link 
                                        to={`/otherprofile/${eachuser.id}`} 
                                        key={eachuser.id} 
                                        className="block hover:bg-blue-50 transition-colors duration-200"
                                    >
                                        <div className="px-4 py-3 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Avatar className='bg-gray-100'
                                                    src={profilePics[eachuser.id]} 
                                                    sx={{ 
                                                        width: 48, 
                                                        height: 48,
                                                    }}
                                                />
                                                <div className="ml-3">
                                                    <p className="font-medium text-gray-800">{eachuser.username}</p>
                                                    <p className="text-sm text-gray-500">{capital(eachuser.role)}</p>
                                                </div>
                                            </div>
                                            <Button 
                                                variant="text" 
                                                className="text-blue-500 hover:bg-blue-50"
                                                style={{ minWidth: 'auto', padding: '6px' }}
                                            >
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                </svg>
                                            </Button>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Network;