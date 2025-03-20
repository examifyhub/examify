import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaTachometerAlt, FaBook, FaEdit, FaSignOutAlt } from "react-icons/fa";
import "../styles/Navbar.css";
import logo from "../assets/examify-logo.png"; // ✅ Make sure this path is correct!

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <nav className="navbar">
        {/* ✅ Logo */}
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Examify" className="logo-image" />
          </Link>
        </div>

        {/* ✅ Mobile Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* ✅ Navbar Links */}
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/home" onClick={toggleMenu}>
              <FaHome className="icon" /> Home
            </Link>
          </li>
          <li>
            <Link to="/dashboard" onClick={toggleMenu}>
              <FaTachometerAlt className="icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/recommendation" onClick={toggleMenu}>
              <FaBook className="icon" /> Recommendation
            </Link>
          </li>
          <li>
            <Link to="/conduct-exam" onClick={toggleMenu}>
              <FaEdit className="icon" /> Conduct Exam
            </Link>
          </li>
          <li>
            <Link to="/logout" className="logout-button" onClick={toggleMenu}>
              <FaSignOutAlt className="icon" /> Logout
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
