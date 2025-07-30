import { getAssets, getPortfolio, getPrices } from "./api.service";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedAxios = require("axios").default as jest.Mocked<any>;

describe("API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAssets", () => {
    const mockAssetsResponse = [
      { id: "123", name: "AAPL", type: "stock" },
      { id: "456", name: "BTC", type: "crypto" },
    ];

    test("fetches assets successfully", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockAssetsResponse });

      const result = await getAssets();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:3001/assets"
      );
      expect(result).toEqual(mockAssetsResponse);
    });

    test("handles error when fetching assets fails", async () => {
      const errorMessage = "Network Error";
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(getAssets()).rejects.toThrow();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:3001/assets"
      );
    });
  });

  describe("getPortfolio", () => {
    const mockPortfolioResponse = {
      id: "portfolio-1",
      userId: "user-1",
      asOf: "2023-07-29T00:00:00Z",
      positions: [
        {
          id: "pos-1",
          asset: "123",
          quantity: 10,
          price: 180.95,
          asOf: "2023-07-29T00:00:00Z",
        },
      ],
    };

    test("fetches portfolio successfully", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockPortfolioResponse] });

      const result = await getPortfolio();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:3001/portfolios"
      );
      expect(result).toEqual(mockPortfolioResponse);
    });

    test("handles error when fetching portfolio fails", async () => {
      const errorMessage = "Network Error";
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(getPortfolio()).rejects.toThrow();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:3001/portfolios"
      );
    });
  });

  describe("getPrices", () => {
    const mockPricesResponse = [
      {
        id: "price-1",
        asset: "AAPL",
        price: 180.95,
        asOf: "2023-07-01T00:00:00Z",
      },
      {
        id: "price-2",
        asset: "AAPL",
        price: 185.5,
        asOf: "2023-07-29T00:00:00Z",
      },
    ];

    test("fetches prices successfully with all parameters", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockPricesResponse });

      const assets = ["AAPL"];
      const asOf = "2023-07-29T00:00:00Z";
      const from = "2023-07-01";
      const to = "2023-07-29";

      const expectedResult = [mockPricesResponse[1]];

      const result = await getPrices(assets, asOf, from, to);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:3001/prices"
      );
      expect(result).toEqual(expectedResult);
    });

    test("fetches prices with only assets parameter", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockPricesResponse });

      const assets = ["AAPL"];

      const result = await getPrices(assets);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:3001/prices"
      );
      expect(result).toEqual(mockPricesResponse);
    });

    test("handles error when fetching prices fails", async () => {
      const errorMessage = "Network Error";
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      const assets = ["AAPL"];

      await expect(getPrices(assets)).rejects.toThrow();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:3001/prices"
      );
    });
  });
});
