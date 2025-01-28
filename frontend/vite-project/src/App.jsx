import React, { useState } from "react";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Calendar from "./components/Calendar";
import Admin from "./components/Admin"; // <-- import Admin

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  const handleLogin = (token, userRole) => {
    // decode token or directly use userRole
    setRole(userRole);    // e.g. "ADMIN"
    setIsLoggedIn(true);
    // if you also want to store userId from the login response, do it here
    // setUserId(userIdFromServer);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setRole(null);
    localStorage.removeItem("token"); // Clear token if needed
  };

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main>
        {!isLoggedIn ? (
          // Not logged in => show Login
          <Login onLogin={handleLogin} />
        ) : role === "ADMIN" ? (
          // If logged in AND role is admin => show Admin page
          <Admin />
        ) : (
          // Otherwise => show Calendar for normal users
          <Calendar userId={userId} />
        )}
      </main>
    </div>
  );
};

export default App;
