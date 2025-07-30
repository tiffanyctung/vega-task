import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock axios to fix the ESM import issue
jest.mock("axios", () => {
  return {
    __esModule: true,
    default: {
      get: jest.fn(() => Promise.resolve({ data: {} })),
      post: jest.fn(() => Promise.resolve({ data: {} })),
    },
  };
});

// Mock API service to avoid direct axios imports
jest.mock("./services/api.service", () => {
  return {
    __esModule: true,
    getAssets: jest.fn(() => Promise.resolve([])),
    getPortfolio: jest.fn(() => Promise.resolve({})),
    getPrices: jest.fn(() => Promise.resolve([])),
  };
});

test("renders the app header", () => {
  render(<App />);
  const headerElement = screen.getByRole("img", { name: "logo" });
  expect(headerElement).toBeInTheDocument();
});
