const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get("/portfolios", (req, res) => {
  try {
    const { asOf } = req.query;
    const db = router.db.getState();

    const portfolio = db.portfolios.find((p) => {
      const portfolioDate = new Date(p.asOf);
      const queryDate = asOf ? new Date(asOf) : new Date();
      return portfolioDate <= queryDate;
    });

    if (!portfolio) {
      return res
        .status(404)
        .jsonp({ error: "No portfolio found for the specified date" });
    }

    const positions = portfolio.positions
      .map((positionId) => db.positions.find((p) => p.id === positionId))
      .filter(Boolean);

    const enrichedPositions = positions.map((position) => {
      const asset = db.assets.find((a) => a.id === position.asset);
      const price = db.prices.find(
        (p) =>
          p.asset === position.asset &&
          new Date(p.asOf) <= new Date(asOf || new Date().toISOString())
      );

      const value = position.quantity * (price ? price.price : 0);

      return {
        id: position.id,
        asset: position.asset,
        assetName: asset ? asset.name : "Unknown",
        assetType: asset ? asset.type : "unknown",
        quantity: position.quantity,
        price: price ? price.price : 0,
        value: value,
        asOf: position.asOf,
      };
    });

    const totalValue = enrichedPositions.reduce(
      (sum, pos) => sum + pos.value,
      0
    );

    const positionsWithWeights = enrichedPositions.map((pos) => ({
      ...pos,
      weight: totalValue > 0 ? (pos.value / totalValue) * 100 : 0,
    }));

    const response = {
      id: portfolio.id,
      asOf: asOf || portfolio.asOf,
      positions: positionsWithWeights,
      totalValue: Math.round(totalValue * 100) / 100,
    };

    res.jsonp(response);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).jsonp({ error: "Internal server error" });
  }
});

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
