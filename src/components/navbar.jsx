import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Searchicon from '../assets/searchicon2.svg'
import homeicon from '../assets/homeicon.svg'
import chaticon from '../assets/chaticon.svg'
import notificationicon from '../assets/notificationsicon.svg'
import profileicon from '../assets/profileicon.svg'
import logouticon from '../assets/logouticon.svg'
import networkicon from '../assets/network.svg'
function Navbar(){
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
    return(
        <div className="bg-white py-7 navbar">
            <nav className='flex items-center justify-between'>
                <div className="left flex items-center md:text-6xl text-3xl ml-4 md:ml-10 gap-5">
                    <Link to='/about'><img src={logo} className='logo md:block md:h-20 md:w-20 hidden rounded-full' /></Link>
                    <Link to='/about'><h1 className='russo pt-3'>KOTINOS</h1></Link>
                </div>
                <div style={{backgroundColor: 'rgb(234, 235, 227)', width: '461px', height: '63px', alignContent: 'center'}}>
                    <img src={Searchicon} alt="Search" style={{paddingLeft: '10px', height: '40px', width: '40px', color: 'black', }}  />
                </div>
                <div className="ul">
                    <ul className='flex mr-4 md:text-2xl text-l mt-4 md:pr-10 md:mt-5'>
                        <Link to='/home' className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'><img src={homeicon} alt="Home" /></Link>
                        <Link to='/network' className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'><img src={networkicon} alt="Network" /></Link>
                        <Link to={'/messages'} className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'><img src={chaticon} alt="Messages" /></Link>
                        <Link to='/profile' className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'><img src={profileicon} alt="Profile" /></Link>
                        <button onClick={logout} className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'><img src={logouticon} alt="Logout" /></button>
                    </ul>
                </div>
            </nav>
        </div>
    )
}
export default Navbar;