import React, { ReactElement } from "react";
import "./button.scss";

const Button = ({ children }: { children: string }): ReactElement => {
  return <button>{children}</button>;
};

export default Button;
