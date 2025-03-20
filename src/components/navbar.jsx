import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { signOut } from 'firebase/auth';

// Import icons
import { GoHomeFill } from "react-icons/go";
import { IoChatbubbleEllipses, IoPersonSharp } from "react-icons/io5";
import { IoIosNotifications, IoIosPeople } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { doc, getDoc } from 'firebase/firestore';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    const checkScreenSize = () => {
        if (window.innerWidth <= 480) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };
    useEffect(() => {
        const fetchUserData = async () => {
          const currentUser = auth.currentUser;
    
          if (currentUser) {
            const userRef = doc(database, "Users", currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              setUsername(userData.username || 'No Username');
              setRole(userData.role || 'No Role');
              setEmail(userData.email || 'No email found');
            } else {
              navigate("/signin");
            }
          } else {
            navigate("/signin");
          }
        };
    
        fetchUserData();
      }, [navigate]);
      useEffect(() => {
            checkScreenSize();
            window.addEventListener('resize', checkScreenSize);
            return () => {
                window.removeEventListener('resize', checkScreenSize);
            };
        }, []);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotifications || showProfile) {
                if (!event.target.closest('.dropdown-container')) {
                    setShowNotifications(false);
                    setShowProfile(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotifications, showProfile]);

    const logout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    const isActive = (path) => location.pathname === path;

    return (
        <div className={`sticky w-full top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white shadow-md'}`}>
            <nav className='w-full flex items-center justify-between py-3 px-4'>
                <div className="flex items-center">
                    <Link to='/about' className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl transition-transform hover:scale-105">
                            K
                        </div>
                        <span className="ml-2 text-lg font-semibold hidden md:block text-gray-800">Kotinos</span>
                        {isMobile && (
                            <strong className="ml-2 text-lg font-semibold text-gray-800">Kotinos</strong>
                        )}
                    </Link>
                    {!isMobile && (
                        <div className={`hidden md:flex items-center relative mx-4 flex-1 max-w-md transition-all ${searchFocused ? 'scale-105' : ''}`}>
                            <div className={`flex items-center w-full border ${searchFocused ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100'} rounded-full px-4 py-2 transition-all`}>
                                <FiSearch className={`${searchFocused ? 'text-blue-500' : 'text-gray-500'} transition-colors`} />
                                <input 
                                    type="text" 
                                    placeholder="Search" 
                                    className="w-full ml-2 text-gray-700 outline-none bg-transparent" 
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                />
                            </div>
                        </div>
                    )}
                </div>
                {!isMobile && (
                    <div className="md:hidden flex-1 mx-3">
                        <div className="flex items-center border border-gray-300 bg-gray-100 rounded-full px-3 py-2">
                            <FiSearch className="text-gray-500" />
                            <input 
                                type="text" 
                                placeholder="Search" 
                                className="w-full ml-2 text-gray-700 outline-none bg-transparent" 
                            />
                        </div>
                    </div>
                )}
                
                <div className="flex items-center">
                    <ul className='flex items-center space-x-1 md:space-x-3'>
                        <li>
                            <NavLink to='/home' className={`p-2 rounded-full flex items-center justify-center transition-colors ${isActive('/home') ? 'bg-cyan-100 text-cyan-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                                <GoHomeFill className='text-xl md:text-2xl' />
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to='/chatpage' className={`p-2 rounded-full flex items-center justify-center transition-colors ${isActive('/chatpage') ? 'bg-cyan-100 text-cyan-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                                <IoChatbubbleEllipses className='text-xl md:text-2xl' />
                            </NavLink>
                        </li>
                        <li className="dropdown-container relative">
                            <button 
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    setShowProfile(false);
                                }}
                                className={`p-2 rounded-full flex items-center justify-center transition-colors ${showNotifications ? 'bg-cyan-100 text-cyan-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <IoIosNotifications className='text-xl md:text-2xl' />
                            </button>
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden transition-all">
                                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                                        <button className="text-xs text-cyan-600 hover:text-blue-800">Mark all as read</button>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto">
                                        <div className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border-b border-gray-100 cursor-pointer">
                                            <p className="text-sm text-gray-800">No new notifications</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 text-center">
                                        <button onClick={()=>navigate('/invitation')} className="text-sm text-cyan-600 hover:text-blue-800">View all notifications</button>
                                    </div>
                                </div>
                            )}
                        </li>
                        <li>
                            <NavLink to='/network' className={`p-2 rounded-full flex items-center justify-center transition-colors ${isActive('/network') ? 'bg-cyan-100 text-cyan-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                                <IoIosPeople className='text-xl md:text-2xl' />
                            </NavLink>
                        </li>
                        <li className="dropdown-container relative">
                            <button 
                                onClick={() => {
                                    setShowProfile(!showProfile);
                                    setShowNotifications(false);
                                }}
                                className={`p-2 rounded-full flex items-center justify-center transition-colors ${showProfile ? 'bg-cyan-100 text-cyan-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <IoPersonSharp className='text-xl md:text-2xl' />
                            </button>
                            {showProfile && (
                                <div style={{width:'max-width'}} className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <p className="font-semibold text-gray-800">{username}</p>
                                        <p className="text-sm text-gray-500">{role}</p>
                                        <p className="text-sm text-gray-500">{email}</p>
                                    </div>
                                    <div>
                                        <NavLink to='/profile' className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors">
                                            <IoPersonSharp className="text-gray-600 mr-3" />
                                            <span className="text-gray-700">Profile</span>
                                        </NavLink>
                                        <NavLink to='/network' className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors">
                                            <IoIosPeople className="text-gray-600 mr-3" />
                                            <span className="text-gray-700">Network</span>
                                        </NavLink>
                                        <button onClick={logout} className="flex items-center w-full px-4 py-3 hover:bg-red-50 text-left transition-colors">
                                            <MdLogout className="text-red-500 mr-3" />
                                            <span className="text-red-500">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>

                        
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;