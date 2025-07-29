import React from "react";
import logo from "./img/vega-logo-w.png";
import "./App.scss";
import { LoginProvider, useLogin } from "./context/LoginContext";

import Button from "./button/button";
import Home from "./home/home";

const AppContent = () => {
  const { setShowLoginForm } = useLogin();

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
          <Button type="primary" onClick={() => setShowLoginForm(true)}>
            Log In
          </Button>
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
