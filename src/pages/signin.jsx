import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Signin() {
    return (
        <div id='outerdivsignin'>
            <div id='signin-imageh1div'>
                <img src={logo} alt="Logo" id='Logo' />
                <h1>Sign-In to Kotinos</h1>
            </div>
            <div id='signinbox'>
                <h2>Username or email ID</h2>
                <input id='firstinputsignin' type="text" placeholder='enter here..' />
                <h2>Password</h2>
                <input id='firstinputsignin' type="password" placeholder='enter here..' /> 
                <br />
                <button id='signinbutton'>Sign-In</button>
                <p>Don't have an account? <Link to="/signup" id='signinpagesignuplink'>Sign Up</Link></p> 
            </div>
        </div>
    );
}

export default Signin;
