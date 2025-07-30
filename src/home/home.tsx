import React, { useState } from "react";
import { useLogin } from "../context/LoginContext";
import Button from "../components/button/button";
import Input from "../components/input/input";
import "./home.scss";

const credentials = [
  {
    username: "Tiffany",
    password: "Vega123!",
  },
  {
    username: "Vega",
    password: "Vega123!",
  },
];

const Home = () => {
  const { showLoginForm, setShowLoginForm, setIsLoggedIn, setLoggedInUser } =
    useLogin();
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

    localStorage.setItem("isLoggedInUser", username);

    setUsername("");
    setPassword("");
    setError("");
    setShowLoginForm(false);
    setIsLoggedIn(true);
    setLoggedInUser(username);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowLoginForm(false);
    setError("");
  };

  return (
    <div className="home-screen">
      <h2>Welcome to</h2>
      <h1>VEGA Portfolio</h1>
      {showLoginForm ? (
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        <div className="cta-container">
          <Button type="primary" onClick={() => setShowLoginForm(true)}>
            Log In
          </Button>
          <div className="indicator-line" />
        </div>
      )}
    </div>
  );
};

export default Home;
