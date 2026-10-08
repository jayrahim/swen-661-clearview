const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

const DEFAULT_PORT = 4173;
const ROOT_DIRECTORY = path.resolve(__dirname, "..");
const ASSETS = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/renderer.js", "renderer.js"],
  ["/styles.css", "styles.css"],
]);
const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

function configuredPort() {
  const port = Number(process.env.PORT ?? DEFAULT_PORT);
  return Number.isInteger(port) && port > 0 && port <= 65535
    ? port
    : DEFAULT_PORT;
}

function serveRenderer(request, response) {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  const pathname = new URL(request.url, "http://localhost").pathname;
  const asset = ASSETS.get(pathname);
  if (!asset) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const filePath = path.join(ROOT_DIRECTORY, asset);
  const headers = {
    "Cache-Control": "no-store",
    "Content-Type": CONTENT_TYPES[path.extname(asset)],
  };
  response.writeHead(200, headers);
  if (request.method === "HEAD") {
    response.end();
    return;
  }

  fs.createReadStream(filePath)
    .on("error", () => {
      if (!response.headersSent) response.writeHead(500);
      response.end("Unable to read renderer asset");
    })
    .pipe(response);
}

const server = http.createServer(serveRenderer);
server.on("error", (error) => {
  console.error(`Unable to start renderer server: ${error.message}`);
  process.exitCode = 1;
});
server.listen(configuredPort(), "127.0.0.1", () => {
  console.log(`ClearView renderer available at http://127.0.0.1:${configuredPort()}`);
  console.log("Use Ctrl+C to stop the server.");
});
