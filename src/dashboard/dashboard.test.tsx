import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "./dashboard";
import { ThemeProvider } from "../context/ThemeContext";
import { Asset, Portfolio, Price } from "../services/api.service";

// Mock the API service with explicit implementation to avoid axios import issues
jest.mock("../services/api.service", () => {
  return {
    __esModule: true,
    getAssets: jest.fn(),
    getPortfolio: jest.fn(),
    getPrices: jest.fn(),
  };
});

// Import after mocking
const apiService = require("../services/api.service");

// Define types for mocked components
type ChartCardProps = {
  title: string;
  children: React.ReactNode;
};

// Mock the child components
jest.mock("./line-chart/line-chart", () => {
  return {
    __esModule: true,
    LineChart: () => <div data-testid="mock-line-chart">Line Chart</div>,
  };
});

jest.mock("./doughnut-chart/doughnut-chart", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-doughnut-chart">Doughnut Chart</div>,
  };
});

jest.mock("./table/table", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-table">Table</div>,
  };
});

jest.mock("../components/chart-card/chart-card", () => {
  return {
    __esModule: true,
    ChartCard: ({ title, children }: ChartCardProps) => (
      <div
        data-testid={`mock-chart-card-${title
          .replace(/\s+/g, "-")
          .toLowerCase()}`}
      >
        <h3>{title}</h3>
        {children}
      </div>
    ),
  };
});

jest.mock("../components/filter-buttons/filter-buttons", () => {
  return {
    __esModule: true,
    FilterButtons: () => <div data-testid="mock-filter-buttons">Filter Buttons</div>,
  };
});

describe("Dashboard Component", () => {
  const mockAssets: Asset[] = [
    { id: "123", name: "AAPL", type: "stock" },
    { id: "456", name: "BTC", type: "crypto" },
    { id: "789", name: "GBP", type: "fiat" },
  ];

  const mockPortfolio: Portfolio = {
    id: "portfolio-1",
    asOf: "2023-07-29T00:00:00Z",
    positions: [
      {
        id: "pos-1",
        asset: "123",
        quantity: 10,
        price: 180.95,
        asOf: "2023-07-29T00:00:00Z",
      },
      {
        id: "pos-2",
        asset: "456",
        quantity: 0.5,
        price: 58750.25,
        asOf: "2023-07-29T00:00:00Z",
      },
    ],
  };

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
      price: 11000,
      asOf: "2023-07-29T00:00:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock API responses
    apiService.getAssets.mockResolvedValue(mockAssets);
    apiService.getPortfolio.mockResolvedValue(mockPortfolio);
    apiService.getPrices.mockResolvedValue(mockPrices);
  });

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
  };

  test("renders loading state initially", () => {
    renderWithTheme(<Dashboard loggedInUser="TestUser" />);
    expect(screen.getByText(/Loading portfolio data/i)).toBeInTheDocument();
  });
});
