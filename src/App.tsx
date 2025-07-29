import React from "react";
import logo from "./img/vega-logo-w.png";
import "./App.scss";
import { LoginProvider, useLogin } from "./context/LoginContext";

import Button from "./button/button";
import Home from "./home/home";

const AppContent = () => {
  const {
    showLoginForm,
    setShowLoginForm,
    isLoggedIn,
    setIsLoggedIn,
    loggedInUser,
  } = useLogin();

  return (
    <div className="App">
      <header className="App-header">
        <div className="left">
          <div className="logo-wrap">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <h2>Portfolio</h2>
        </div>
        <div className="right">
          {!showLoginForm && !isLoggedIn && (
            <Button type="primary" onClick={() => setShowLoginForm(true)}>
              Log In
            </Button>
          )}
          {isLoggedIn && (
            <>
              <p>Hi {loggedInUser}</p>
              <Button
                type="secondary"
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  setIsLoggedIn(false);
                }}
              >
                Log Out
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="main">
        <Home />
      </div>
    </div>
  );
};

function App() {
  return (
    <LoginProvider>
      <AppContent />
    </LoginProvider>
  );
}

export default App;
