# Third-Party Services Dashboard

A class project that connects **Claude Code** to several cloud services through their
**official MCP servers**, downloads test data from each service into local files with a
documented format, and shows that data in a **local dashboard website** that can search
across all services at once.

> All accounts used here are throwaway **test accounts** created for this project.
> No personal data, passwords, or tokens are stored in this repository.

## How it works

The project has three parts, and each one only talks to the next:

1. **Cloud services with test data.** Seven services (Gmail, GitHub, Notion, Google
   Calendar, Todoist, Linear, ClickUp) hold made-up data about "Pairly", a fictional
   startup that matches university students into study groups. Each service is
   logged in with the same test Google account.
2. **Downloading with Claude Code.** Claude Code connects to each service through the
   service's own **official MCP server** (listed in [`.mcp.json`](.mcp.json)). A project
   skill, [`download-service-data`](.claude/skills/download-service-data/SKILL.md), tells
   Claude how to fetch the items and save them as JSON files in `dataExports/<service>/`.
   The file format is documented in [`localStorageFormats.md`](localStorageFormats.md).
3. **The local dashboard.** A small website in [`dashboard/`](dashboard/) reads only the
   files in `dataExports/` and lets you search one service or all of them at once.
   It needs no internet and no accounts.

```
Cloud service ──(official MCP server)──> Claude Code + download skill
      ──> dataExports/<service>/*.json ──> local dashboard (search)
```

## Team

| Member | What they did | Extra service |
|---|---|---|
| Franco Busso | Test accounts and test data, MCP setup, downloaded every service, wrote `localStorageFormats.md` and the download skill | Google Calendar |
| Rangio Nachlieli | Dashboard website (`dashboard/`) | Linear |
| Ivan Zirlinger | PowerPoint (`presentation/`) | Todoist |
| Hadar Lavinsky | ClickUp setup and download, demo video, final README | ClickUp |

Each member also owns one extra service, with its own official MCP server, test data,
and setup notes in [docs/mcp-setup.md](docs/mcp-setup.md).

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

Data is downloaded by Claude Code with the project skill
[`download-service-data`](.claude/skills/download-service-data/SKILL.md) in
`.claude/skills/`. You don't run it as a command: you ask Claude in plain language and
it loads the skill by itself.

1. Open Claude Code **in the repository folder**, so it loads `CLAUDE.md`, `.mcp.json`
   and the skill. Make sure the MCP servers are logged in to the test accounts (see
   [Setup](#setup)).
2. Ask for what you need, for example:
   - *"Download the data from every service."*
   - *"Refresh the ClickUp data in dataExports/clickUp/."*
   - *"Download any new Linear issues."*
3. Claude then follows the skill:
   - checks that each service is logged in to the **test** account, and stops if not;
   - downloads only the project's test items (each service's filter is in the skill);
   - writes **one JSON file per item** in `dataExports/<service>/`, in the format of
     [`localStorageFormats.md`](localStorageFormats.md). Downloading an item again
     overwrites its file, so there are no duplicates;
   - runs the checker and reports how many items each service has.

You can also run the checker yourself at any time:

```bash
python3 -I .claude/skills/download-service-data/scripts/check_exports.py dataExports
```

**Adding a new service:** add its official MCP server to `.mcp.json`, log in, and ask
Claude to "add <service> to dataExports". The skill's "Adding a new service" section
explains how to choose the folder name and format, and asks Claude to document the
new service in `localStorageFormats.md` and add a recipe to the skill. The dashboard
shows the new folder automatically.

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

Everything is in [`presentation/`](presentation/):

| File | What it is |
|---|---|
| [`third-party-services-dashboard.pptx`](presentation/third-party-services-dashboard.pptx) | The PowerPoint presentation |
| [`demo-video.mp4`](presentation/demo-video.mp4) | Demo video (1:29) |
| [`demo-video-script.md`](presentation/demo-video-script.md) | Script used to record the video |
| [`demo-captions.html`](presentation/demo-captions.html) | Caption cards shown in the video (open in a browser, → for next) |
| [`screenshots/`](presentation/screenshots/) | Screenshots of the original test data in each service |

## Security

- Passwords, API keys, tokens, and OAuth secrets are kept out of the repository
  (see `.gitignore`).
- `.mcp.json` only references environment variables such as `${GITHUB_PAT}`; the real
  values are set locally on each machine.
