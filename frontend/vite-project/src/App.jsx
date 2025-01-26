import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Calendar from "./components/Calendar";
import Admin from "./components/Admin";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Track the logged-in user's ID
  const [role, setRole] = useState(null); // Track the user's role (e.g., "admin" or "user")

  const handleLogin = (token, userRole) => {
    // Save the user role and update the logged-in state
    setRole(userRole);
    setIsLoggedIn(true);

    // Optionally store token and role in localStorage for session persistence
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Log the user out and return to Login page
    setUserId(null); // Clear the userId
    setRole(null); // Clear the role

    // Clear stored token and role
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main>
        <Routes>
          {/* Public Login Route */}
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
            }
          />

          {/* Redirect to Admin Dashboard if user is an admin */}
          <Route
            path="/admin"
            element={
              isLoggedIn && role === "admin" ? (
                <Admin />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Default Calendar for regular users */}
          <Route
            path="/"
            element={
              isLoggedIn && role === "user" ? (
                <Calendar userId={userId} />
              ) : isLoggedIn && role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch-all route for unauthorized access */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
