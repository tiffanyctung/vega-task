import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./doughnut-chart.scss";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ id, data }: { id: string; data: any }) => {
  return (
    <div className="doughnut-container">
      <Doughnut
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: true,
        }}
        id={id}
      />
    </div>
  );
};

export default DoughnutChart;
