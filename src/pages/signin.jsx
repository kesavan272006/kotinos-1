import { auth, googleprovider } from '../config/firebase';
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import Google from '../assets/Googlepic.png'
const Signin = () => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/profile");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const login = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            console.log("User logged in:", userCredential.user);
            navigate("/profile");
        } catch (error) {
            console.error("Login error:", error);
            setLoginEmail("");
            setLoginPassword("");
            if (error.code === "auth/user-not-found") {
                alert("No account found with this email. Please register first.");
            } else if (error.code === "auth/wrong-password") {
                alert("Incorrect password. Please try again.");
            } else {
                alert("Error logging in: " + error.message);
            }
        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleprovider);
            const user = result.user;
            console.log("User signed in with Google:", user);
            navigate("/profile");
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
            alert("Error signing in with Google. Please try again.");
        }
    };

    return (
        <div>
            <div style={{ justifyContent: 'center' }} className="left flex items-center md:text-6xl text-3xl ml-4 md:ml-10 gap-5">
                <img src={logo} className='logo md:block md:h-20 md:w-20 hidden rounded-full' />
                <h1 className='russo pt-3'>Sign In to Kotinos</h1>
                <br />
            </div>
            <div className="flex justify-center items-center">
            <div className='md:w-1/3 bg-white mt-32 p-10 rounded-lg'>
                <h1 className='lexend pb-2 text-lg'>Enter your Email</h1>
                <input
                    className='input-box-signin w-full '
                    type="email"
                    placeholder="Email..."
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                />
                <br />
                <h1 className='lexend pt-10 pb-2 text-lg'>Enter your Password</h1>
                <input
                    type="password"
                    className='input-box-signin w-full '
                    placeholder="Password..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                />
                <br />
                <div className="buttons flex flex-col justify-center items-center p-5 mt-10">
                <button className='text-white bg-black russo px-16 rounded-full py-2 text-xl' onClick={login}>Login</button>
                <h2 className='lexend font-extrabold m-3'>OR</h2>
                <button className='text-white bg-black russo w-full rounded-full py-2 text-l md:w-3/4 flex justify-center items-center gap-2' onClick={signInWithGoogle}>  <img className='w-10' src={Google}/>  Sign in with Google</button>
                <p className='pt-3'>Don't have an account? <Link to="/emaillogin" id='signinpagesignuplink'>Sign Up</Link></p>
                </div>
            </div>
            </div>
            </div>
    );
};

export default Signin;
