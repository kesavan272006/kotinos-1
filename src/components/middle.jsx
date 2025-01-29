import React from 'react'
import profileicon from '../assets/profileicon.svg'
import galleryicon from '../assets/gallery.svg'
import videoicon from '../assets/videoicon.svg'
import eventicon from '../assets/eventicon.svg'
const Middle = () => {
  return (
    <div style={{width:'50vw', height:'500px', backgroundColor:'white', borderWidth: '1px', marginTop:'50px', borderColor: 'black', borderStyle: 'solid'}}>
      <div style={{display:'flex', paddingTop:'20px', flexDirection:'row', justifyContent:'space-evenly'}}>
        <img src={profileicon} alt="Profile" style={{height:'70px', width:'70px', borderRadius:'50%',backgroundColor:'gray'}} />
        <input type="text" placeholder='start a post' style={{borderRadius:'10px', height: '70px', width: '600px', backgroundColor:'whitesmoke'}} />
      </div>
      <div style={{height:'50px', marginTop:'10px', display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
            <img src={galleryicon} alt="photos" style={{height:'30px', width:'30px', borderRadius:'50%'}} />
            <h3>Photo</h3>
        </div>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
            <img src={videoicon} alt="photos" style={{height:'30px', width:'30px', borderRadius:'50%'}} />
            <h3>Video</h3>
        </div>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
            <img src={eventicon} alt="photos" style={{height:'30px', width:'30px', borderRadius:'50%'}} />
            <h3>Events</h3>
        </div>
      </div>
      <div>

      </div>
    </div>
  )
}

export default Middle
