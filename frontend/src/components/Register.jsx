import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './sign_login.css';


export default function Register({ setIsAuthenticated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/registration', {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        setMessage('Thank you for registering successfully!');
        setName('');
        setEmail('');
        setPassword('');
        navigate('/login'); // Navigate to login page after successful registration
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage(error.response.data.message); // Assuming backend sends { message: 'User already exists' }
      } else {
        setMessage('Registration failed. Please try again later.');
        console.error(error);
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
          value={name}
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
