import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import loadingAnimation from '../assets/loading.json'; 

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
        <div className="loading-container" style={styles.container}>
            <Lottie options={options} height={400} width={400} />
            <div style={styles.textContainer}>
                <h1 style={styles.title}> <span style={{color: 'rgb(43, 206, 244)'}}>K</span>otinos</h1>
                <h1 style={styles.subtitle}>Your dream, our Platform</h1>
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
