import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, {
        username,
        email,
        password,
      });
      alert('Registration successful');
      navigate('/login'); // Redirect after register
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="project-title">Examify</h1>
        <p className="quote">"Empower Your Knowledge, Elevate Your Success"</p>
        <h2>Register</h2>
        <form className="auth-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="auth-button" type="submit">Register</button>
        </form>
        <p className="auth-switch">
          Already have an account?{' '}
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
