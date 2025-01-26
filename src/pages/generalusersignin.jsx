import logo from '../assets/logo.png';

function Generaluser(){
    return(
        <div id='outerdivsignin'>
            <div id='signin-imageh1div'>
                <img src={logo} alt="Logo" id='Logo' />
                <h1 className='russo pt-3'>Kotinos</h1>
            </div>
            <div id='signinbox'>
                <h2>Email Id</h2>
                <input type="email" id='firstinputsignin' placeholder='enter your email-Id' />
                <br />
                <h2>Password</h2>
                <input type='password' id='firstinputsignin' placeholder='enter the password' />
                <br />
                <h2>User Name</h2>
                <input type='text' id='firstinputsignin' placeholder='create a userName' />
                <br />
                <h2>Mobile Number</h2>
                <input type="text" id='firstinputsignin' placeholder='enter your mobile number' />
                <br />
                <button id='signinbutton'>Continue</button>
                <br />
                <p>or</p>
                <button id='googlebutton'>Sign in with Google</button>
            </div>
        </div>
    )
}
export default Generaluser;