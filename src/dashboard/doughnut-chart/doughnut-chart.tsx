import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Portfolio, Asset } from "../../services/api.service";
import "./doughnut-chart.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  portfolio: Portfolio;
  assets: Asset[];
  selectedAssetType: string;
  onAssetSelect: (asset: string) => void;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  portfolio,
  assets,
  selectedAssetType,
  onAssetSelect,
}) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!portfolio || !assets.length) return;

    const labels: string[] = [];
    const values: number[] = [];
    const backgroundColors: string[] = [];

    if (selectedAssetType === "") {
      const assetTypeValues: Record<string, number> = {};

      portfolio.positions.forEach((position) => {
        const asset = assets.find((a) => a.id === position.asset);
        if (asset) {
          const value = position.quantity * position.price;
          const assetType = asset.type;

          if (assetTypeValues[assetType]) {
            assetTypeValues[assetType] += value;
          } else {
            assetTypeValues[assetType] = value;
          }
        }
      });

      Object.keys(assetTypeValues).forEach((assetType) => {
        labels.push(assetType.charAt(0).toUpperCase() + assetType.slice(1));
        values.push(assetTypeValues[assetType]);
        switch (assetType) {
          case "stock":
            backgroundColors.push("rgba(54, 162, 235, 0.8)");
            break;
          case "crypto":
            backgroundColors.push("rgba(255, 206, 86, 0.8)");
            break;
          case "fiat":
            backgroundColors.push("rgba(75, 192, 192, 0.8)");
            break;
          default:
            backgroundColors.push("rgba(153, 102, 255, 0.8)");
        }
      });
    } else if (selectedAssetType === "all") {
      portfolio.positions.forEach((position) => {
        const asset = assets.find((a) => a.id === position.asset);
        if (asset) {
          const value = position.quantity * position.price;
          labels.push(asset.name);
          values.push(value);

          switch (asset.type) {
            case "stock":
              backgroundColors.push("rgba(54, 162, 235, 0.8)");
              break;
            case "crypto":
              backgroundColors.push("rgba(255, 206, 86, 0.8)");
              break;
            case "fiat":
              backgroundColors.push("rgba(75, 192, 192, 0.8)");
              break;
            default:
              backgroundColors.push("rgba(153, 102, 255, 0.8)");
          }
        }
      });
    } else {
      const filteredPositions = portfolio.positions.filter((position) => {
        const asset = assets.find((a) => a.id === position.asset);
        return asset?.type === selectedAssetType;
      });

      filteredPositions.forEach((position) => {
        const asset = assets.find((a) => a.id === position.asset);
        if (asset) {
          const value = position.quantity * position.price;
          labels.push(asset.name);
          values.push(value);

          switch (asset.type) {
            case "stock":
              backgroundColors.push("rgba(54, 162, 235, 0.8)");
              break;
            case "crypto":
              backgroundColors.push("rgba(255, 206, 86, 0.8)");
              break;
            case "fiat":
              backgroundColors.push("rgba(75, 192, 192, 0.8)");
              break;
            default:
              backgroundColors.push("rgba(153, 102, 255, 0.8)");
          }
        }
      });
    }

    setChartData({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map((color) =>
            color.replace("0.8", "1")
          ),
          borderWidth: 1,
        },
      ],
    });
  }, [portfolio, assets, selectedAssetType]);

  const handleChartClick = (event: any, elements: any) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const clickedLabel = chartData.labels[index];

      if (selectedAssetType === "") {
        const assetType = clickedLabel.toLowerCase();
        const assetOfType = assets.find((asset) => asset.type === assetType);
        if (assetOfType) {
          onAssetSelect(assetOfType.name);
        }
      } else {
        onAssetSelect(clickedLabel);
      }
    }
  };

  return (
    <div className="doughnut-chart-container">
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          onClick: handleChartClick,
          plugins: {
            legend: {
              position: "right",
              labels: {
                boxWidth: 12,
                padding: 15,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.raw as number;
                  return `$${value.toFixed(2)}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default DoughnutChart;
