import Footer from "../components/footer";
import Loading from "../components/Loading";
import Middle from "../components/middle";
import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import boticon from '../assets/boticon.svg'
function Home() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

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
    
    const [isMobile, setIsMobile] = useState(false);
    
    const checkScreenSize = () => {
        if (window.innerWidth <= 480) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };
    const navigate = useNavigate();
    const handlenavigation=()=>{
        navigate('/aichatbot')
    }
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

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="page-container flex flex-col min-h-screen overflow-hidden ">
            <div className="flex flex-grow">
                <Sidebar className="sticky top-0 w-[20vw] bg-white" />
                <div className="flex flex-col justify-center items-center w-full overflow-y-scroll h-full">
                    <Middle userData={userData} />
                </div>
            </div>
            <Footer className="relative z-[100]" />
            {isMobile && (
                <div onClick={() => handlenavigation()} className="fixed bottom-4 right-4 flex flex-col items-end">
                    <div className="bg-blue-500 text-white text-xs p-2 rounded-t-lg mb-2 shadow-lg">
                        Need assistance in injury management?<br /> I am <strong>Rio</strong>, your Ai assistant on <strong>Kotinos</strong>..
                    </div>
                    <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg cursor-pointer flex items-center justify-center">
                        <img src={boticon} alt="Chatbot" className="w-8 h-8" />
                    </div>
                </div>
            )}

        </div>
    );
}

export default Home;
