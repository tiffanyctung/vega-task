import React from "react";
import { useLogin } from "../context/LoginContext";
import Dashboard from "../dashboard/dashboard";
import Home from "../home/home";
import "./main.scss";

const Main = () => {
  const { isLoggedIn, loggedInUser } = useLogin();

  return (
    <div className="main">
      {isLoggedIn ? <Dashboard loggedInUser={loggedInUser} /> : <Home />}
    </div>
  );
};

export default Main;
