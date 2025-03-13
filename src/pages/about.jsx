import logo from '../assets/logo.png';
import '../App.css';
import back from '../assets/back.svg'
import Footer from '../components/footer'
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
function About() {
    const navigate = useNavigate();
    const handlenavigation = ()=>{
        navigate(-1);
    }
    return (
        <div className="flex flex-col min-h-screen">
            <style>
                {`
                    body{
                        background-color: #F1F8F9;
                    }
                        .head{
                            box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
                        }
                `}
            </style>
            <div className=" head left flex md:text-6xl text-3xl py-5 gap-5 bg-white">
                <Button onClick={handlenavigation}><img src={back} alt="Go back" /></Button>
                <h1 className='russo pt-3' style={{textAlign:'center'}}>About Us</h1>
            </div>
            <br />
            <div className=" flex flex-col items-center justify-center mx-10 my-5 font-sans">
                <h1 className='text-4xl russo'>Your <span className='text-[#2BCEE0]'>Future</span>. Our <span className='text-[#2BCEE0]'>Platform</span>. One <span className='text-[#2BCEE0]'>Vision</span>.</h1>
                <p className='text-xl my-5 text-[#787777]'>Kotinos is a groundbreaking platform designed to revolutionize the way athletes, coaches, and sports organizations manage and elevate their careers. Tailored specifically for the unique needs of the Indian sporting industry, Kotinos provides a seamless, centralized solution that connects athletes with the tools they need to succeed.
                    Whether you're an athlete looking to track your performance, plan your career, or manage your finances, Kotinos offers an intuitive, user-friendly interface that consolidates all your needs in one place. The platform not only helps monitor progress but also provides expert advice on injury prevention, training plans, and mental well-being, ensuring holistic development. Coaches can seamlessly track their athletes’ growth, provide targeted feedback, and enhance collaboration for better results.
                    With Kotinos, athletes no longer have to navigate fragmented systems. They gain access to a vibrant community of like-minded individuals, fostering connections, knowledge sharing, and growth. From up-and-coming talent to established professionals, Kotinos empowers every athlete to reach their fullest potential, offering personalized resources, career insights, and the tools to navigate their journey with confidence. Transform the way you manage your athletic career with Kotinos—where your potential meets opportunity.
                </p>
            </div>
            <div className='absolute bottom-0 w-full'>
            <div className='hidden md:block'><Footer/></div>
            </div>
            <div className='md:hidden'><Footer className="" /></div>
            
        </div>
    )
}
export default About;