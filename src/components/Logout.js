import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"; // ✅ Reuse existing styles

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token"); // Clear auth token
    setTimeout(() => {
      navigate("/login"); // Redirect after 1.5s
    }, 1500);
  }, [navigate]);

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="project-title">Examify</h1>
        <p className="quote">"Empower Your Knowledge, Elevate Your Success"</p>
        <h2>Logging Out...</h2>
        <p>You are being redirected to the login page.</p>
      </div>
    </div>
  );
};

export default Logout;
