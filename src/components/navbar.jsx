import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Searchicon from '../assets/searchicon2.svg'
import { NavLink } from 'react-router-dom';


import { GoHomeFill } from "react-icons/go";
import { TiMessages } from "react-icons/ti";
import { IoIosNotifications } from "react-icons/io";
import { IoPersonSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
function Navbar() {
    const navigate = useNavigate();
    const logout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    console.log(Searchicon);
    return (
        <div className="bg-white border border-gray-100 border-x-0 border-t-0 w-full py-3">
            <style>
                {`
                    .search-bar:focus{
                        outline: none;
                    }
                `}
            </style>
            <nav className='flex items-center md:w-full md:justify-between'>
                <div className="flex items-center md:gap-5 px-2 md:w-full">
                    <Link to='/about'><img src={logo} className='md:block mx-2 h-12 w-12 hidden rounded-full' /></Link>
                    {/* <Link to='/about'><h1 className='russo pt-3'>KOTINOS</h1></Link> */}
                    <div className="search border border-gray-500 flex items-center w-[90%] md:w-[30%] rounded-full">
                        <img src={Searchicon} alt="Search" className="m-2" />
                        <input type="text" placeholder="Search" className="search-bar w-full md:w-full  text-lg rounded-full active:border-none md:py-2 md:pr-8" />
                    </div>
                </div>

                <div className="ul ">
                    <ul className='flex items-center md:text-2xl gap-4 text-l pr-1 md:pr-10'>
                    <NavLink to='/home' className={({ isActive }) => isActive ? 'active-link md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer' : 'md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'}><GoHomeFill className='scale-[160%]' /></NavLink>
                        <NavLink to='/messages' className={({ isActive }) => isActive ? 'active-link md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer' : 'md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'}><TiMessages className='scale-[160%]' /></NavLink>
                        <NavLink to='/notification' className={({ isActive }) => isActive ? 'active-link md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer' : 'md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'}><IoIosNotifications className='scale-[160%]' /></NavLink>
                        <NavLink to='/profile' className={({ isActive }) => isActive ? 'active-link md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer' : 'md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'}><IoPersonSharp className='scale-[160%]' /></NavLink>
                        <NavLink to='/network' className={({ isActive }) => isActive ? 'active-link md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer' : 'md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'}><IoIosPeople className='scale-[160%]' /></NavLink>
                        <button onClick={logout} className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'><MdLogout className='scale-[160%]'/></button>
                    </ul>
                </div>
            </nav>
        </div>
    )
}
export default Navbar;