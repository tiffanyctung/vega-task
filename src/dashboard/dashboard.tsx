import React, { useEffect, useState } from "react";
import {
  getAssets,
  getPrices,
  getPortfolio,
  Asset,
  Price,
  Portfolio,
} from "../services/api.service";
import DoughnutChart from "./doughnut-chart/doughnut-chart";
import LineChart from "./line-chart/line-chart";
import "./dashboard.scss";

interface DashboardProps {
  loggedInUser?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ loggedInUser }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [selectedAssetType, setSelectedAssetType] = useState<string>("");
  const [timeRange, setTimeRange] = useState<string>("1M");

  useEffect(() => {
    const fetchData = async () => {
      const assetsData = await getAssets();
      setAssets(assetsData);

      setSelectedAssetType("");

      if (assetsData.length > 0) {
        setSelectedAsset(assetsData[0].name);
      }

      const portfolioData = await getPortfolio();
      setPortfolio(portfolioData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPortfolioHistory = async () => {
      if (!assets || assets.length === 0) return;

      try {
        const endDate = new Date("2023-07-29");
        const startDate = new Date("2023-07-29");

        switch (timeRange) {
          case "1W":
            startDate.setDate(endDate.getDate() - 7);
            break;
          case "1M":
            startDate.setMonth(endDate.getMonth() - 1);
            break;
          case "3M":
            startDate.setMonth(endDate.getMonth() - 3);
            break;
          case "6M":
            startDate.setMonth(endDate.getMonth() - 6);
            break;
          case "1Y":
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
          default:
            startDate.setMonth(endDate.getMonth() - 1);
        }

        const from = startDate.toISOString().split("T")[0];
        const to = endDate.toISOString().split("T")[0];

        console.log(`Fetching prices for all assets from ${from} to ${to}`);

        const assetNames = assets.map((asset) => asset.name);

        const allPricesData = await getPrices(assetNames, undefined, from, to);
        console.log(`Received ${allPricesData.length} total price data points`);
        const portfolioByDate: {
          [date: string]: { date: string; totalValue: number };
        } = {};

        const pricesByDate: { [date: string]: { [asset: string]: number } } =
          {};

        allPricesData.forEach((price) => {
          const date = price.asOf.split("T")[0];
          if (!pricesByDate[date]) {
            pricesByDate[date] = {};
          }
          pricesByDate[date][price.asset] = price.price;
        });

        Object.keys(pricesByDate).forEach((date) => {
          let totalValue = 0;

          if (portfolio) {
            portfolio.positions.forEach((position) => {
              const asset = assets.find((a) => a.id === position.asset);
              if (asset && pricesByDate[date][asset.name]) {
                const price = pricesByDate[date][asset.name];
                totalValue += position.quantity * price;
              }
            });
          }

          portfolioByDate[date] = {
            date,
            totalValue,
          };
        });

        const portfolioHistory = Object.values(portfolioByDate).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const formattedHistory: Price[] = portfolioHistory.map((item) => ({
          id: `portfolio-${item.date}`,
          asset: "Portfolio",
          price: item.totalValue,
          asOf: `${item.date}T00:00:00Z`,
        }));

        setPrices(formattedHistory);
      } catch (error) {
        console.error("Error fetching portfolio history:", error);
        setPrices([]);
      }
    };

    fetchPortfolioHistory();
  }, [assets, portfolio, timeRange]);

  const handleAssetChange = (asset: string) => {
    setSelectedAsset(asset);
    console.log(`Selected asset: ${asset}`);
    const assetType = assets.find((a) => a.name === asset)?.type || "";
    setSelectedAssetType(assetType);
  };

  const handleAssetTypeChange = (type: string) => {
    setSelectedAssetType(type);

    if (type === "") {
      if (assets.length > 0) {
        setSelectedAsset(assets[0].name);
      }
    } else if (type === "all") {
      setSelectedAssetType("all");
      setSelectedAssetType("all");
      if (assets.length > 0) {
        setSelectedAsset(assets[0].name);
      }
    } else {
      const assetsOfType = assets.filter((a) => a.type === type);
      if (assetsOfType.length > 0) {
        setSelectedAsset(assetsOfType[0].name);
      }
    }
  };

  if (!portfolio) {
    return (
      <div className="dashboard">
        <h1>{loggedInUser ? `${loggedInUser}'s Portfolio` : ""}</h1>
        <div className="loading-state">
          <div className="spinner"></div>
          <div>Loading portfolio data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>{loggedInUser ? `${loggedInUser}'s Dashboard` : ""}</h1>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Portfolio Allocation</h3>
          <div className="filter-buttons">
            <button
              className={selectedAssetType === "" ? "active" : ""}
              onClick={() => handleAssetTypeChange("")}
            >
              By Asset Class
            </button>
            <button
              className={selectedAssetType === "all" ? "active" : ""}
              onClick={() => handleAssetTypeChange("all")}
            >
              By Assets
            </button>
          </div>
          {selectedAsset &&
            selectedAssetType !== "" &&
            selectedAssetType !== "all" && (
              <div className="selected-asset-info">
                Selected: {selectedAsset}
              </div>
            )}
          <DoughnutChart
            portfolio={portfolio}
            assets={assets}
            selectedAssetType={selectedAssetType}
            onAssetSelect={handleAssetChange}
          />
        </div>

        <div className="chart-card">
          <h3>Portfolio Value History</h3>
          <div className="time-range-filter">
            <button
              className={timeRange === "1W" ? "active" : ""}
              onClick={() => setTimeRange("1W")}
            >
              1W
            </button>
            <button
              className={timeRange === "1M" ? "active" : ""}
              onClick={() => setTimeRange("1M")}
            >
              1M
            </button>
            <button
              className={timeRange === "3M" ? "active" : ""}
              onClick={() => setTimeRange("3M")}
            >
              3M
            </button>
            <button
              className={timeRange === "6M" ? "active" : ""}
              onClick={() => setTimeRange("6M")}
            >
              6M
            </button>
            <button
              className={timeRange === "1Y" ? "active" : ""}
              onClick={() => setTimeRange("1Y")}
            >
              1Y
            </button>
          </div>
          <LineChart prices={prices} />
        </div>
      </div>

      <div className="chart-card positions-table">
        <h3>Portfolio Summary</h3>
        <div className="as-of">
          As of: {new Date(portfolio.asOf).toLocaleDateString()}
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price (USD)</th>
                <th>Value (USD)</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.positions.map((position) => {
                const asset = assets.find((a) => a.id === position.asset);
                return (
                  <tr key={position.id}>
                    <td>{asset?.name || "Unknown"}</td>
                    <td>{asset?.type || "Unknown"}</td>
                    <td>{position.quantity}</td>
                    <td>${position.price.toFixed(2)}</td>
                    <td>${(position.quantity * position.price).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="portfolio-summary">
          <div className="total-value">
            <span>Total Portfolio Value:</span>
            <span className="value">
              $
              {portfolio.positions
                .reduce((sum, pos) => sum + pos.quantity * pos.price, 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
