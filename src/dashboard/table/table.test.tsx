import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Table from "./table";
import { Portfolio, Asset } from "../../services/api.service";

describe("Table Component", () => {
  const mockAssets: Asset[] = [
    { id: "123e4567-e89b-12d3-a456-426614174010", name: "AAPL", type: "stock" },
    { id: "123e4567-e89b-12d3-a456-426614174013", name: "BTC", type: "crypto" },
    { id: "123e4567-e89b-12d3-a456-426614174015", name: "GBP", type: "fiat" },
  ];

  const mockPortfolio: Portfolio = {
    id: "323e4567-e89b-12d3-a456-426614174000",
    asOf: "2023-07-29T00:00:00Z",
    positions: [
      {
        id: "pos-1",
        asset: "123e4567-e89b-12d3-a456-426614174010",
        quantity: 10,
        price: 180.95,
        asOf: "2023-07-29T00:00:00Z",
      },
      {
        id: "pos-2",
        asset: "123e4567-e89b-12d3-a456-426614174013",
        quantity: 0.5,
        price: 58750.25,
        asOf: "2023-07-29T00:00:00Z",
      },
    ],
  };

  const columns = ["Asset", "Type", "Quantity", "Price (USD)", "Value (USD)"];

  test("renders table with portfolio data", () => {
    render(
      <Table portfolio={mockPortfolio} assets={mockAssets} columns={columns} />
    );

    // Check if column headers are rendered
    columns.forEach((column) => {
      expect(screen.getByText(column)).toBeInTheDocument();
    });

    // Check if asset names are rendered
    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("BTC")).toBeInTheDocument();

    // Check if asset types are rendered
    expect(screen.getByText("stock")).toBeInTheDocument();
    expect(screen.getByText("crypto")).toBeInTheDocument();

    // Check if quantities are rendered
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("0.5")).toBeInTheDocument();

    // Check if prices are rendered
    expect(screen.getByText("$180.95")).toBeInTheDocument();
    expect(screen.getByText("$58750.25")).toBeInTheDocument();

    // Check if values are rendered (quantity * price)
    expect(screen.getByText("$1809.50")).toBeInTheDocument();
    expect(screen.getByText("$29375.13")).toBeInTheDocument();
  });

  test('renders "No portfolio data available" when portfolio is null', () => {
    render(
      <Table portfolio={null as any} assets={mockAssets} columns={columns} />
    );
    expect(screen.getByText("No portfolio data available")).toBeInTheDocument();
  });

  test('renders "No portfolio data available" when assets array is empty', () => {
    render(<Table portfolio={mockPortfolio} assets={[]} columns={columns} />);
    expect(screen.getByText("No portfolio data available")).toBeInTheDocument();
  });

  test('renders "No positions available" when portfolio has no positions', () => {
    const emptyPortfolio: Portfolio = {
      ...mockPortfolio,
      positions: [],
    };

    render(
      <Table portfolio={emptyPortfolio} assets={mockAssets} columns={columns} />
    );
    expect(screen.getByText("No positions available")).toBeInTheDocument();
  });

  test('renders "Unknown" for asset name and type when asset is not found', () => {
    const portfolioWithUnknownAsset: Portfolio = {
      ...mockPortfolio,
      positions: [
        {
          id: "pos-3",
          asset: "unknown-id",
          quantity: 5,
          price: 100,
          asOf: "2023-07-29T00:00:00Z",
        },
      ],
    };

    render(
      <Table
        portfolio={portfolioWithUnknownAsset}
        assets={mockAssets}
        columns={columns}
      />
    );
    expect(screen.getAllByText("Unknown")[0]).toBeInTheDocument(); // Asset name
    expect(screen.getAllByText("Unknown")[1]).toBeInTheDocument(); // Asset type
  });
});
