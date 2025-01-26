import { useState } from 'react';
import logo from '../assets/logo.png';
function Organization(){
    const [selectedbranch, setselectetdbranch] = useState('');
    const handleselectedbranch = (e) =>{
        setselectetdbranch(e.target.value)
    }
    return(
        <div id='outerdivsignin2'>
            <div id='signin-imageh1div'>
                <img src={logo} alt="Logo" id='Logo' />
                <h1>Kotinos</h1> 
            </div>
            <br />
            <div>
                <h1 style={{textAlign: 'center', marginBottom: '4px'}}>Please enter the following details</h1>
            </div>
            <div id='signinbox2'>
                <h2>Name of your organization</h2>
                <input id='firstinputsignin2' type="text" placeholder="enter the name of your organization"  />
                <br />
                <h2>Enter the official Email address</h2>
                <input id='firstinputsignin2' type="email" placeholder="enter your official email Id" />
                <br />
                <h2>Enter password</h2>
                <input id='firstinputsignin2' type="password" placeholder="enter password here" />
                <br />
                <h2>Enter the url of your website (if available*)</h2>
                <input id='firstinputsignin2' type="text" placeholder="enter the name of your organization" />
                <br />
                <h2>Organization type</h2>
                <div>
                    <label>
                        <input type="radio" value='sports event organizer' checked={selectedbranch=== 'sports event organizer'} onChange={handleselectedbranch} />
                        A sports Event Organizer
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" value='sports team or club' checked={selectedbranch=== 'sports team or club'} onChange={handleselectedbranch} />
                        A sports team or Club
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" value='fitness center or gym' checked={selectedbranch=== 'fitness center or gym'} onChange={handleselectedbranch} />
                        A Fitness center or Gym
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" value='talent management agency' checked={selectedbranch=== 'talent management agency'} onChange={handleselectedbranch} />
                        A Talent Management Agency
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" value='university or educational institution' checked={selectedbranch=== 'university or educational institution'} onChange={handleselectedbranch} />
                        A University or Educational Institution
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" value='sports equipment provider' checked={selectedbranch=== 'sports equipment provider'} onChange={handleselectedbranch} />
                        A sports Equipment Provider
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" value='non-profit organization' checked={selectedbranch=== 'non-profit organization'} onChange={handleselectedbranch} />
                        A Non-Profit Organization focused on sports
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" value='others' checked={selectedbranch=== 'others'} onChange={handleselectedbranch} />
                        Other (please specify*)
                        <br />
                        <input id='firstinputsignin' type="text" placeholder="enter here...." />
                    </label>
                </div>
                <button id="signupcontinue">Finish</button>
            </div>
        </div>
    )
}
export default Organization;