import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';  // ✅ Firebase auth import
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required!');
      return;
    }

    try {
      // ✅ Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("✅ Login Successful:", user);

      // ✅ Store token in localStorage
      const token = await user.getIdToken();
      localStorage.setItem('token', token);

      alert('Login successful!');
      
      // ✅ Navigate to Home Page
      navigate('/');

    } catch (error) {
      console.error("❌ Login Failed:", error.message);
      setError(error.message || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="project-title">Examify</h1>
        <p className="quote">"Empower Your Knowledge, Elevate Your Success"</p>
        
        <h2>Login</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}  {/* ✅ Display Error */}

        <form className="auth-form" onSubmit={handleLogin}>
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
