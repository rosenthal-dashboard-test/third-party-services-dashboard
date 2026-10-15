// Dashboard front end. Gets every item from /api/items (which reads dataExports/),
// then filters, searches and renders in the browser.

// Nice names and colors for the services we know. Any other folder in dataExports/
// still works: its name is made readable ("myService" -> "My Service") and it gets
// a color from its name.
const KNOWN_SERVICES = {
  gmail: { label: "Gmail", color: "#c5221f" },
  github: { label: "GitHub", color: "#4b535d" },
  notion: { label: "Notion", color: "#5f5e5b" },
  googleCalendar: { label: "Google Calendar", color: "#1a73e8" },
  todoist: { label: "Todoist", color: "#c53727" },
  linear: { label: "Linear", color: "#5e6ad2" },
  clickUp: { label: "ClickUp", color: "#7b3fe4" },
};

const SNIPPET_LENGTH = 260;

const els = {
  summary: document.getElementById("summary"),
  query: document.getElementById("query"),
  service: document.getElementById("service"),
  inMetadata: document.getElementById("inMetadata"),
  chips: document.getElementById("chips"),
  status: document.getElementById("status"),
  results: document.getElementById("results"),
};

let items = [];
let services = [];

// ---------- helpers ----------

function serviceInfo(name) {
  if (KNOWN_SERVICES[name]) return KNOWN_SERVICES[name];
  const label = name
    .replace(/[-_]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
  return { label, color: `hsl(${hash} 55% 38%)` };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url) ? url : null;
}

// Turns the few Notion tags (see localStorageFormats.md) into readable text.
function cleanText(text) {
  return text
    .replace(/<mention-date\s+start="([^"]*)"(?:\s+end="([^"]*)")?[^>]*\/>/g, (_, s, e) => (e ? `${s} → ${e}` : s))
    .replace(/<page\s+url="[^"]*"[^>]*>([\s\S]*?)<\/page>/g, "$1")
    .replace(/<callout(?:\s+icon="([^"]*)")?[^>]*>/g, (_, icon) => (icon ? `${icon} ` : ""))
    .replace(/<\/callout>/g, "")
    .replace(/<mention-[a-z]+[^>]*>([\s\S]*?)<\/mention-[a-z]+>/g, "$1")
    .replace(/<mention-[a-z]+[^>]*\/>/g, "");
}

// Dates. "YYYY-MM-DD" is a whole day: show that day, never shift it by time zone.
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

function dateValue(s) {
  if (!s) return -Infinity;
  const m = DATE_ONLY.exec(s);
  const t = m ? new Date(+m[1], +m[2] - 1, +m[3]).getTime() : Date.parse(s);
  return Number.isNaN(t) ? -Infinity : t;
}

