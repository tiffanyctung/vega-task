import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterButtons from "./filter-buttons";

describe("FilterButtons Component", () => {
  const mockData = [
    { label: "Button 1", isActive: true, onClick: jest.fn() },
    { label: "Button 2", isActive: false, onClick: jest.fn() },
    { label: "Button 3", isActive: false, onClick: jest.fn() },
  ];

  test("renders all buttons", () => {
    render(<FilterButtons data={mockData} />);

    expect(screen.getByText("Button 1")).toBeInTheDocument();
    expect(screen.getByText("Button 2")).toBeInTheDocument();
    expect(screen.getByText("Button 3")).toBeInTheDocument();
  });

  test("applies active class to active button", () => {
    render(<FilterButtons data={mockData} />);

    const activeButton = screen.getByRole("button", { name: "Button 1" });
    const inactiveButton = screen.getByRole("button", { name: "Button 2" });

    expect(activeButton).toHaveClass("btn-primary");
    expect(inactiveButton).not.toHaveClass("btn-primary");
  });

  test("calls onClick handler when button is clicked", () => {
    render(<FilterButtons data={mockData} />);

    fireEvent.click(screen.getByText("Button 2"));

    expect(mockData[1].onClick).toHaveBeenCalledTimes(1);
  });

  test("renders nothing when data is empty", () => {
    render(<FilterButtons data={[]} />);

    const filterButtons = screen.queryByTestId("filter-buttons");
    expect(filterButtons).not.toBeInTheDocument();
  });
});
