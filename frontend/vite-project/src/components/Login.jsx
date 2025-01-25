import React, { useState } from "react";
import "../styles/login.css";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState(""); // Stores the user's input for the username
  const [password, setPassword] = useState(""); // Stores the user's input for the password
  const [showPassword, setShowPassword] = useState(false); // Toggles visibility of the password field
  const [error, setError] = useState(""); // Stores error messages received during login
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Tracks the state of the login process

  // Toggles between showing and hiding the password in the input field
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handles the login logic, including communication with the backend API
  const handleLogin = async () => {
    setIsLoggingIn(true); // Indicates login is in progress
    setError(""); // Clear any previous errors

    try {
      // Backend Note: The `/auth/login` endpoint is expected to validate the username and password.
      // It should return a token upon successful authentication or an error message if authentication fails.
      const response = await fetch("https://cc-api-gateway-77eb02bcc7e1.herokuapp.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Backend Note: Ensure the API accepts JSON
        body: JSON.stringify({ username, password }), // Send username and password as JSON
      });

      if (response.ok) {
        // Backend Note: The response should include a token for user authentication.
        const data = await response.json();
        localStorage.setItem("token", data.token); // Store the token in localStorage for future API calls
        onLogin(data.token, data.user.uRole); // Notify the parent component about the successful login
      } else {
        // Backend Note: The server should provide a user-friendly error message for failed login attempts.
        setError(await response.text());
      }
    } catch {
      // Backend Note: Handle unexpected issues, such as network errors or server downtime.
      setError("Failed to login. Please try again.");
    } finally {
      setIsLoggingIn(false); // Reset the login state after the process is complete
    }
  };

  // Handles form submission and prevents the default page reload
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    handleLogin(); // Trigger the login logic
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Please log in to continue</p>

        {/* Display error messages received during the login process */}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
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
              required // Backend Note: Ensure the username field is not empty when sending the request
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"} // Toggles input type for password visibility
                id="password"
                className="login-input password-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required // Backend Note: Ensure the password field is not empty when sending the request
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}{" "}
                {/* Dynamically toggles button label */}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoggingIn} // Disable the button during login to prevent multiple requests
          >
            {isLoggingIn ? "Logging in..." : "Log In"}{" "}
            {/* Button text updates based on login state */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