function formatDate(s) {
  if (!s) return "";
  const m = DATE_ONLY.exec(s);
  if (m) {
    return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString("en-US", { dateStyle: "medium" });
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

// Flattens metadata into "key: value" lines so it can be searched and shown.
function metadataLines(obj, prefix = "") {
  const lines = [];
  for (const [key, value] of Object.entries(obj || {})) {
    const name = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      lines.push(...metadataLines(value, name));
    } else if (Array.isArray(value)) {
      if (value.length) lines.push(`${name}: ${value.map((v) => (typeof v === "object" ? JSON.stringify(v) : v)).join(", ")}`);
    } else if (value !== null && value !== "") {
      lines.push(`${name}: ${value}`);
    }
  }
  return lines;
}

// Case- and accent-insensitive matching ("tomas" finds "Tomás").
// fold() returns the folded string plus, for each folded char, its index in the original.
function fold(s) {
  let out = "";
  const map = [];
  let i = 0;
  for (const ch of s) {
    const f = ch.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    for (let k = 0; k < f.length; k++) map.push(i);
    out += f;
    i += ch.length;
  }
  map.push(i);
  return { out, map };
}

function foldTerm(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Returns [start, end) ranges in the original string where any term matches.
function findRanges(str, terms) {
  if (!terms.length || !str) return [];
  const { out, map } = fold(str);
  const ranges = [];
  for (const term of terms) {
    let at = out.indexOf(term);
    while (at !== -1) {
      ranges.push([map[at], map[at + term.length]]);
      at = out.indexOf(term, at + term.length);
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push(r.slice());
  }
  return merged;
}

function highlight(str, ranges, from = 0, to = str.length) {
  let html = "";
  let pos = from;
  for (const [s, e] of ranges) {
    if (e <= from || s >= to) continue;
    const a = Math.max(s, from);
    const b = Math.min(e, to);
    html += escapeHtml(str.slice(pos, a)) + "<mark>" + escapeHtml(str.slice(a, b)) + "</mark>";
    pos = b;
  }
  return html + escapeHtml(str.slice(pos, to));
}

// ---------- search ----------

// Splits the query into terms. "Quoted phrases" stay together.
function parseQuery(q) {
  const terms = [];
  const re = /"([^"]+)"|(\S+)/g;
  let m;
  while ((m = re.exec(q))) terms.push(foldTerm(m[1] || m[2]));
  return terms.filter(Boolean);
}

function search() {
  const terms = parseQuery(els.query.value);
  const service = els.service.value;
  const inMetadata = els.inMetadata.checked;

  // Every term must appear somewhere in the item (title, text, or metadata).
  const matches = [];
  for (const item of items) {
    if (!terms.length) {
      matches.push({ item, score: 0 });
      continue;
    }
    const title = item._title;
    const text = item._text;
    const meta = inMetadata ? item._meta : "";
    let ok = true;
    let score = 0;
    for (const term of terms) {
      const inTitle = title.includes(term);
      const inText = text.includes(term);
      const inMeta = meta.includes(term);
      if (!inTitle && !inText && !inMeta) { ok = false; break; }
      score += (inTitle ? 3 : 0) + (inText ? 2 : 0) + (inMeta ? 1 : 0);
    }
    if (ok) matches.push({ item, score });
  }

  // Counts per service (before the service filter) for the chips.
  const counts = {};
  for (const { item } of matches) counts[item.service] = (counts[item.service] || 0) + 1;

  const shown = matches
    .filter(({ item }) => !service || item.service === service)
    .sort((a, b) => b.score - a.score || b.item._sort - a.item._sort);

  renderChips(counts, matches.length, service);
  renderResults(shown, terms, service);
  updateUrl();
}

// ---------- rendering ----------

function renderChips(counts, total, selected) {
  const chip = (name, label, count, color) =>
    `<button type="button" class="chip" data-service="${escapeHtml(name)}" aria-pressed="${selected === name}" style="--svc:${color}">` +
    (name ? `<span class="dot"></span>` : "") +
    `${escapeHtml(label)} <strong>${count}</strong></button>`;

  els.chips.innerHTML =
    chip("", "All services", total, "var(--accent)") +
    services.map((s) => { const info = serviceInfo(s.name); return chip(s.name, info.label, counts[s.name] || 0, info.color); }).join("");
}

function renderResults(shown, terms, service) {
  const where = service ? `in ${serviceInfo(service).label}` : "across all services";
  els.status.textContent = terms.length
    ? `${shown.length} result${shown.length === 1 ? "" : "s"} for “${els.query.value.trim()}” ${where}`
    : `Showing all ${shown.length} items ${where}, newest first`;

  els.results.innerHTML = shown.map(({ item }) => renderItem(item, terms)).join("");
}

function renderItem(item, terms) {
  const info = serviceInfo(item.service);
  const url = safeUrl(item.url);
  const text = item.displayText;

  const titleRanges = findRanges(item.title, terms);
  const textRanges = findRanges(text, terms);

  // Snippet: around the first match in the text, or the start of the text.
  let snippet = "";
  if (text) {
    let start = 0;
    if (textRanges.length) start = Math.max(0, textRanges[0][0] - 80);
    if (start > 0) {
      const space = text.indexOf(" ", start);
      if (space !== -1 && space < textRanges[0][0]) start = space + 1;
    }
    const end = Math.min(text.length, start + SNIPPET_LENGTH);
    snippet = (start > 0 ? "…" : "") + highlight(text, textRanges, start, end) + (end < text.length ? "…" : "");
  }

  // Which metadata fields matched, so a result found only through metadata makes sense.
  let matchedIn = "";
  if (terms.length && els.inMetadata.checked) {
    const fields = item.metaLines
      .filter((line) => terms.some((t) => foldTerm(line).includes(t)))
      .map((line) => line.split(":")[0]);
    if (fields.length) matchedIn = `<div class="matched-in">Also matches metadata: ${escapeHtml([...new Set(fields)].join(", "))}</div>`;
  }

  const metaHtml = item.metaLines
    .map((line) => {
      const i = line.indexOf(": ");
      const key = line.slice(0, i);
      const value = line.slice(i + 2);
      return `<dt>${escapeHtml(key)}</dt><dd>${highlight(value, findRanges(value, terms))}</dd>`;
    })
    .join("");

  const titleHtml = highlight(item.title, titleRanges);

  return `<li class="item" style="--svc:${info.color}">
    <div class="item-head">
      <span class="badge">${escapeHtml(info.label)}</span>
      ${item.type ? `<span>${escapeHtml(item.type)}</span>` : ""}
      ${item.date ? `<span>· ${escapeHtml(formatDate(item.date))}</span>` : ""}
    </div>
    <h2>${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${titleHtml}</a>` : titleHtml}</h2>
    ${snippet ? `<p class="snippet">${snippet}</p>` : `<p class="snippet muted">(no text)</p>`}
    ${matchedIn}
    <details>
      <summary>Show full content</summary>
      ${text ? `<div class="full">${highlight(text, textRanges)}</div>` : ""}
      <dl class="meta">
        <dt>service</dt><dd>${escapeHtml(item.service)}</dd>
        <dt>id</dt><dd>${escapeHtml(item.id)}</dd>
        ${metaHtml}
        <dt>file</dt><dd>dataExports/${escapeHtml(item.file)}</dd>
      </dl>
    </details>
  </li>`;
}

function renderServiceOptions() {
  els.service.innerHTML =
    `<option value="">All services</option>` +
    services.map((s) => `<option value="${escapeHtml(s.name)}">${escapeHtml(serviceInfo(s.name).label)} (${s.count})</option>`).join("");
}

// ---------- URL state (so a search can be bookmarked or shared) ----------

function readUrl() {
  const params = new URLSearchParams(location.search);
  els.query.value = params.get("q") || "";
  const service = params.get("service") || "";
  if (services.some((s) => s.name === service)) els.service.value = service;
  if (params.get("metadata") === "0") els.inMetadata.checked = false;
}

function updateUrl() {
  const params = new URLSearchParams();
  if (els.query.value.trim()) params.set("q", els.query.value.trim());
  if (els.service.value) params.set("service", els.service.value);
  if (!els.inMetadata.checked) params.set("metadata", "0");
  const qs = params.toString();
  history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
}

// ---------- start ----------

async function start() {
  try {
    const res = await fetch("/api/items");
    if (!res.ok) throw new Error(`server answered ${res.status}`);
    const data = await res.json();
    services = data.services;
    items = data.items.map((item) => {
      const displayText = cleanText(item.text);
      const metaLines = metadataLines(item.metadata);
      return {
        ...item,
        displayText,
        metaLines,
        _title: foldTerm(item.title),
        _text: foldTerm(displayText),
        _meta: foldTerm(metaLines.join("\n")),
        _sort: dateValue(item.date),
      };
    });
    els.summary.textContent =
      `${items.length} items from ${services.length} services, read from dataExports/` +
      (data.warnings.length ? ` (${data.warnings.length} file(s) skipped, see the server console)` : "");
  } catch (err) {
    els.summary.textContent = `Could not load data: ${err.message}. Is the server running (node dashboard/server.js)?`;
    return;
  }

  renderServiceOptions();
  readUrl();
  search();

  let timer;
  els.query.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(search, 120); });
  els.service.addEventListener("change", search);
  els.inMetadata.addEventListener("change", search);
  els.chips.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    els.service.value = chip.dataset.service;
    search();
  });
}

start();
