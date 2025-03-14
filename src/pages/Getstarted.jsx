import gsap from 'gsap';
import { useRef,useLayoutEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import Navbarout from '../components/getstartednavbar';
import bg from '../assets/background.png';
import test from '../test/test_bg1.jpg'

function Getstarted() {
    const navigate = useNavigate();

    const handleclick = () => {
        navigate("/signin");
    };

    const comp=useRef(null);
    useLayoutEffect(() =>{
      let ctx=gsap.context(()=>{
        const t1=gsap.timeline()
        t1.from("#main-text",{
            opacity:0,
            yPercent:30,
            duration:0.8,
            delay:0.3
          }).from(["#sub-text","#sub-text-2","#get-started-button"],{
            opacity:0,
            y: "+=30",
            stagger:0.2,
          })
        
      },comp)

      

      return()=>ctx.revert()
    },[])

    return (
        <>
            <style>
                {`
                    body{
                        background-image: url(${test});
                        background-repeat: no-repeat;
                        background-size: cover;
                    }
                `}
            </style>
            <Navbarout />
            <div ref={comp}>
                <div id='main-text' className="main-head flex items-center justify-center flex-col russo text-[28px] pt-32 md:text-[64px] md:pt-32">
                    <div className=' text-[white]'>Empowering <span className='text-[#2BCEE0]'>Athletes</span>.</div>
                    <div>
                        <span className='text-[#2BCEE0]'>Elevating</span><span className='text-[white]'> Performance.</span>
                    </div>
                </div>
                <div id='sub-text' className="desc md:flex md:items-center md:justify-center m-3 md:m-8 md:mt-12 text-center text-[white] md:text-3xl">
                    <div className='md:w-[40%] text-xl'>Streamline team operations, manage schedules, and track performance all in one powerful platform.</div>
                </div>

                <div id='sub-text-2' className="join-now-text flex flex-col justify-center items-center md:text-2xl mt-28 gap-5">
                    <div className=' text-[white] text-xl'>Start Your Sports Journey <span className='text-[#2BCEE0] hover:underline'>Today</span></div>
                    
                </div>
                <div id="get-started-button" className='flex justify-center items-center mt-8'>
                    <button onClick={handleclick} className='rounded-full px-5 py-2 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 hover:bg-gradient-to-r hover:from-blue-800 hover:via-blue-600 hover:to-blue-800  text-white russo text-[17px] hover:scale-110 transition-all'>Get Started</button>
                </div>
                <hr className='line' />
                
            </div>
            <Footer />
            
        </>
    );
}

export default Getstarted;
