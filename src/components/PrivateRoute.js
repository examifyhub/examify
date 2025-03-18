import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // Get the stored token

  console.log("Token in PrivateRoute:", token); // Debugging step

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
