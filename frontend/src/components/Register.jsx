import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './sign_login.css';
import { Base_url } from '../utils/util';


export default function Register({ setIsAuthenticated }) {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${Base_url}/user/register`, {
        username,
        email,
        password
      });
console.log("response",response);
      if(response.status == 200) {
        setMessage(response.data.message);
        setName('');
        setEmail('');
        setPassword('');
        navigate('/login'); // Navigate to login page after successful registration
      }
      else{
        setMessage(response.data.message);
      }
    } catch (error) {
      if(error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Registration failed. Please try again later.');
      }

      
    }
  };

  return (
    <div className='registerMain'>
      {message && <div>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setName(e.target.value)}
          className='signInput'
        /><br />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='signInput'
        /><br />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='signInput'
        /><br />
        <button type="submit" className='buttoRL'>Register</button>
      </form>
    </div>
  );
}
