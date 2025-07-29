import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Price } from "../../services/api.service";
import "./line-chart.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  prices: Price[];
}

const LineChart: React.FC<LineChartProps> = ({ prices }) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const formatYAxisValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  useEffect(() => {
    if (!prices || prices.length === 0) {
      setChartData({
        labels: [],
        datasets: [],
      });
      return;
    }

    const sortedPrices = [...prices].sort(
      (a, b) => new Date(a.asOf).getTime() - new Date(b.asOf).getTime()
    );
    const labels = sortedPrices.map((price) =>
      new Date(price.asOf).toLocaleDateString()
    );
    const data = sortedPrices.map((price) => price.price);

    if (labels.length > 0 && data.length > 0) {
      setChartData({
        labels,
        datasets: [
          {
            label: "Total Portfolio Value",
            data,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "rgba(75, 192, 192, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            fill: true,
          },
        ],
      });
    }
  }, [prices]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#444",
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "#444",
          font: {
            size: 10,
          },
          callback: (value: any) => formatYAxisValue(value),
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#444",
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#e0e0e0",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart" as const,
    },
  };

  return (
    <div className="line-chart-container">
      {prices && prices.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="no-data">
          No portfolio value history available for the selected time range
        </div>
      )}
    </div>
  );
};

export default LineChart;
