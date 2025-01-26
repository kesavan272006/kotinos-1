import logo from '../assets/logo.png';
function Emaillogin(){
    return(
        <div>
            <div style={{justifyContent: 'center'}} className="left flex items-center md:text-6xl text-3xl ml-4 md:ml-10 gap-5">
                <img src={logo} className='logo md:block md:h-20 md:w-20 hidden rounded-full' />
                <h1 className='russo pt-3'>KOTINOS</h1>
            </div>
            <br />
            <div id="signupbox3">
                <h1>Email ID</h1>
                <input id='firstinputsignin' type="email" placeholder="Enter your email ID" />
                <br />
                <h1>Password</h1>
                <input id='firstinputsignin' type="password" placeholder="Enter your password" />
                <br />
                <button id="signupcontinue">Finish</button>
                <br />
                <h2>or</h2>
                <br />
                <button id="signupcontinue2">Sign in with Google</button>
            </div>
        </div>
    )
}
export default Emaillogin;