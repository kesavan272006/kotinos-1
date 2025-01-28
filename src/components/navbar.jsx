import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import home from '../assets/home.png';
import message from '../assets/message.png'
import notification from '../assets/notification.png';
import profile from '../assets/profile.png';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Logout from '../assets/logout.png'
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
    return(
        <div className="bg-white py-7 navbar">
            <nav className='flex items-center justify-between'>
                <div className="left flex items-center md:text-6xl text-3xl ml-4 md:ml-10 gap-5">
                    <Link to='/about'><img src={logo} className='logo md:block md:h-20 md:w-20 hidden rounded-full' /></Link>
                    <Link to='/about'><h1 className='russo pt-3'>KOTINOS</h1></Link>
                </div>
                <div className="ul">
                    <ul className='flex mr-4 md:text-2xl text-l mt-4 md:pr-10 md:mt-5'>
                        <Link to='/home' className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'><img src={home} alt="Home" /></Link>
                        <Link to={'/messages'} className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'><img src={message} alt="Messages" /></Link>
                        <Link to='/notification' className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'><img src={notification} alt="Notifications" /></Link>
                        <Link to='/profile' className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'><img src={profile} alt="Profile" /></Link>
                        <button onClick={logout} className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'><img src={Logout} alt="Logout" /></button>
                    </ul>
                </div>
            </nav>
        </div>
    )
}
export default Navbar;