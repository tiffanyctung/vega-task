import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartEvent,
  ActiveElement,
} from "chart.js";
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

interface ChartDataset {
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}

interface ChartDataType {
  labels: string[];
  datasets: ChartDataset[];
}

const chartColorsMap: Record<string, string> = {
  stock: "rgba(205, 146, 79, 0.8)",
  crypto: "rgba(239, 197, 114, 0.8)",
  fiat: "rgba(113, 68, 0, 0.8)",
  default: "rgba(135, 135, 135, 0.8)",
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" as const,
      labels: {
        boxWidth: 12,
        padding: 15,
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const value = context.raw as number;
          return `$${value.toFixed(2)}`;
        },
      },
    },
  },
};

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  portfolio,
  assets,
  selectedAssetType,
  onAssetSelect,
}) => {
  const [chartData, setChartData] = useState<ChartDataType>({
    labels: [],
    datasets: [],
  });

  const getBgColor = useCallback((assetType: string): string => {
    return chartColorsMap[assetType] || chartColorsMap.default;
  }, []);

  const assetMap = useMemo(() => {
    return assets.reduce<Record<string, Asset>>((map, asset) => {
      map[asset.id] = asset;
      return map;
    }, {});
  }, [assets]);

  useEffect(() => {
    if (!portfolio || !assets.length) return;

    const labels: string[] = [];
    const values: number[] = [];
    const backgroundColors: string[] = [];

    if (selectedAssetType === "") {
      const assetTypeValues = portfolio.positions.reduce<
        Record<string, number>
      >((acc, position) => {
        const asset = assetMap[position.asset];
        if (asset) {
          const value = position.quantity * position.price;
          acc[asset.type] = (acc[asset.type] || 0) + value;
        }
        return acc;
      }, {});

      Object.entries(assetTypeValues).forEach(([assetType, value]) => {
        labels.push(assetType.charAt(0).toUpperCase() + assetType.slice(1));
        values.push(value);
        backgroundColors.push(getBgColor(assetType));
      });
    } else {
      const filteredPositions =
        selectedAssetType === "all"
          ? portfolio.positions
          : portfolio.positions.filter((position) => {
              const asset = assetMap[position.asset];
              return asset?.type === selectedAssetType;
            });

      filteredPositions.forEach((position) => {
        const asset = assetMap[position.asset];
        if (asset) {
          const value = position.quantity * position.price;
          labels.push(asset.name);
          values.push(value);
          backgroundColors.push(getBgColor(asset.type));
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
  }, [portfolio, assets, selectedAssetType, assetMap, getBgColor]);

  const handleChartClick = useCallback(
    (_event: ChartEvent, elements: ActiveElement[]) => {
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
    },
    [chartData.labels, selectedAssetType, assets, onAssetSelect]
  );

  const options = useMemo(() => {
    return {
      ...chartOptions,
      onClick: handleChartClick,
    };
  }, [handleChartClick]);

  return (
    <div className="doughnut-chart-container">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
