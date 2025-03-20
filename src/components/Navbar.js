import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaUser, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import "../styles/Navbar.css"; // Make sure you have this CSS file

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* ✅ Logo */}
        <Link to="/" className="logo">
          Examify
        </Link>

        {/* ✅ Mobile Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* ✅ Navbar Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={toggleMenu}>
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link to="/profile" onClick={toggleMenu}>
              <FaUser /> Profile
            </Link>
          </li>
          <li>
            <Link to="/login" onClick={toggleMenu}>
              <FaSignInAlt /> Login
            </Link>
          </li>
          <li>
            <Link to="/register" onClick={toggleMenu}>
              <FaUserPlus /> Register
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
