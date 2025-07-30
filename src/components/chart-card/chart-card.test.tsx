import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChartCard from "./chart-card";

describe("ChartCard Component", () => {
  test("renders title correctly", () => {
    render(<ChartCard title="Test Chart Title">Content</ChartCard>);

    expect(screen.getByText("Test Chart Title")).toBeInTheDocument();
  });

  test("renders children content", () => {
    render(
      <ChartCard title="Test Chart">
        <div data-testid="test-content">Chart Content</div>
      </ChartCard>
    );

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Chart Content")).toBeInTheDocument();
  });

  test("renders with complex nested children", () => {
    render(
      <ChartCard title="Complex Chart">
        <div>
          <h3>Subtitle</h3>
          <p>Paragraph text</p>
          <button>Click me</button>
        </div>
      </ChartCard>
    );

    expect(screen.getByText("Complex Chart")).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
    expect(screen.getByText("Paragraph text")).toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("renders without children", () => {
    render(<ChartCard title="Empty Chart" children={undefined} />);

    expect(screen.getByText("Empty Chart")).toBeInTheDocument();
  });
});
