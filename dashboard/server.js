// Local dashboard server. No dependencies: needs only Node.js 18+.
// Start from the repo root with:  node dashboard/server.js
//
// Every request to /api/items re-reads every folder inside dataExports/, so a new
// service folder (for example dataExports/linear/) shows up without code changes
// or a restart.

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const HOST = "127.0.0.1";
const DATA_DIR = path.resolve(__dirname, "..", "dataExports");
const PUBLIC_DIR = path.join(__dirname, "public");

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
};

// Reads every *.json file in every subfolder of dataExports/.
// A broken file is skipped with a warning instead of breaking the whole dashboard.
function loadItems() {
  const items = [];
  const services = [];
  const warnings = [];

  const folders = fs
    .readdirSync(DATA_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();

  for (const folder of folders) {
    const files = fs
      .readdirSync(path.join(DATA_DIR, folder))
      .filter((name) => name.toLowerCase().endsWith(".json"));
    let count = 0;

    for (const file of files) {
      const relPath = `${folder}/${file}`;
      try {
        const raw = fs.readFileSync(path.join(DATA_DIR, folder, file), "utf8");
        const item = JSON.parse(raw.replace(/^﻿/, ""));
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          throw new Error("not a JSON object");
        }
        items.push({
          service: folder, // the folder is the source of truth for the service
          type: item.type ?? null,
          id: item.id ?? file.replace(/\.json$/i, ""),
          title: item.title ?? "(no title)",
          date: item.date ?? null,
          url: item.url ?? null,
          text: typeof item.text === "string" ? item.text : "",
          downloadedAt: item.downloadedAt ?? null,
          metadata: item.metadata && typeof item.metadata === "object" ? item.metadata : {},
          file: relPath,
        });
        count++;
      } catch (err) {
        warnings.push(`${relPath}: ${err.message}`);
      }
    }
    services.push({ name: folder, count });
  }

  for (const warning of warnings) console.warn(`Skipped ${warning}`);
  return { services, items, warnings };
}

function send(res, status, body, type) {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host || HOST}`);

  if (pathname === "/api/items") {
    try {
      send(res, 200, JSON.stringify(loadItems()), "application/json; charset=utf-8");
    } catch (err) {
      send(res, 500, JSON.stringify({ error: err.message }), "application/json; charset=utf-8");
    }
    return;
  }

  // Static files from dashboard/public only.
  const relative = pathname === "/" ? "index.html" : decodeURIComponent(pathname).replace(/^\/+/, "");
  const filePath = path.resolve(PUBLIC_DIR, relative);
  if (!filePath.startsWith(PUBLIC_DIR + path.sep)) {
    send(res, 403, "Forbidden", "text/plain");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, "Not found", "text/plain");
      return;
    }
    send(res, 200, data, CONTENT_TYPES[path.extname(filePath)] || "application/octet-stream");
  });
});

server.listen(PORT, HOST, () => {
  const { services, items } = loadItems();
  console.log(`Reading ${items.length} items from ${services.length} services in ${DATA_DIR}`);
  for (const s of services) console.log(`  ${s.name}: ${s.count}`);
  console.log(`\nDashboard running at http://localhost:${PORT}  (Ctrl+C to stop)`);
});
