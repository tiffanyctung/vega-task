module.exports = (req, res, next) => {
  if (req.method === "GET" && req.path === "/assets") {
    next();
    return;
  }

  if (req.method === "GET" && req.path.startsWith("/prices")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const asset = url.searchParams.get("asset");
    const asOf = url.searchParams.get("asOf");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    const db = req.app.db;
    let prices = db.data.prices;

    if (asset) {
      const assetArray = asset.split(",");
      prices = prices.filter((price) => assetArray.includes(price.asset));
    }

    if (asOf) {
      prices = prices.filter((price) => price.asOf === asOf);
    }

    if (from && to) {
      prices = prices.filter((price) => {
        const priceDate = new Date(price.asOf);
        const fromDate = new Date(from);
        const toDate = new Date(to);
        return priceDate >= fromDate && priceDate <= toDate;
      });
    }

    res.json(prices);
    return;
  }

  if (req.method === "GET" && req.path.startsWith("/portfolios")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const asOf = url.searchParams.get("asOf");

    const db = req.app.db;
    let portfolios = db.data.portfolios;

    if (asOf) {
      portfolios = portfolios.filter((portfolio) => {
        const portfolioDate = new Date(portfolio.asOf)
          .toISOString()
          .split("T")[0];
        const requestDate = new Date(asOf).toISOString().split("T")[0];
        return portfolioDate === requestDate;
      });
    }

    if (portfolios.length === 0) {
      portfolios = [db.data.portfolios[0]];
    }

    const portfolio = portfolios[0];
    const positions = portfolio.positions
      .map((positionId) => db.data.positions.find((p) => p.id === positionId))
      .filter(Boolean);

    const enrichedPositions = positions.map((position) => {
      const asset = db.data.assets.find((a) => a.id === position.asset);
      const price = db.data.prices.find(
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

    res.json(response);
    return;
  }

  next();
};
