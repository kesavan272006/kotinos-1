import profilepic from '../assets/profileicon.svg';
import { useUser } from '../components/UserContext';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../config/firebase';
import { Link } from 'react-router-dom';
import { FaBars, FaNewspaper } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import Loading from "../components/Loading";


import { GoHomeFill } from "react-icons/go";
import { TiMessages } from "react-icons/ti";
import { IoIosNotifications } from "react-icons/io";
import { IoPersonSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";

const Sidebar = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false); // Set initial state to false
  const [isNewsVisible, setIsNewsVisible] = useState(false); // Set initial state to false
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

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

  const getNews = () => {
    fetch("https://newsapi.org/v2/top-headlines?category=sports&apiKey=087f14f412fb45c98779389f7adcbfab")
      .then((res) => res.json())
      .then((json) => setNews(json.articles))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    getNews();
    const interval = setInterval(() => getNews(), 300000);
    return () => clearInterval(interval);
  }, []);


  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleNewsVisibility = () => {
    setIsNewsVisible(!isNewsVisible);
  };

  return (
    <div className="relative md:fixed">
      
      <div className="cursor-pointer absolute z-10 top-0 left-0 m-2" onClick={toggleVisibility}>
        {isVisible ? <IoClose className="text-2xl relative left-32 md:left-64 bg-gray-300 rounded-full" /> : <FaBars className="text-2xl bg-white" />}
      </div>
      <div className={`absolute top-0 left-0 z-0 md:w-[20vw] w-[50vw] h-[100%] md:h-[100vw] bg-white transition-transform duration-300 ${isVisible ? 'translate-x-0' : '-translate-x-full'} z-50`}>
      
        <br />
        <div className="">
          <Link to='/home' className=' md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'>
            <GoHomeFill className='scale-[160%]' /><div>HOME</div>
          </Link>
          <Link to='/chatpage' className=' md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'>
            <TiMessages className='scale-[160%]' />
          </Link>
          <Link to='/notification' className=' md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'>
            <IoIosNotifications className='scale-[160%]' />
          </Link>
          <Link to='/profile' className=' md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'>
            <IoPersonSharp className='scale-[160%]' />
          </Link>
          <Link to='/network' className=' md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'>
            <IoIosPeople className='scale-[160%]' />
          </Link>

          <Link to='/connection' state={{ username: username, role: role, email: email }}><h4>friends</h4></Link>
          <Link to='/invitation' state={{ username: username, role: role, email: email }}>Invitations</Link>
          <div className="cursor-pointer" onClick={toggleNewsVisibility}>
            <h4>News</h4>
          </div>
        </div>
        <div className="flex flex-row justify-evenly">
          <img src={profilepic} alt="Profile" className="h-[30%] w-[30%] rounded-full bg-gray-500 mt-[20px]" />
          <div className="flex flex-col justify-center">
            <h1>{username}</h1>
            <h3>Logged in as {role}</h3>
          </div>
        </div>
      </div>

      {isNewsVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 p-4 overflow-y-scroll flex justify-center">
          <div className="absolute top-0 right-0 m-4 cursor-pointer" onClick={toggleNewsVisibility}>
            <IoClose className="text-2xl bg-white rounded-full" />
          </div>
          <div className="md:w-[40vw] w-[90vw]  h-[80vh] bg-white border rounded-lg max-h-screen overflow-y-scroll p-2  px-6 m-2">
            <h1 className='russo text-3xl text-center py-2'>Sports News</h1>
            {news && news.length > 0 ? (
              <ul>
                {news.map((article, index) => (
                  <li key={index} className='py-2 '>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      {article.urlToImage && <img src={article.urlToImage} alt={article.title} className="w-full h-auto rounded-xl" />}
                      <p className='russo pt-3'>{article.title}</p>
                    </a>
                    <hr className="border-t border-gray-300 my-4" />
                  </li>

                ))}
              </ul>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;