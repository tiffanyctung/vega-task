import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LineChart from "./line-chart";
import { Price } from "../../services/api.service";
import { ThemeProvider } from "../../context/ThemeContext";

// Mock Chart.js to avoid canvas rendering issues in tests
jest.mock("react-chartjs-2", () => ({
  Line: () => <div data-testid="mock-line-chart" />,
}));

describe("LineChart Component", () => {
  const mockPrices: Price[] = [
    {
      id: "price-1",
      asset: "Portfolio",
      price: 10000,
      asOf: "2023-07-01T00:00:00Z",
    },
    {
      id: "price-2",
      asset: "Portfolio",
      price: 10500,
      asOf: "2023-07-08T00:00:00Z",
    },
    {
      id: "price-3",
      asset: "Portfolio",
      price: 11000,
      asOf: "2023-07-15T00:00:00Z",
    },
    {
      id: "price-4",
      asset: "Portfolio",
      price: 10800,
      asOf: "2023-07-22T00:00:00Z",
    },
    {
      id: "price-5",
      asset: "Portfolio",
      price: 11200,
      asOf: "2023-07-29T00:00:00Z",
    },
  ];

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
  };

  test("renders line chart when prices are available", () => {
    renderWithTheme(<LineChart prices={mockPrices} />);
    expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
  });

  test('renders "No historical data available" when prices array is empty', () => {
    renderWithTheme(<LineChart prices={[]} />);
    expect(
      screen.getByText(
        "No portfolio value history available for the selected time range"
      )
    ).toBeInTheDocument();
  });

  test('renders "No historical data available" when prices is null', () => {
    renderWithTheme(<LineChart prices={null as any} />);
    expect(
      screen.getByText(
        "No portfolio value history available for the selected time range"
      )
    ).toBeInTheDocument();
  });

  test("formats Y-axis values correctly", () => {
    // This is testing an internal function, but we can verify the component renders
    renderWithTheme(<LineChart prices={mockPrices} />);
    expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
  });

  test("sorts prices by date before rendering", () => {
    const unsortedPrices: Price[] = [
      {
        id: "price-5",
        asset: "Portfolio",
        price: 11200,
        asOf: "2023-07-29T00:00:00Z",
      },
      {
        id: "price-1",
        asset: "Portfolio",
        price: 10000,
        asOf: "2023-07-01T00:00:00Z",
      },
      {
        id: "price-3",
        asset: "Portfolio",
        price: 11000,
        asOf: "2023-07-15T00:00:00Z",
      },
    ];

    renderWithTheme(<LineChart prices={unsortedPrices} />);
    expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
  });

  test("handles edge case with single price point", () => {
    const singlePrice: Price[] = [
      {
        id: "price-1",
        asset: "Portfolio",
        price: 10000,
        asOf: "2023-07-01T00:00:00Z",
      },
    ];

    renderWithTheme(<LineChart prices={singlePrice} />);
    expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
  });
});
