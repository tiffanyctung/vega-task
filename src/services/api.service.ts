import axios from "axios";

const API_URL = "http://localhost:3001";

export interface Asset {
  id: string;
  name: string;
  type: string;
}

export interface Price {
  id: string;
  asset: string;
  price: number;
  asOf: string;
}

export interface Position {
  id: string;
  asset: string;
  quantity: number;
  asOf: string;
  price: number;
}

export interface Portfolio {
  id: string;
  asOf: string;
  positions: Position[];
}

export const getAssets = async (): Promise<Asset[]> => {
  const response = await axios.get(`${API_URL}/assets`);
  return response.data;
};

export const getPrices = async (
  assets?: string[],
  asOf?: string,
  from?: string,
  to?: string
): Promise<Price[]> => {
  const response = await axios.get(`${API_URL}/prices`);
  let prices = response.data;

  if (assets && assets.length > 0) {
    prices = prices.filter((price: Price) => assets.includes(price.asset));
  }

  if (asOf) {
    prices = prices.filter((price: Price) => price.asOf === asOf);
  }

  if (from && to) {
    prices = prices.filter((price: Price) => {
      const priceDate = new Date(price.asOf);
      const fromDate = new Date(from);
      const toDate = new Date(to);
      return priceDate >= fromDate && priceDate <= toDate;
    });
  }

  return prices;
};

export const getPortfolio = async (asOf?: string): Promise<Portfolio> => {
  const response = await axios.get(`${API_URL}/portfolios`);
  const portfolios = response.data;

  if (asOf && portfolios.length > 0) {
    const matchingPortfolios = portfolios.filter((portfolio: Portfolio) => {
      const portfolioDate = new Date(portfolio.asOf)
        .toISOString()
        .split("T")[0];
      const requestDate = new Date(asOf).toISOString().split("T")[0];
      return portfolioDate === requestDate;
    });

    if (matchingPortfolios.length > 0) {
      return matchingPortfolios[0];
    }
  }

  return portfolios[0];
};
