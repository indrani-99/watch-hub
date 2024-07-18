import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import Home from './Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const navigate = useNavigate(); // useNavigate hook to navigate programmatically

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
            <Link to="/register">Register</Link> /
            <Link to="/login">Log In</Link>
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

export default App;
