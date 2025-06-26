import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Recommendation from "./pages/Recommendation";
import ConductExam from "./pages/ConductExam";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login"; // ✅ Login is in components, not pages
import Register from "./components/Register"; // ✅ Register is in components, not pages
import Logout from "./components/Logout"; // ✅ Logout is in components, not pages
import PrivateRoute from "./components/PrivateRoute"; // ✅ Ensures only logged-in users access protected routes
import Intro from "./pages/Intro";
import AuthRedirect from "./components/AuthRedirect";

function App() { 
  return (
    <Router>
      <Routes>
        {/* Public Routes (Without Navbar & Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/" element={<AuthRedirect />} />


        {/* Protected Routes (With Navbar & Footer) */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/*"
            element={
              <div className="app-container">
                <Navbar />
                <div className="content-area">
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/recommendation" element={<Recommendation />} />
                    <Route path="/conduct-exam" element={<ConductExam />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<Navigate to="/home" />} /> {/* fallback for unknown routes */}

                  </Routes>
                </div>
                <Footer />
              </div>
            }
          />
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
