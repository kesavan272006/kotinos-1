import { Button } from "@mui/material";
import { useState } from "react"
import Cricket from "./sportsInfo/cricket";
import Football from "./sportsInfo/football";
import { FaRobot } from "react-icons/fa";

const Sportspage = () => {
    const [check, setCheck]=useState(true);
  return (
    <>
        <nav style={{display:'flex', justifyContent:'space-evenly', backgroundColor:'white', borderBottom:'1px solid black'}}>
            <Button onClick={()=>setCheck(true)}>Cricket</Button>
            <Button onClick={()=>setCheck(false)}>Football</Button>
        </nav>
        
        {check && (
            <Cricket />
        )}
        {!check && (
            <Football />
        )}
    </>
  )
}

export default Sportspage
