import React from 'react'
import profileicon from '../assets/profileicon.svg'
import backicon from '../assets/back.svg'
import { Link } from 'react-router-dom'
const MessageNav = ({username, role}) => {
  return (
    <nav style={{width:'100%', backgroundColor:'white', height:'50px', display:'flex', justifyContent:'space-between'}}>
        <div style={{display:'flex', justifyContent:'space-between'}}>
            <Link to='/network'><img src={backicon} alt="go back" /></Link>
            <img src={profileicon} alt="pic" style={{backgroundColor:'gray',marginLeft:'15px', height:'50px', width:'50px', borderRadius:'50%'}} />
            <div style={{marginLeft:'20px',display:'flex', flexDirection:'column', justifyContent:'center'}}>
                <strong>{username}</strong>
                <h2>{role}</h2>
            </div>
        </div>
    </nav>
  )
}

export default MessageNav
