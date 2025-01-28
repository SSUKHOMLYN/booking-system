import React, { useState } from "react";
import "../styles/login.css";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Toggle between showing/hiding the password
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Submit the login form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setIsLoggingIn(true);
    setError("");

    try {
      const response = await fetch(
        "https://cc-api-gateway-77eb02bcc7e1.herokuapp.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      // Try to parse the JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error("Failed to parse server response.");
      }

      // Check if the response is OK and data includes a token
      if (!response.ok) {
        // If backend returns a text error, we can also try:
        // const message = await response.text();
        // throw new Error(message);
        throw new Error(data.message || "Login failed. Please try again.");
      }

      if (!data.token) {
        throw new Error("No token returned from server. Please contact support.");
      }

      // If your server attaches user info as `data.user`, ensure it has a role
      if (!data.user || !data.user.role) {
        throw new Error("No user role returned from server. Please contact support.");
      }

      // Store the token (and possibly user info) in localStorage
      localStorage.setItem("token", data.token);

      // Notify parent component that login succeeded; pass token + role
      onLogin(data.token, data.user.role);
    } catch (err) {
      // Handle either fetch or parse or custom errors
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Please log in to continue</p>

        {/* Display error messages */}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* USERNAME */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="login-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="login-input password-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="login-button"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
