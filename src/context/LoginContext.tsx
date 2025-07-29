import React, { createContext, useContext, useState } from "react";

interface LoginContextType {
  showLoginForm: boolean;
  setShowLoginForm: (value: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  loggedInUser: string;
  setLoggedInUser: (value: string) => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("isLoggedIn"))
  );
  const [loggedInUser, setLoggedInUser] = useState("");

  return (
    <LoginContext.Provider
      value={{
        showLoginForm,
        setShowLoginForm,
        isLoggedIn,
        setIsLoggedIn,
        loggedInUser,
        setLoggedInUser,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};
