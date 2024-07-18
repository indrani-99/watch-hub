import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  './Logout.css';


export default function Logout({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false');
    navigate('/register'); // Redirect to register page after logout
  };

  return (
    // maindiv
    <div className='logoutMain'> 
    <div>
    <img src="" alt="" /> 
    </div>

      <div>
      <Link to="">Community | </Link>
      <Link to="">Upgrade</Link>
      </div>

      <div>
      <button onClick={handleLogout}>Log out</button>
      </div>
{/* // maindiv end */}
    </div>

  );
}
