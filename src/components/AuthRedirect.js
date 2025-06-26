import React from "react";
import { Navigate } from "react-router-dom";

const AuthRedirect = () => {
  const isAuthenticated = localStorage.getItem("examify_email"); // or use your auth method

  return isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/intro" />;
};

export default AuthRedirect;
