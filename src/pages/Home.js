import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

import extraImg1 from "../assets/eyetracking.jpeg";
import extraImg2 from "../assets/sounddetection.jpg";
import extraImg3 from "../assets/devicedetection.png";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/recommendation");
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>🚀 Welcome to Examify</h1>
          <p>
            A calm, confident test experience powered by AI.<br />
            Eye tracking 👁️ | Sound monitoring 🎙️ | Device detection 📵
          </p>
          <button className="cta-button" onClick={handleGetStarted}>
            Begin Your Test Journey
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="feature-section">
        <h2 className="section-title">✨ Proctoring That Cares</h2>
        <div className="feature-grid">
          <div className="feature-box dark-card">
            <img src={extraImg1} alt="Eye Tracking" />
            <h3>Eye Tracking</h3>
            <p>Maintain focus with gentle gaze monitoring to ensure fairness and flow.</p>
          </div>
          <div className="feature-box dark-card">
            <img src={extraImg2} alt="Sound Detection" />
            <h3>Sound Detection</h3>
            <p>Ensures your environment remains distraction-free during the test.</p>
          </div>
          <div className="feature-box dark-card">
            <img src={extraImg3} alt="Device Restriction" />
            <h3>Device Detection</h3>
            <p>Prevents the use of unauthorized devices while respecting your space.</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about-section">
        <h2>🔒 Integrity Meets Simplicity</h2>
        <p>
          Examify is built to support your success with trust and confidence.
          Whether you're in school, college, or earning a certification, we're here to
          make online exams smooth and secure.
        </p>
      </section>
    </div>
  );
};

export default Home;
