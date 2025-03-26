import gsap from "gsap";
import { useEffect } from "react";
import { useRef, useLayoutEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Navbarout from "../components/getstartednavbar";
import Footer from "../components/footer";
import test from '../test/test_bg2.jpg'
import GetstartedBtn from '../components/animata/button/slide-arrow-button'
import Glowcard from '../components/animata/button/glowing-card'


gsap.registerPlugin(ScrollTrigger);

function Getstarted() {
    const scrollRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            scrollRef.current,
            { opacity: 0, y: -10 },
            {
                opacity: 1,
                y: 10,
                repeat: -1,
                yoyo: true,
                duration: 1.2,
                ease: "power1.inOut"
            }
        );
    }, []);
    const navigate = useNavigate();
    const comp = useRef(null);

    const handleclick = () => {
        navigate("/signin");
    };
    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".fade-up", { opacity: 0, y: 40, duration: 1, stagger: 0.3 });
            gsap.from(".glow-btn", { opacity: 0, scale: 0.8, duration: 1.2, delay: 0.5 });
            gsap.from("#get-started-button", { opacity: 0, y: 40, duration: 1, delay: 0.5 });

            // Scroll-triggered animations

            

            gsap.utils.toArray(".scroll-reveal").forEach((el) => {
                gsap.from(el, {
                    opacity: 0,
                    y: 50,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%", // Triggers when 85% of the element is visible
                        toggleActions: "play none none reverse",
                    },
                });
            });

            gsap.utils.toArray(".scale-reveal").forEach((el) => {
                gsap.from(el, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                });
            });
        }, comp);

        return () => ctx.revert();
    }, []);

    return (
        <>

            <Navbarout />
            <div ref={comp} className="flex flex-col items-center text-center px-6 md:px-20 lg:px-32">
                <style>
                    {`
                    body {
                        background-image: url(${test});
                        background-repeat: no-repeat;
                        background-size: cover;
                    }
                `}
                </style>
                {/* Hero Section */}
                <h1 className="neon-title fade-up mt-24 text-[40px] md:text-[72px] font-bold leading-tight">
                    <span className="text-white">Elevate Your</span> <span className="text-[#2BCEE0]">Athletic Journey</span>
                </h1>
                <p className="fade-up text-gray-300 text-lg md:text-2xl mt-4 max-w-2xl">
                    Join the ultimate sports management platform. Connect, track progress, and showcase your achievements with ease.
                </p>

                {/* Get Started Button */}
                {/* <div id="get-started-button" className='flex justify-center items-center mt-8'>
                    <button onClick={handleclick} className='rounded-full px-5 py-2 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 hover:bg-gradient-to-r hover:from-blue-800 hover:via-blue-600 hover:to-blue-800  text-white russo text-[17px] hover:scale-110 transition-all'>Get Started</button>
                </div> */}
                <GetstartedBtn id="get-started-button" onClick={handleclick} className="mt-10" />
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                    <p ref={scrollRef} className="text-white text-lg font-semibold tracking-widest animate-glow">
                        Scroll Down ↓
                    </p>
                </div>


                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-10 scroll-reveal mt-20 w-full">
                    {[
                        { icon: "🏅", title: "Showcase Achievements", desc: "Share the defining highlights of your athletic journey. Upload images and share thoughts that not only capture your passion but also mark those standout achievements, helping boost your profile and inspire your network" },
                        { icon: "🎉", title: "Host & Discover Events", desc: "Step beyond the screen and into dynamic gatherings. Organize, discover, and join events that bring your community together—whether you're cheering on from afar or shaking hands in person." },
                        { icon: "💰", title: "Crowdfunding Support", desc: "Empower athletes by providing direct financial backing through our streamlined crowdfunding platform. Fuel the passion and progress of promising talent." },
                        { icon: "🤖", title: "AI Injury Prevention & Guidance", desc: "Get expert guidance with our AI-powered assistant." },
                        { icon: "📋", title: "Performance Tracking", desc: "Set goals, track progress, and stay ahead." },
                        { icon: "💬", title: "Community & Chat", desc: "Connect with fellow athletes and sports enthusiasts. Enjoy one-on-one chats, vibrant group discussions, and active community forums to share insights, tips, and successes." }
                    ].map((feature, index) => (
                        <div className="w-full scroll-reveal">
                            <div
                                className="rounded-3xl w-full bg-gradient-to-r p-0.5 hover:shadow-glowC hover:brightness-110 "
                                style={{
                                    transition: " box-shadow 0.5s ease",
                                    backgroundImage: `linear-gradient(to right, #00d9ff, #5cfff7, #5768ff)`,
                                }}
                            >
                                {/* <div
                                    className="blur-20 inset-0 h-full w-full rounded-3xl bg-gradient-to-r from-[#4158D0] via-[#C850C0] to-[#FFCC70]"
                                    style={{ transition: "filter 0.5s ease" }}
                                /> */}
                                <div className="flex h-52 items-center justify-center flex-col gap-2 rounded-3xl bg-blue-950 p-4 w-full">
                                    <div className="mb-2 text-xl font-bold text-gray-50">{feature.icon} {feature.title}</div>

                                    <div className="flex-1 text-sm font-medium text-gray-100 text-opacity-80">
                                        {feature.desc}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>



                {/* Call to Action */}
                <div className="scale-reveal mt-20">
                    <h2 className="text-4xl font-bold neon-title">Start Your Journey Today!</h2>
                    <p className="text-lg text-gray-300 mt-4">Join a thriving community of athletes worldwide.</p>
                    <button
                        onClick={() => navigate("/signin")}
                        className="glow-btn mt-8 px-10 py-3 rounded-full text-lg font-bold"
                    >
                        Sign Up Now 🚀
                    </button>
                </div>

            </div>
            <Footer />
        </>
    );
}

export default Getstarted;
