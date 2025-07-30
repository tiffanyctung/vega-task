import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  ChartData,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Price } from "../../services/api.service";
import { useTheme } from "../../context/ThemeContext";
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

type LineChartDataType = ChartData<"line", number[], string>;

const getChartColors = (darkMode: boolean) => ({
  primary: "rgba(239, 197, 114, 0.8)",
  primaryLight: "rgba(239, 197, 114, 0.2)",
  text: darkMode ? "#e0e0e0" : "#444",
  grid: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
  tooltip: {
    background: darkMode ? "#333" : "#fff",
    border: darkMode ? "#555" : "#e0e0e0",
    text: darkMode ? "#e0e0e0" : "#333",
  },
});

const LineChart: React.FC<LineChartProps> = ({ prices }) => {
  const { darkMode } = useTheme();
  const chartColors = useMemo(() => getChartColors(darkMode), [darkMode]);
  const [chartData, setChartData] = useState<LineChartDataType>({
    labels: [],
    datasets: [],
  });

  const formatYAxisValue = useCallback((value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  }, []);

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
            borderColor: chartColors.primary,
            backgroundColor: chartColors.primaryLight,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: chartColors.primary,
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            fill: true,
          },
        ],
      });
    }
  }, [prices, chartColors.primary, chartColors.primaryLight]);

  const options = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: chartColors.text,
            font: {
              size: 10,
            },
          },
        },
        y: {
          grid: {
            color: chartColors.grid,
          },
          ticks: {
            color: chartColors.text,
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
            color: chartColors.text,
            padding: 20,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: chartColors.tooltip.background,
          titleColor: chartColors.tooltip.text,
          bodyColor: chartColors.tooltip.text,
          borderColor: chartColors.tooltip.border,
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
    }),
    [formatYAxisValue, chartColors]
  );

  return (
    <div className="line-chart-container">
      {prices?.length > 0 ? (
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
