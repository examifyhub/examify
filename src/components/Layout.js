import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Allow access to login and register pages without authentication
  if (!token && location.pathname !== "/login" && location.pathname !== "/register") {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-area">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
