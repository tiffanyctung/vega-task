import React from "react";
import logo from "./img/vega-logo-w.png";
import "./App.scss";

import Button from "./button/button";

function App() {
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
          <Button>Log In</Button>
        </div>
      </header>
    </div>
  );
}

export default App;
