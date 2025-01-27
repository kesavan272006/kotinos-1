import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Signin() {
    return (
        <div id='outerdivsignin'>
            <div className="navbar bg-white px-5 py-2 flex justify-center text-3xl russo">KOTINOS</div>
            <div id='signin-imageh1div'>
                <img src={logo} alt="Logo" id='Logo' />
                <h1>Sign-In to Kotinos</h1>
            </div>
            <div className="flex justify-center items-center">
            <div className=' bg-white w-1/4 p-4 h-[400px]'>
                <h2 className=''>Username or email ID</h2>
                <input className='input-box w-full rounded-lg' type="text" placeholder='enter here..' />
                <h2>Password</h2>
                <input className='input-box w-full rounded-lg' type="password" placeholder='enter here..' /> 
                <br />
                <button id='signinbutton'>Sign-In</button>
                <p>Don't have an account? <Link to="/signup" id='signinpagesignuplink'>Sign Up</Link></p> 
            </div>
            </div>
        </div>
    );
}

export default Signin;
