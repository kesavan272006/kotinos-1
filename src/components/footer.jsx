import { VscGithub } from "react-icons/vsc";
function Footer() {
    return (
        <footer className='page-container bg-black text-white text-center py-5'>
            <div className="icons flex justify-center gap-8 items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-instagram cursor-pointer hover:scale-125 transition-all" viewBox="0 0 16 16">
                    <VscGithub />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-envelope cursor-pointer hover:scale-125 transition-all" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                </svg>
            </div>
            <div className="md:text-2xl text-lg">
                © 2025 Kotinos. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer;
