
import logo from '../assets/logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Athleteinfo(){
    const navigate = useNavigate();
    function handlenavigation(){
        if(selectedOption===''||username===''||birthdate==''||primarysports===''||state===''){
            alert("Please fill in the required fields.");
        }else{
            navigate('/profile');
        }
    }
    const statesOfIndia = [
        "Andaman and Nicobar Islands",
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chandigarh",
        "Chhattisgarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Lakshadweep",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Puducherry",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
      ];
      const sportsArray = [
        "Running",
        "Marathon",
        "Long Jump",
        "High Jump",
        "Shot Put",
        "Discus Throw",
        "Javelin Throw",
        "Sprint",
        "Hurdles",
        "Pole Vault",
        "Basketball",
        "Football",
        "Cricket",
        "Hockey",
        "Badminton",
        "Tennis",
        "Table Tennis",
        "Volleyball",
        "Swimming",
        "Boxing",
        "Wrestling",
        "Gymnastics",
        "Cycling",
        "Rugby",
        "Skiing",
        "Archery",
        "Weightlifting",
        "Fencing",
        "Rowing",
        "Handball",
        "Golf",
        "Triathlon",
        "MMA (Mixed Martial Arts)",
        "Surfing",
        "Skateboarding",
        "Rock Climbing",
        "Polo",
        "Badminton",
        "Kickboxing"
      ];
        const [selectedOption, setselectedOption]= useState('');
        const [primarysports, setprimarysports]= useState('');
        const handlesportsprim=(e)=>{
            setprimarysports(e.target.value);
        }
        const [secondarysports, setsecondarysports]= useState('');
        const handlesportssec=(e)=>{
            setsecondarysports(e.target.value);
        }
        const handleoption=(event)=>{
            setselectedOption(event.target.value)
        } 
        const statelist = statesOfIndia.map((e, index)=>{
                return(
                    <option key={index} value={e}>{e}</option>
                )
        }) 
        const primarysportslist = sportsArray.map((e, index)=>{
            if(e=='Marathon'){
                return(
                    <option key={index} value={e} selected>{e}</option>
                )
            }else{
                return(
                    <option key={index} value={e}>{e}</option>
                )
            }
        })
        const secondarysportslist = sportsArray.map((e, index)=>{
            if(e=='Sprint'){
                return(
                    <option key={index} value={e} selected>{e}</option>
                )
            }else{
                return(
                    <option key={index} value={e}>{e}</option>
                )
            }
        })
        const [username, setusername] = useState("");
        const namehandler = (e) =>{
            setusername(e.target.value);
        }
        const [birthdate, setbirthdate] = useState("");
        const birthdatehandler = (e) =>{
            console.log(birthdate)
            setbirthdate(e.target.value);
            console.log(birthdate)
        }
        const [state, setstate] = useState('');
        const statehandler= (e)=>{
            setstate(e.target.value);
        }
        const [experience, setexperience] = useState(0);
        const expereincehandler= (e)=>{
            setexperience(e.target.value);
        }
    return (
        <div>
            <div style={{justifyContent: 'center'}} className="left flex items-center md:text-6xl text-3xl ml-4 md:ml-10 gap-5">
                <img src={logo} className='logo md:block md:h-20 md:w-20 hidden rounded-full' />
                <h1 className='russo pt-3'>KOTINOS</h1>
            </div>
            <br />
            <h1 style={{textAlign: 'center'}}>Hey Champ! Tell us about yourself</h1>
            <br />
            <div id='signupbox2'>
                <h1>Full Name</h1>
                <input value={username} onChange={namehandler} id='firstinputsignin' type="text" placeholder='Enter your full name' required/>
                <h1>Your Date of Birth</h1>
                <input value={birthdate} onChange={birthdatehandler} id="firstinputsignin" type="date" placeholder="Pick your date of birth" required/>
                <h1>Your gender</h1>
                <select id="firstinputsignin" required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say" selected>Prefer not to say</option>
                </select>
                <h1>Your state</h1>
                <select value={state} onChange={statehandler} id="firstinputsignin" required>
                    {statelist}
                </select>
                <h1>Your primary Sports</h1>
                <select value={primarysports} onChange={handlesportsprim} id="firstinputsignin" required>
                    {primarysportslist}
                </select>
                <h1>Your secondary Sports (if any*)</h1>
                <select value={secondarysports} onChange={handlesportssec} id="firstinputsignin">
                    {secondarysportslist}
                </select>
                <h1>Your Skill level</h1>
                <div>
                    <div>
                        <label>
                            <input type="radio" value='Beginner' checked={selectedOption==='Beginner'} onChange={handleoption} />
                            Beginner
                        </label>
                    </div>
                    <div>
                        <label>
                            <input type="radio" value='Intermediate' checked={selectedOption==='Intermediate'} onChange={handleoption} />
                            Intermediate
                        </label>
                    </div>
                    <div>
                        <label>
                            <input type="radio" value='Advanced' checked={selectedOption==='Advanced'} onChange={handleoption}/>
                            Advanced
                        </label>
                    </div>
                    <div>
                        <label>
                            <input type="radio" value='Professional' checked={selectedOption==='Professional'} onChange={handleoption}/>
                            Professional
                        </label>
                    </div>
                </div>
                <h1>No of years of experience (if any*)</h1>
                <input onChange={setexperience} placeholder='enter the value in years' type="number" id='firstinputsignin'  step="1" min={0}/>
                <button onClick={handlenavigation} id='signupcontinue'>Continue</button>
            </div>
        </div>
    )
}
export default Athleteinfo;