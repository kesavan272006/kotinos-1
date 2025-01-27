import { auth, googleprovider } from '../config/firebase';
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

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
                <button className='text-white bg-black russo w-full rounded-full py-2 text-l md:w-3/4 flex justify-center items-center gap-2' onClick={signInWithGoogle}>  <img className='w-10' src="data:image/jpeg;base64,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"/>  Sign in with Google</button>
                <p className='pt-3'>Don't have an account? <Link to="/emaillogin" id='signinpagesignuplink'>Sign Up</Link></p>
                </div>
            </div>
            </div>
            </div>
    );
};

export default Signin;
