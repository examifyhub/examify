import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Examify</Link>
      </div>

      {/* Mobile Menu Icon */}
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Navbar Links */}
      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/home" onClick={toggleMenu}>
            <FaHome /> Home
          </Link>
        </li>
        <li>
          <Link to="/dashboard" onClick={toggleMenu}>
            <FaTachometerAlt /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/recommendation" onClick={toggleMenu}>
            <FaBook /> Recommendation
          </Link>
        </li>
        <li>
          <Link to="/conduct-exam" onClick={toggleMenu}>
            <FaEdit /> Conduct Exam
          </Link>
        </li>
        <li>
          <Link to="/logout" onClick={toggleMenu}>
            <FaSignOutAlt /> Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
