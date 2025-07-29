import { createServer } from "json-server";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import middleware from "./middleware-esm.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = createServer();
server.app.use(middleware);

const routesPath = join(__dirname, "routes.json");
const routes = JSON.parse(readFileSync(routesPath, "utf8"));

const dbPath = join(__dirname, "db.json");

server.db(dbPath);
server.rewriter(routes);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
  console.log(`Using database: ${dbPath}`);
  console.log(`Using routes: ${routesPath}`);
  console.log("Using custom middleware");
});
