import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import DarkModeToggle from "./dark-mode-toggle";
import { ThemeProvider } from "../../context/ThemeContext";

describe("DarkModeToggle Component", () => {
  beforeEach(() => {
    localStorage.clear();
    // Set theme back to default light mode
    localStorage.setItem("theme", "light");
  });

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
  };

  test("renders in light mode by default", () => {
    renderWithTheme(<DarkModeToggle />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
  });

  test("toggles to dark mode when clicked", () => {
    renderWithTheme(<DarkModeToggle />);

    const button = screen.getByRole("button");

    // Initially in light mode
    expect(button).toHaveAttribute("aria-label", "Switch to dark mode");

    // Click to toggle to dark mode
    fireEvent.click(button);

    // Now in dark mode
    expect(button).toHaveAttribute("aria-label", "Switch to light mode");
  });

  test("toggles back to light mode when clicked again", () => {
    renderWithTheme(<DarkModeToggle />);

    const button = screen.getByRole("button");

    // Toggle to dark mode
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-label", "Switch to light mode");

    // Toggle back to light mode
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
  });
});
