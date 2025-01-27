import logo from '../assets/logo.png';
function Coachpage(){
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
    const currentrolelist = [
        "Head Coach",
        "Assistant Coach",
        "Strength & Conditioning Coach",
        "Skills Trainer",
        "Fitness Coach",
        "Tactical Coach",
        "Team Manager",
        "Performance Analyst",
        "Mental Skills Coach",
        "Sports Nutritionist",
      ]
    return(
        <div>
            <div style={{justifyContent: 'center'}} className="left flex items-center md:text-6xl text-3xl ml-4 md:ml-10 gap-5">
                <img src={logo} className='logo md:block md:h-20 md:w-20 hidden rounded-full' />
                <h1 className='russo pt-3'>KOTINOS</h1>
            </div>
            <br />
            <div id="signupbox3">
                
            </div>
        </div>
    )
}
export default Coachpage;