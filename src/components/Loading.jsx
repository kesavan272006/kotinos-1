import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import loadingAnimation from '../assets/loading.json'; 
import gsap from 'gsap';
import { useRef,useLayoutEffect } from 'react';

const Loading = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false); 
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) {
        return null; 
    }

    const options = {
        loop: true,
        autoplay: true, 
        animationData: loadingAnimation, 
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    

    return (
        <div className="loading-container bg-gradient-to-b from-[#e8fcfc] to-[#FFFFFF]" style={styles.container}>
            <Lottie options={options} height={400} width={400} />
            <div style={styles.textContainer}>
                <h1 id="koti" className="russo text-6xl"> <span style={{color: 'rgb(43, 206, 244)'}}>K</span>OTINOS</h1>
                <h1 className='text-black lexend text-xl pt-2'>Your dream, our Platform</h1>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#f0f0f0',
        textAlign: 'center',
    },
    textContainer: {
        marginTop: '20px',
    },
    title: {
        fontSize: '3rem',
        fontWeight: '700',
        color: '#333',
        fontFamily: 'Poppins, sans-serif', 
        letterSpacing: '2px',
        animation: 'fadeIn 2s ease-in-out', 
    },
    subtitle: {
        fontSize: '1.5rem',
        fontWeight: '400',
        color: '#555',
        fontFamily: 'Poppins, sans-serif',
        letterSpacing: '1.5px',
        marginTop: '10px',
        animation: 'fadeIn 2s ease-in-out',
    }
};

export default Loading;
