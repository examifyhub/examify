import React from "react";
import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  console.log("✅ Skipping authentication in PrivateRoute.");
  return <Outlet />; // Always allow access
};

export default PrivateRoute;
