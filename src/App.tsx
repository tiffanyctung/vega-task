import React from "react";
import logo from "./img/vega-logo-w.png";
import "./App.scss";
import { LoginProvider, useLogin } from "./context/LoginContext";

import Button from "./components/button/button";
import Main from "./main/main";

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
                  localStorage.removeItem("isLoggedInUser");
                  setIsLoggedIn(false);
                }}
              >
                Log Out
              </Button>
            </>
          )}
        </div>
      </header>
      <Main />
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
