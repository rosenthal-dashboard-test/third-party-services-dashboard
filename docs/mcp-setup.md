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

1. Log in to the **test** GitHub account and create a fine-grained token:
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

## Gmail - Google Gmail MCP (`gmailmcp.googleapis.com`)

> **Status:** Google lists this server as part of the *Google Workspace Developer Preview
> Program*, and joining that program is a prerequisite. It is not yet in `.mcp.json`;
> step 5 below adds it.

Google's guide: <https://developers.google.com/workspace/gmail/api/guides/configure-mcp-server>

1. Using the **test** Google account, create a Google Cloud project.
2. Enable the APIs:
   ```bash
   gcloud services enable gmail.googleapis.com --project=PROJECT_ID
   gcloud services enable gmailmcp.googleapis.com --project=PROJECT_ID
   ```
3. *Google Auth Platform > Branding*: create the OAuth consent screen.
   - Audience: **External**, and add the test Gmail address under *Test users*.
   - Data Access scopes: `https://www.googleapis.com/auth/gmail.readonly` and
     `https://www.googleapis.com/auth/gmail.compose`.
4. *Clients > Create client*: type **Web application**, authorized redirect URI
   `http://localhost:8976/callback`. Copy the client ID and the client secret.
5. Register the server for the project. This writes the entry to `.mcp.json`. The client
   ID is not secret and is stored in the file. The client secret is asked for interactively
   and saved in Claude Code's credential store, **not** in the repo.
   ```bash
   claude mcp add --scope project --transport http --client-id CLIENT_ID --client-secret --callback-port 8976 gmail https://gmailmcp.googleapis.com/mcp/v1
   ```
6. In Claude Code, run `/mcp`, select `gmail`, choose **Authenticate**, and log in with the
   test Gmail account.

## Extra services (one per team member)

Copy this template for each extra service:

```markdown
## <Service> - <official MCP server name>

- Owner: <team member>
- Official source: <link to the vendor's MCP documentation>
- Auth: OAuth / token in env var `<NAME>` (also add it to `.env.example`)
- Steps:
  1. ...
```
