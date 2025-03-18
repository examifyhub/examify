import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use environment variable for API URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://examify-do1h.onrender.com';

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate empty fields
    if (!username || !email || !password) {
      alert('All fields are required');
      return;
    }

    setLoading(true); // Disable button while processing

    try {
      await axios.post(`${API_URL}/api/register`, {
        username,
        email,
        password,
      });

      alert('Registration successful! Redirecting to login...');
      navigate('/login'); // Redirect after successful registration
    } catch (error) {
      console.error('Registration Error:', error);
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false); // Re-enable button
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
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
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
