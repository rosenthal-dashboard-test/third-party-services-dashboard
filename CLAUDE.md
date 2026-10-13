# Third-Party Services Dashboard - project rules

- This repository is PUBLIC. Never write passwords, API keys, tokens, OAuth client
  secrets, or personal data into any file. Secrets live only in environment
  variables (see `.env.example`) or in Claude Code's credential store.
- Use only the project MCP servers defined in `.mcp.json`, which are logged in to
  the TEST accounts. Do not use claude.ai connectors tied to anyone's personal
  account (personal Gmail, Notion, Calendar, etc.), even if they are available.
- Only official, vendor-maintained MCP servers may be added to this project.
- Downloaded data goes under `dataExports/<service>/`. Follow the formats in
  `localStorageFormats.md` and the download skill in `.claude/skills/` once they exist.
- The dashboard lives in `dashboard/` and reads only from `dataExports/`.
