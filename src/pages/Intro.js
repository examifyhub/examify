// pages/Intro.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Intro.css";

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div className="intro-container">
      <div className="intro-card">
        <h1 className="intro-title">
          🎓 Welcome to <span className="brand">Examify</span>
        </h1>

        <p className="intro-subtitle">
          A smarter, safer way to conduct online exams using cutting-edge AI technologies.
        </p>

        <p className="intro-description">
          Examify is an AI-powered proctoring platform designed to maintain the integrity of online examinations.
          We use advanced features such as real-time <strong>face verification</strong>, 
          <strong>anti-spoofing detection</strong>, and secure camera monitoring to ensure a fair environment
          for all participants. Whether you're a student or an institution, Examify offers seamless, scalable,
          and trustworthy assessments from anywhere in the world.
        </p>

        <div className="intro-actions">
          <button className="intro-button" onClick={() => navigate("/login")}>
            Login to Continue
          </button>
          <p className="intro-divider">or</p>
          <button className="intro-outline-button" onClick={() => navigate("/register")}>
            Register as New User
          </button>
        </div>

        <div className="intro-footer">
          <p>🛡️ Face Verification | 🔐 Anti-Spoofing | 🌐 Remote Monitoring | 📊 Smart Reporting</p>
        </div>
      </div>
    </div>
  );
};

export default Intro;
