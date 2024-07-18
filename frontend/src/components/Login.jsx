import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password,
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        setMessage('Login successful');
        setEmail('');
        setPassword('');
        navigate('/logout'); // Redirect to logout page after successful login
      }
    } catch (error) {
      setMessage('Login failed');
      console.log(error);
    }
  };

  return (
    <div>
      <h1>This is the login page</h1>
      {message && <div>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
