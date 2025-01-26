import '../App.css';
import { useNavigate } from 'react-router-dom'; // No need for Routes here
import Footer from '../components/footer';
import Navbarout from '../components/getstartednavbar';

function Getstarted(){
    const navigate = useNavigate();

    const handleclick = () => {
        navigate("/signin");  
    };

    return(
        <>
            <Navbarout />
            <div className="main-head flex items-center justify-center flex-col russo text-[28px] pt-40 pt-30 md:text-[64px] md:pt-32">
            <div className=''>Empowering <span className='text-[#2BCEE0]'>Athletes</span>.</div>
            <div>
                <span className='text-[#2BCEE0]'>Elevating</span> Performance.
            </div>
            </div>
            <div className="desc md:flex md:items-center md:justify-center m-3 md:m-8 md:mt-12 text-center text-[#848282] md:text-3xl">
            <div className='md:w-[50%]'>Streamline team operations, manage schedules, and track performance all in one powerful platform.</div>
            </div>

            <div className="join-now-text flex flex-col justify-center items-center md:text-2xl mt-28 gap-5">
            <div className=' text-[#787777]'>Start Your Sports Journey <span className='text-[#2BCEE0] hover:underline'>Today</span></div>
            <div>
                <button onClick={handleclick} className='rounded-[5px] px-5 py-2 bg-black text-white russo text-[17px] hover:scale-110 transition-all'>Get Started</button>
            </div>
            </div>
            <hr className='line' />
            <Footer />
        </>
    );
}

export default Getstarted;
