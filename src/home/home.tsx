import React, { useState } from "react";
import { useLogin } from "../context/LoginContext";
import Button from "../button/button";
import "./home.scss";

const credentials = [
  {
    username: "Tiffany",
    password: "Vega123!",
  },
];

const Home = () => {
  const { showLoginForm, setShowLoginForm } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    const isAuthorized = credentials.find(
      (cred) => cred.username === username && cred.password === password
    );

    if (!isAuthorized) {
      setError("Invalid username or password");
      return;
    }

    localStorage.setItem("isLoggedIn", JSON.stringify(true));

    setUsername("");
    setPassword("");
    setError("");
    setShowLoginForm(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowLoginForm(false);
    setError("");
  };

  return (
    <div className="home-screen">
      <h1>Welcome to Vega Portfolio</h1>
      {showLoginForm ? (
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            {error && <div className="error-message">{error}</div>}
            <div className="form-actions">
              <Button type="primary" onClick={handleSubmit}>
                Log In
              </Button>
              <Button type="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button type="primary" onClick={() => setShowLoginForm(true)}>
          Log In
        </Button>
      )}
    </div>
  );
};

export default Home;
