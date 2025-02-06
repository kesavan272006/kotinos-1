import Footer from "../components/footer";
import Loading from "../components/Loading";
import Middle from "../components/middle"
import Navbar from "../components/navbar"
import Rightbar from "../components/rightbar"
import Sidebar from "../components/sidebar"
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase";
function Home() {
    const [userData, setUserData] = useState([]);

    const getUser = () => {
        setTimeout(async () => {
            try {
                const userdocument = doc(database, "Users", `${auth.currentUser?.uid}`);
                const data = await getDoc(userdocument);
                setUserData(data);
            } catch (err) {
                console.log(err);
            }
        }, 1000);
    };

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);

    useEffect(() => {
        getUser();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="page-container flex flex-col min-h-screen">
            <Navbar />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexGrow: 1 }}>
                <Sidebar />
                <Middle userData={userData} />
                <Rightbar />
            </div>
            <Footer />
        </div>
    );
}

export default Home;
