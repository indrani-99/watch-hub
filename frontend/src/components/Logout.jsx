import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Logout.css';
import backgroundVideo from './vide.mp4'; // Adjust the path to your video file

export default function Logout({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false');
    navigate('/register'); // Redirect to register page after logout
  };

  return (
    <>
      <video autoPlay muted loop className="videoBackground">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <nav className="logoutMain">
        <div>
          <img src="" alt="" />
        </div>

        <div>
          <Link to="">Community |</Link>
          <Link to=""> Upgrade</Link>
        </div>

        <div>
          <button onClick={handleLogout} className="logoutBtn">Log out</button>
        </div>
      </nav>

      <div className="createRoomPart">
        <h2>spent time together</h2>
        <Link to=""><button className="createRoomBtn">create your room</button></Link>
        <p>( No user account required )</p>
      </div>
    </>
  );
}
