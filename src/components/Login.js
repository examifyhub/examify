import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("✅ Skipping login...");
    localStorage.setItem("token", "dummy_token"); // Fake token
    navigate("/"); // ✅ Redirect to Home Page
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="project-title">Examify</h1>
        <p className="quote">"Empower Your Knowledge, Elevate Your Success"</p>
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="auth-button" type="submit">Login</button>
        </form>
        <p className="auth-switch">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
