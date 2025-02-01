import Loading from "../components/Loading";
import Middle from "../components/middle"
import Navbar from "../components/navbar"
import Rightbar from "../components/rightbar"
import Sidebar from "../components/sidebar"
import { useState, useEffect } from "react";
function Home(){
    const [loading, setLoading] = useState(true);
    
        useEffect(() => {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 3000);
        });
        if(loading){
            return <Loading />
        }
    return(
        <div>
            <Navbar />
            <div style={{display:'flex', flexDirection: 'row', justifyContent:'space-between'}}>
                <Sidebar />
                <Middle />
                <Rightbar />
            </div>
        </div>
    )
}
export default Home