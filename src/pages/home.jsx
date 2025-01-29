import Middle from "../components/middle"
import Navbar from "../components/navbar"
import Rightbar from "../components/rightbar"
import Sidebar from "../components/sidebar"

function Home(){
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