import React from "react";
import "../styles/navbar.css";

const NavBar = ({ isLoggedIn, onLogout }) => {
  return (
    <div className="navbar">
      {isLoggedIn && (
        <button className="logout-button" onClick={onLogout}>
          Log Out
        </button>
      )}
    </div>
  );
};

export default NavBar;
