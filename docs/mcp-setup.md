# Connecting the MCP servers

Every server below is the **official** one maintained by the service vendor, and every
login uses the project's **test accounts**.

Tip: use a separate browser profile (or a private window) for the test accounts so the
OAuth logins don't pick up anyone's personal account by mistake.

After setting things up, start Claude Code in the repo folder and run `/mcp` to check
that every server shows as connected. The first time, Claude Code asks you to approve
the servers defined in `.mcp.json`.

## Before you start: turn off personal connectors

If your Claude account has connectors linked to your personal accounts (Gmail, Notion,
Google Calendar, ...), turn them off for this project's sessions. Otherwise Claude may
read from your personal account instead of the test account.

## GitHub - `github/github-mcp-server` (remote)

Already defined in `.mcp.json`. It authenticates with a personal access token that is
read from the `GITHUB_PAT` environment variable. Never paste the token into `.mcp.json`.

1. Log in to the **test** GitHub account (**Continue with Google** with the test Google
   account) and create a fine-grained token:
   *Settings > Developer settings > Personal access tokens > Fine-grained tokens*.
   - Repository access: all repositories of the test account.
   - Permissions: Administration, Contents, Issues, and Pull requests set to
     **Read and write** (needed to create the test repos); Metadata set to **Read**.
   - Expiration: long enough for the whole project (e.g. 90 days).
   - GitHub shows the token only once. If you lose it, open the token and use
     **Regenerate token**.
2. Save the token as a Windows user environment variable. This prompts for the token
   without echoing it or saving it in the shell history (paste with right-click or
   Ctrl+Shift+V; a valid token starts with `github_pat_` and is ~93 characters long):
   ```powershell
   [Environment]::SetEnvironmentVariable("GITHUB_PAT", [System.Net.NetworkCredential]::new("", (Read-Host "Paste the GitHub token" -AsSecureString)).Password, "User")
   ```
3. **Fully quit** the Claude desktop app and reopen it so it picks up the variable.
   Closing the window is not enough - the app keeps running in the system tray:
   right-click the Claude tray icon (next to the clock) and choose **Quit**.
   If you use Claude Code in a terminal instead, open a new terminal.

## Notion - Notion MCP (`mcp.notion.com`)

Already defined in `.mcp.json`. It uses OAuth, so there is no token to manage.

The OAuth login opens in your **default browser**, and the whole login must happen in
that same browser window (Notion keeps the login state in a cookie - copying the URL to
an incognito window fails with "Invalid MCP state"). So:

1. Open Chrome with a separate profile for the test accounts (profile icon > **Add** >
   **Continue without an account**) and log in to notion.so there with the test account.
2. Click that window so it is the last Chrome window you used - Chrome opens links from
   other apps in the most recently used profile.
3. In Claude Code, run `/mcp`, select `notion`, and choose **Authenticate**
   (or run `claude mcp login notion` in a terminal in the repo folder).
4. On the consent page, check that **Select workspace** shows the TEST workspace (not
   your personal one), tick **I recognize and trust this URL**, and click **Continue**.

## Gmail - Claude's Gmail connector (Google's official Gmail MCP server)

Gmail is **not** in `.mcp.json`. It is connected through the Gmail connector that is
built into Claude, which talks to Google's official Gmail MCP server
(`gmailmcp.googleapis.com/mcp/v1`).

### Why not configure Google's server directly in `.mcp.json`?

We tried. We created a Google Cloud project with the test account, enabled the
*Gmail MCP API*, created an OAuth client, and logged in from Claude Code. The login
worked and the server listed its 23 tools, but every tool call failed with:

> Access to this tool requires that your Google Cloud project (...) is enrolled in the
> Google Workspace Developer Preview Program.

Enrolling in that program requires a Google Workspace account, so it is not available
to a free `@gmail.com` test account. Claude's Gmail connector reaches the same official
Google server: Claude's connector directory lists it as published by **Google**, its
server URL points to `gmailmcp.googleapis.com/mcp/v1`, and it exposes the same 23 tools.

### Setup (one team member)

A Claude account can connect only **one** Google account to its Gmail connector, so one
team member connects theirs to the test account:

1. Click the Chrome window of the test profile so the Google login opens there.
2. In the Claude app (or claude.ai): **Settings > Connectors > Gmail**. If it is
   connected to a personal account, **Disconnect** it first.
3. **Connect** and sign in with the **test** Gmail account.
4. Make sure the Gmail connector is turned on for the session (**+** menu in the message
   box > **Connectors**).

In Claude Code's **auto** permission mode, reading mail may be blocked as personal-data
handling. Switch to a permission mode that asks before each action and approve the call
yourself.

## Extra services (one per team member)

Each team member adds a section for their service below, using this template:

```markdown
### <Service> - <official MCP server name>

- Owner: <team member>
- Official source: <link to the vendor's MCP documentation>
- Auth: OAuth / token in env var `<NAME>` (also add it to `.env.example`)
- Steps:
  1. ...
```

### Google Calendar - Claude's Google Calendar connector (Google's official Calendar MCP server)

- Owner: Franco Busso
- Official source: Claude's connector directory lists the Google Calendar connector as
  published by **Google**; its server URL is `calendarmcp.googleapis.com/mcp/v1`.
- Auth: OAuth through the Claude connector, with the **test** Google account (the same
  one as Gmail). There is no token, and it is not in `.mcp.json`, for the same reason as
  Gmail (see above).
- Steps:
  1. Click the Chrome window of the test profile so the Google login opens there.
  2. In the Claude app: **Settings > Connectors > Google Calendar**. If it is connected
     to a personal account, **Disconnect** it first.
  3. **Connect** and sign in with the **test** Google account.
  4. Turn the connector on for the session (**+** menu > **Connectors**).
  5. Ask Claude to list your calendars. The only calendar must be the test address. If
     you see your personal address, stop and repeat step 2.
- Note: the test calendar's time zone is UTC. Events are created in `America/New_York`.
