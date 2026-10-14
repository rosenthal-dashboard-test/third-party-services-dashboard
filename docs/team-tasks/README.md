# Team tasks

How we split the remaining work. Each team member has a file with step-by-step
instructions, written so that **Claude Code can read it and guide you**.

## How to use your file

1. **Get the repo (first time only).** Open the Claude desktop app, go to the **Code**
   tab, pick any folder (for example `Documents`), and send:
   > Clone https://github.com/rosenthal-dashboard-test/third-party-services-dashboard into this folder.
2. **Start a new Code session inside the cloned folder** (`third-party-services-dashboard`).
   This matters: only then does Claude load the project rules (`CLAUDE.md`) and the MCP
   servers (`.mcp.json`). Then send:
   > Read docs/team-tasks/YOUR-NAME.md and guide me step by step, one step at a time.
3. When your file says to start a **new conversation**, run `/clear` (or open a new
   session in the same folder) and send the prompt your file gives for that part.

## Who does what

| Person | Extra service | Main task | File |
|---|---|---|---|
| Franco Busso | Google Calendar (done) | Test accounts and test data (done); download all services, `localStorageFormats.md`, download skill | [franco.md](franco.md) |
| Rangio Nachlieli | Linear (suggested) | Dashboard website | [rangio.md](rangio.md) |
| Ivan Zirlinger | Todoist (suggested) | PowerPoint | [ivan.md](ivan.md) |
| Hadar Lavinsky | ClickUp (suggested) | Demo video and final README | [hadar.md](hadar.md) |

## Order of work

1. **Everyone:** connect your extra service, document it, and fill it with at least 10
   test items. Tell Franco when it's done.
2. **Franco:** connects every service on his computer, downloads the data into
   `dataExports/`, writes `localStorageFormats.md` and the download skill, pushes, and
   tells the team.
3. **Rangio:** builds the dashboard from `dataExports/`, pushes, and tells the team.
4. **Ivan:** takes the dashboard screenshots and finishes the PowerPoint.
   **Hadar:** records the demo video and finishes the README.
5. **Franco:** final check against the deliverables list below, then submits the repo URL.

## Rules for everyone

- **The repo is public.** Never put passwords, tokens, or personal data in any file,
  commit, or chat with Claude. Franco shares the test Google account password
  privately; you type it yourself in the browser. GitHub (and the extra services) are
  logged in with **Continue with Google** using that same test account.
- Use only the **test accounts**, in a **separate Chrome profile** (for example
  "AI-Class-Test"), never your personal accounts. Turn off any Claude connectors linked
  to your personal accounts.
- Only **official** MCP servers, maintained by the service's own company.
- **Git identity:** before your first commit, set this repo's identity to the test
  account so your personal email never appears in the public history:
  ```bash
  git config user.name "rosenthal-dashboard-test"
  git config user.email "342177614+rosenthal-dashboard-test@users.noreply.github.com"
  ```
- **Pushing:** you need a token for the test GitHub account in the `GITHUB_PAT`
  environment variable (see [GitHub setup](../mcp-setup.md#github---githubgithub-mcp-server-remote)).
  Push without saving the token in git's config:
  ```bash
  git -c http.extraheader="AUTHORIZATION: basic $(printf 'x-access-token:%s' "$GITHUB_PAT" | base64 -w0)" push
  ```
- Run `git pull` before you start working and again before you push. Stick to your
  own files to avoid conflicts.

## Known problems and fixes

- **Google connectors (Gmail, Calendar)** belong to a Claude account and may already be
  linked to your personal Google account. Always ask Claude to list the calendars or
  recent emails first and check that the address is the test one.
- In **auto** permission mode, Claude Code may block reading emails. Switch to a mode
  that asks before each action and approve the call yourself.
- Creating GitHub issues through the GitHub MCP opens a form that fails in the desktop
  app ("IPC not available"). Use the `gh` CLI with `GH_TOKEN=$GITHUB_PAT` instead.

## Deliverables checklist (from the assignment)

- [ ] (a) `dataExports/` with the downloaded data (at least 5 items per service)
- [ ] (b) `.claude/` folder with the download skill
- [ ] (c) `.mcp.json` with every MCP server
- [ ] (d) Dashboard code + how to run it in the README
- [ ] (e)(g) PowerPoint, with a screenshot of the original test content and of the same content in the dashboard, for every service
- [ ] (e)(h) Demo video, 3 minutes or less
- [ ] (f) Root README that explains the project to someone who has never heard of it
- [ ] `localStorageFormats.md` documenting the storage format of every service
- [ ] Write-up of what each student did and their extra service
