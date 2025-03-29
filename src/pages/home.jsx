import Footer from "../components/footer";
import Loading from "../components/Loading";
import Middle from "../components/middle";
import Sidebar from "../components/sidebar";
import ChatBot from "../pages/Aichatbot";  // Import the chatbot component
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase";
import boticon from '../assets/boticon.svg';
import CompChatBot from "./CompChatBot";
import { useNavigate } from "react-router-dom";
function Home() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false); // Chatbot state
    const navigate = useNavigate();
    const getUser = async () => {
        try {
            const userdocument = doc(database, "Users", `${auth.currentUser?.uid}`);
            const data = await getDoc(userdocument);
            setUserData(data.data());
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };
    const handlenavigation = () => {
        navigate('/aichatbot');
    };
    const checkScreenSize = () => {
        setIsMobile(window.innerWidth <= 480);
    };
    const checkFooterVisibility = () => {
        const footer = document.querySelector('footer');
        if (footer) {
            const rect = footer.getBoundingClientRect();
            setIsFooterVisible(rect.top <= window.innerHeight && rect.bottom >= 0);
        }
    };

    const toggleChatbot = () => {
        setIsChatbotOpen(!isChatbotOpen);
    };

    useEffect(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (isMobile) {
            window.addEventListener('scroll', checkFooterVisibility);
            return () => {
                window.removeEventListener('scroll', checkFooterVisibility);
            };
        }
    }, [isMobile]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="page-container flex flex-col min-h-screen overflow-hidden">
            <div className="flex flex-grow">
                <Sidebar className="sticky top-0 w-[20vw] bg-white" />

                <div className="flex flex-col justify-center items-center w-full overflow-y-scroll h-full">
                    <Middle userData={userData} />
                </div>
            </div>

            {/* Floating Chatbot Button */}
                {!isChatbotOpen && !isMobile && (
                        <div className={`fixed bottom-4 right-4 flex flex-col items-end transition-opacity ${isFooterVisible ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="bg-blue-500 text-white text-xs p-2 rounded-t-lg mb-2 shadow-lg">
                                Need assistance? Chat with <strong>Rio</strong>!
                            </div>
                            <div onClick={toggleChatbot} className="bg-blue-500 text-white p-3 rounded-full shadow-lg cursor-pointer flex items-center justify-center">
                                <img src={boticon} alt="Chatbot" className="w-8 h-8" />
                            </div>
                       </div>
                )}
            {isMobile && (
                <div className={`fixed bottom-4 right-4 flex flex-col items-end transition-opacity ${isFooterVisible ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="bg-blue-500 text-white text-xs p-2 rounded-t-lg mb-2 shadow-lg">
                        Need assistance in injury management?<br /> I am <strong>Rio</strong>, your Ai assistant on <strong>Kotinos</strong>..
                    </div>
                    <div onClick={() => handlenavigation()} className="bg-blue-500 text-white p-3 rounded-full shadow-lg cursor-pointer flex items-center justify-center">
                        <img src={boticon} alt="Chatbot" className="w-8 h-8" />
                    </div>
                </div>
            )}
            {/* Chatbot Popup */}
            {isChatbotOpen && !isMobile && (
                <div style={{marginTop:'100px'}} className="fixed bottom-5 right-4 w-80 min-h-[400px] max-h-[600px] bg-white shadow-xl rounded-lg flex flex-col">
                    {/* Chatbot Header */}
                    <div className="flex justify-between items-center bg-blue-500 text-white p-3 rounded-t-lg">
                        <span>Rio - AI Sports Buddy</span>
                        <button onClick={toggleChatbot} className="text-white font-bold">✕</button>
                    </div>

                    {/* Chatbot Content */}
                    <div className="flex-1 p-3 overflow-y-auto">
                        <CompChatBot />
                    </div>
                </div>
            )}

            <Footer className="relative z-[100]" />
        </div>
    );
}

export default Home;
