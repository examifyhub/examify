import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/examify-logo.png"; // Make sure the logo path is correct

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Examify Logo" />
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/home">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/recommendation">Recommendation</Link>
        <Link to="/conduct-exam">Conduct Exam</Link>
        <Link to="/logout">Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
