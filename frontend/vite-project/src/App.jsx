import React, { useState } from "react";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Calendar from "./components/Calendar";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Track the logged-in user's ID

  const [role, setRole] = useState(null);

  const handleLogin = (token, userRole) => {
    // decode token if needed, or directly pass userRole
    setRole(userRole);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Log the user out and return to Login page
    setUserId(null); // Clear the userId
  };

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main>
        {isLoggedIn ? (
          <Calendar userId={userId} /> // Pass the userId to the Calendar component
        ) : (
          <Login onLogin={handleLogin} /> // Pass the login handler to Login
        )}
      </main>
    </div>
  );
};

export default App;
