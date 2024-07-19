// import React from 'react'

import MainContent from './MainContent'
import Navbar from './Navbar'
import LeftSide from './LeftSide'
import RightSide from './RightSide'
// import "./Main.css";
const Main = () => {
  return (
    
    <div style={{
      alignItems: 'center',
      gap: '10px',
      padding: '3px',
      marginTop:"20px",
      borderRadius: '10px'}}>
            <div style={{justifyContent:"space-evenly",width:"100%",height:"6vh",backgroundColor:"orange",textAlign:"center"}}>
              <Navbar/>
            </div>
          <div style={{display:"flex"}}>
            <LeftSide/>
            <MainContent/>
            <RightSide/>
        </div>

    </div>
  )
}

export default Main