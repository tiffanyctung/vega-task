import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Input from "./input";

describe("Input Component", () => {
  test("renders text input correctly", () => {
    const handleChange = jest.fn();

    render(
      <Input
        type="text"
        placeholder="Enter text"
        value="Test value"
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveValue("Test value");
  });

  test("renders password input correctly", () => {
    const handleChange = jest.fn();

    render(
      <Input
        type="password"
        placeholder="Enter password"
        value="secret"
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText("Enter password");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveValue("secret");
  });

  test("calls onChange handler when input value changes", () => {
    const handleChange = jest.fn();

    render(
      <Input
        type="text"
        placeholder="Enter text"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText("Enter text");
    fireEvent.change(input, { target: { value: "New value" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
