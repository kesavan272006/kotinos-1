import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { auth, googleprovider } from '../config/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function Emaillogin() {
    const navigate = useNavigate();
    const [check, setCheck] = useState(false);
    const [result2, setResult2] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/profile');
            } else {
                setCheck(false);
                setResult2(null);
                Cookies.remove("auth-token");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signin = async () => {
        try {
            const passed = await createUserWithEmailAndPassword(auth, email, password);
            if (passed) {
                setCheck(true);
                setResult2(passed.user);
                Cookies.set("auth-token", passed.user.refreshToken);
                navigate('/profile');
            }
        } catch (error) {
            console.error("Error creating account:", error);
            setEmail("");
            setPassword("");
            if (error.code === "auth/email-already-in-use") {
                alert("This email is already registered. Please log in or use a different email.");
            } else {
                alert("Error creating account: " + error.message);
            }
        }
    }

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleprovider);
            if (result) {
                setCheck(true);
                setResult2(result.user);
                Cookies.set("auth-token", result.user.refreshToken);
                navigate('/profile');
            }
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
            alert("Error signing in with Google. Please try again.");
        }
    }

    return (
        <div>
            <div style={{ justifyContent: 'center' }} className="left flex items-center md:text-6xl text-3xl ml-4 md:ml-10 gap-5">
                <img src={logo} className='logo md:block md:h-20 md:w-20 hidden rounded-full' />
                <h1 className='russo pt-3'>KOTINOS</h1>
            </div>
            <br />
            <div id="signupbox3">
                <h1>Email ID</h1>
                <input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    id='firstinputsignin' 
                    type="email" 
                    placeholder="Enter your email ID" 
                />
                <br />
                <h1>Password</h1>
                <input 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    id='firstinputsignin' 
                    type="password" 
                    placeholder="Enter your password" 
                />
                <br />
                <button id="signupcontinue" onClick={signin}>Join us</button>
                <br />
                <h2>or</h2>
                <br />
                <button id="signupcontinue2" onClick={signInWithGoogle}>Sign in with Google</button>
                <p>Already have an account? <Link id='signinpagesignuplink' to='/signin'>Sign In</Link></p>
            </div>
        </div>
    );
}

export default Emaillogin;
