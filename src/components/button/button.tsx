import React, { MouseEvent } from "react";
import "./button.scss";

interface ButtonProps {
  children: string;
  type: "primary" | "secondary" | "disabled";
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ children, type, onClick }) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <button className={`btn-${type}`} onClick={handleClick}>
      {children}
    </button>
  );
};

export default Button;
