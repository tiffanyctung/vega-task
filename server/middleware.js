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

    let prices = res.locals.data.prices;

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

    let portfolios = res.locals.data.portfolios;

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
      portfolios = [res.locals.data.portfolios[0]];
    }

    res.json(portfolios[0]);
    return;
  }

  next();
};
