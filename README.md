# Third-Party Services Dashboard

A class project that connects **Claude Code** to several cloud services through their
**official MCP servers**, downloads test data from each service into local files with a
documented format, and shows that data in a **local dashboard website** that can search
across all services at once.

> All accounts used here are throwaway **test accounts** created for this project.
> No personal data, passwords, or tokens are stored in this repository.

## Team

| Member | Core responsibility | Extra service |
|---|---|---|
| Franco Busso | Test accounts, MCP setup, test data | Google Calendar |
| Rangio Nachlieli | Dashboard website | Linear |
| Ivan Zirlinger | PowerPoint | Todoist |
| Hadar Lavinsky | Demo video and final README | ClickUp |

## Services

| Service | Official MCP server | Local data folder |
|---|---|---|
| Gmail | Google's Gmail MCP (`gmailmcp.googleapis.com`), via Claude's Gmail connector ([why](docs/mcp-setup.md#gmail---claudes-gmail-connector-googles-official-gmail-mcp-server)) | `dataExports/gmail/` |
| GitHub | [github/github-mcp-server](https://github.com/github/github-mcp-server) (remote) | `dataExports/github/` |
| Notion | [Notion MCP](https://developers.notion.com/docs/mcp) (`mcp.notion.com`) | `dataExports/notion/` |
| Google Calendar | Google's Calendar MCP (`calendarmcp.googleapis.com`), via Claude's Google Calendar connector ([setup](docs/mcp-setup.md#google-calendar---claudes-google-calendar-connector-googles-official-calendar-mcp-server)) | `dataExports/googleCalendar/` |
| Todoist | [Doist's Todoist MCP](https://ai.todoist.net/mcp) ([setup](docs/mcp-setup.md#todoist---doists-official-todoist-mcp-server)) | `dataExports/todoist/` |
| Linear | [Linear's MCP server](https://linear.app/docs/mcp) (`mcp.linear.app`) ([setup](docs/mcp-setup.md#linear---linears-official-mcp-server-mcplinearapp)) | `dataExports/linear/` |
| ClickUp | [ClickUp's MCP server](https://developer.clickup.com/docs/connect-an-ai-assistant-to-clickups-mcp-server) (`mcp.clickup.com`) ([setup](docs/mcp-setup.md#clickup---clickups-official-mcp-server-mcpclickupcom)) | `dataExports/clickUp/` |

## Repository structure

```
.
├── .claude/skills/          # Claude Code skill(s) for downloading data
├── .mcp.json                # MCP server configuration (no secrets - uses env vars / OAuth)
├── .env.example             # Names of the environment variables you need to set
├── CLAUDE.md                # Project rules for Claude Code
├── dataExports/             # Downloaded data, one subfolder per service
├── localStorageFormats.md   # Documentation of the local storage format for each service
├── dashboard/               # Local dashboard website
├── docs/                    # Setup guides and team task lists (docs/team-tasks/)
└── presentation/            # PowerPoint and demo video
```

## Setup

1. Install [Claude Code](https://code.claude.com/docs).
2. Connect the MCP servers with the test accounts: see [docs/mcp-setup.md](docs/mcp-setup.md).

## Downloading data

_TBD - describe how to use the download skill in `.claude/skills/`._

## Running the dashboard

The dashboard is a small local website in [`dashboard/`](dashboard/). It reads **only**
the JSON files in `dataExports/` (no database, no accounts, no internet needed).

**What to install:** [Node.js](https://nodejs.org/) 18 or newer. Nothing else - there are
no packages to install (no `npm install`).

**Start it** from the repository root:

```bash
node dashboard/server.js
```

Then open <http://localhost:3000> in your browser. Stop it with `Ctrl+C`.
To use another port, set the `PORT` environment variable (for example `PORT=8080`).

**How to use it:**

- Type in the search box to find any text in titles, content, and (optionally) metadata
  such as recipients, labels, or assignees. The search ignores upper/lower case and
  accents (`tomas` finds `Tomás`). Several words must all match; use `"quotes"` for an
  exact phrase.
- Pick one service in the drop-down (or click its chip) to see only its items, or leave
  **All services** to search everything at once. Each chip shows how many results that
  service has.
- Every result shows a colored badge with the service it comes from, its type and date,
  the matching text highlighted, and a link to the original item. **Show full content**
  opens the whole text and all metadata.
- The search is saved in the address bar (for example
  `http://localhost:3000/?q=Daniel&service=github`), so a search can be bookmarked.

**New services appear automatically.** The server reads every folder inside
`dataExports/` each time the page loads, so after a new service is downloaded (for
example `dataExports/linear/`), just refresh the page. Files must follow
[`localStorageFormats.md`](localStorageFormats.md); a file that is not valid JSON is
skipped and named in the server console.

## Presentation and demo video

See [`presentation/`](presentation/). GitHub rejects files larger than 100 MB, so the
video must stay under that size (or be linked instead of committed).

## Security

- Passwords, API keys, tokens, and OAuth secrets are kept out of the repository
  (see `.gitignore`).
- `.mcp.json` only references environment variables such as `${GITHUB_PAT}`; the real
  values are set locally on each machine.
