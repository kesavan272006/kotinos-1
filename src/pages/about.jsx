import logo from '../assets/logo.png';

function About(){
    return(
        <div>
            <div style={{justifyContent: 'center'}} className="left flex items-center md:text-6xl text-3xl ml-4 md:ml-10 gap-5">
                <img src={logo} className='logo md:block md:h-20 md:w-20 hidden rounded-full' />
                <h1 className='russo pt-3'>KOTINOS</h1>
            </div>
                <br />
                <p style={{fontSize: 20}}>Kotinos is a groundbreaking platform designed to revolutionize the way athletes, coaches, and sports organizations manage and elevate their careers. Tailored specifically for the unique needs of the Indian sporting industry, Kotinos provides a seamless, centralized solution that connects athletes with the tools they need to succeed. 
                    Whether you're an athlete looking to track your performance, plan your career, or manage your finances, Kotinos offers an intuitive, user-friendly interface that consolidates all your needs in one place. The platform not only helps monitor progress but also provides expert advice on injury prevention, training plans, and mental well-being, ensuring holistic development. Coaches can seamlessly track their athletes’ growth, provide targeted feedback, and enhance collaboration for better results. 
                    With Kotinos, athletes no longer have to navigate fragmented systems. They gain access to a vibrant community of like-minded individuals, fostering connections, knowledge sharing, and growth. From up-and-coming talent to established professionals, Kotinos empowers every athlete to reach their fullest potential, offering personalized resources, career insights, and the tools to navigate their journey with confidence. Transform the way you manage your athletic career with Kotinos—where your potential meets opportunity.
                </p>
        </div>
    )
}
export default About;

