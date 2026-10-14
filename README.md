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
| _TBD_ | _TBD_ | _TBD_ |
| Rangio Nachlieli | _TBD_ | _TBD_ |
| Ivan Zirlinger | _TBD_ | _TBD_ |
| Hadar Lavinsky | _TBD_ | _TBD_ |

## Services

| Service | Official MCP server | Local data folder |
|---|---|---|
| Gmail | Google's Gmail MCP (`gmailmcp.googleapis.com`), via Claude's Gmail connector ([why](docs/mcp-setup.md#gmail---claudes-gmail-connector-googles-official-gmail-mcp-server)) | `dataExports/gmail/` |
| GitHub | [github/github-mcp-server](https://github.com/github/github-mcp-server) (remote) | `dataExports/github/` |
| Notion | [Notion MCP](https://developers.notion.com/docs/mcp) (`mcp.notion.com`) | `dataExports/notion/` |
| _TBD_ | _TBD_ | _TBD_ |
| _TBD_ | _TBD_ | _TBD_ |
| _TBD_ | _TBD_ | _TBD_ |
| _TBD_ | _TBD_ | _TBD_ |

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
├── docs/                    # Setup guides
└── presentation/            # PowerPoint and demo video
```

## Setup

1. Install [Claude Code](https://code.claude.com/docs).
2. Connect the MCP servers with the test accounts: see [docs/mcp-setup.md](docs/mcp-setup.md).

## Downloading data

_TBD - describe how to use the download skill in `.claude/skills/`._

## Running the dashboard

_TBD - prerequisites and the command to start the dashboard locally._

## Presentation and demo video

See [`presentation/`](presentation/). GitHub rejects files larger than 100 MB, so the
video must stay under that size (or be linked instead of committed).

## Security

- Passwords, API keys, tokens, and OAuth secrets are kept out of the repository
  (see `.gitignore`).
- `.mcp.json` only references environment variables such as `${GITHUB_PAT}`; the real
  values are set locally on each machine.
