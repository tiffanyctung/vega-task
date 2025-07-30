import React, { useState } from "react";
import logo from "./img/vega-logo-w.png";
import "./App.scss";
import { LoginProvider, useLogin } from "./context/LoginContext";
import { ThemeProvider } from "./context/ThemeContext";

import Button from "./components/button/button";
import DarkModeToggle from "./components/dark-mode-toggle/dark-mode-toggle";
import Main from "./main/main";

const AppContent = () => {
  const {
    showLoginForm,
    setShowLoginForm,
    isLoggedIn,
    setIsLoggedIn,
    loggedInUser,
  } = useLogin();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedInUser");
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
  };

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
          <div className="desktop-menu">
            {!showLoginForm && !isLoggedIn && (
              <Button type="primary" onClick={() => setShowLoginForm(true)}>
                Log In
              </Button>
            )}
            {isLoggedIn && (
              <>
                <p>Hi {loggedInUser}</p>
                <Button type="secondary" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            )}
            <DarkModeToggle />
          </div>

          <div className="mobile-menu">
            {isLoggedIn ? (
              <>
                <ul
                  className="mobile-menu-icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <li />
                  <li />
                  <li />
                </ul>
                <div
                  className={`mobile-menu-container ${
                    isMobileMenuOpen ? "active" : ""
                  }`}
                >
                  <ul className="mobile-menu-list">
                    <li>Hi {loggedInUser}</li>
                    <li>
                      <DarkModeToggle />
                    </li>
                    <li>
                      <Button type="secondary" onClick={handleLogout}>
                        Log Out
                      </Button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <DarkModeToggle />
            )}
          </div>
        </div>
      </header>
      <Main />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LoginProvider>
        <AppContent />
      </LoginProvider>
    </ThemeProvider>
  );
}

export default App;
