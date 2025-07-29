import React from "react";
import DoughnutChart from "./doughnut-chart/doughnut-chart";
import LineChart from "./line-chart/line-chart";
import "./dashboard.scss";

const Dashboard = ({ loggedInUser }: { loggedInUser: string }) => {
  const portfolioData = {
    labels: ["Stocks", "Bonds", "Cash"],
    datasets: [
      {
        data: [60, 30, 10],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const historicalData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Performance",
        data: [100, 120, 115, 130, 125, 140],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>{loggedInUser}'s Dashboard</h1>
      <div className="charts-container">
        <div className="chart-card">
          <h3>Portfolio Balance</h3>
          <DoughnutChart id="portfolio-chart" data={portfolioData} />
        </div>
        <div className="chart-card">
          <h3>Historical Performance</h3>
          <LineChart id="historical-chart" data={historicalData} />
        </div>
      </div>
      <div className="chart-card">
        <h3>Position Table</h3>
      </div>
    </div>
  );
};

export default Dashboard;
