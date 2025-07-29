const { spawn } = require("child_process");
const path = require("path");
const net = require("net");

const dbPath = path.join(__dirname, "db.json");
const PORT = 3001;

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(false);
      } else {
        resolve(true);
      }
    });

    server.once("listening", () => {
      server.close(() => {
        resolve(true);
      });
    });

    server.listen(port);
  });
}

async function startServer() {
  const portAvailable = await isPortAvailable(PORT);

  if (!portAvailable) {
    console.log(
      `Port ${PORT} is already in use. The server is likely already running.`
    );
    console.log(`You can access the API at http://localhost:${PORT}`);
    console.log(
      "To stop the existing server, you may need to find and terminate the process."
    );
    process.exit(0);
  }

  const args = ["json-server", dbPath, "--port", PORT.toString()];

  console.log("Starting json-server with the following configuration:");
  console.log(`Database: ${dbPath}`);
  console.log(`Port: ${PORT}`);
  console.log(`Command: npx ${args.join(" ")}`);
  console.log(
    "Note: Custom middleware functionality is built into the mock API"
  );

  const server = spawn("npx", args, { stdio: "inherit" });

  server.on("error", (err) => {
    console.error("Failed to start json-server:", err);
    process.exit(1);
  });

  server.on("close", (code) => {
    console.log(`json-server exited with code ${code}`);
  });

  process.on("SIGINT", () => {
    console.log("Stopping json-server...");
    server.kill("SIGINT");
  });

  process.on("SIGTERM", () => {
    console.log("Stopping json-server...");
    server.kill("SIGTERM");
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
