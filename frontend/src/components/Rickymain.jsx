import React, { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import Home from './Home';
import './sign_login.css';

function Rickymain() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <>
      <nav>
        {isAuthenticated ? (
          <Link to="/logout"></Link>
        ) : (
          <>
          <div className="linkRL">
            <Link to="/register">Register</Link> /
            <Link to="/login">Log In</Link>
            </div>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/home" element={<Home isAuthenticated={isAuthenticated} />} />
      </Routes>
    </>
  );
}

export default Rickymain;
