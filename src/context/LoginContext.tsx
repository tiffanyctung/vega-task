import React, { createContext, useContext, useState } from 'react';

interface LoginContextType {
  showLoginForm: boolean;
  setShowLoginForm: (value: boolean) => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);

  return (
    <LoginContext.Provider value={{ showLoginForm, setShowLoginForm }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};
