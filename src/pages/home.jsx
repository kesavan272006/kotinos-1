import Footer from "../components/footer";
import Loading from "../components/Loading";
import Middle from "../components/middle";
import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase";

function Home() {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        try {
            const userdocument = doc(database, "Users", `${auth.currentUser?.uid}`);
            const data = await getDoc(userdocument);
            setUserData(data.data());
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);
        return () => clearTimeout(timer); 
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
        </div>
    );
}

export default Home;