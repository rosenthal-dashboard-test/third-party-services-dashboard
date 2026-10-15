# Ivan's tasks

> **For Claude:** You are helping **Ivan Zirlinger**, a member of this team. Read
> [README.md](README.md) in this folder first (team rules and known problems). Guide
> Ivan **one step at a time** and wait until each step is confirmed before moving on.
> Ivan does every sign-up, login, password and terms acceptance personally: never ask
> for a password and never type one. Follow `CLAUDE.md`. When a step is done, tick its
> box in this file.

**Extra service:** Todoist (suggested) · **Main task:** the PowerPoint presentation

## Part 0 - One-time setup

- [x] Get the test Google account password from Franco. He sends it privately, never
      in a file or in the chat with Claude. The test GitHub account has no separate
      password: log in at github.com with **Continue with Google** as the test account.
- [x] Create a Chrome profile for the test accounts (profile icon > **Add** > **Continue
      without an account**, name it "AI-Class-Test") and sign in to Gmail there with the
      test Google account.
- [x] Turn off any Claude connectors linked to your personal accounts (**+** menu in the
      message box > **Connectors**).
- [x] Create your own token on the test GitHub account and save it as `GITHUB_PAT`,
      following [GitHub setup](../mcp-setup.md#github---githubgithub-mcp-server-remote).
      Then fully quit and reopen the Claude app.
- [x] Set this repo's git identity to the test account (commands in [README.md](README.md#rules-for-everyone)).

## Part 1 - Extra service: Todoist (a separate conversation, only for this)

Start a new conversation in the repo folder and send:
> Read docs/team-tasks/ivan.md and docs/team-tasks/test-data-story.md, and guide me through Part 1.

- [x] Confirm the service with the team. Todoist is the suggestion. If you prefer another
      one, it must have an **official** MCP server made by the company itself, a free
      plan, and not be taken by someone else.
- [x] In the test Chrome profile, sign up at todoist.com with **Continue with Google**
      using the test Google account.
- [x] Add Doist's official server to `.mcp.json`:
      `"todoist": { "type": "http", "url": "https://ai.todoist.net/mcp" }`
- [ ] Open a new session so the server loads, then log in to it: send `/mcp`, choose
      `todoist` > **Authenticate**, and finish the login in the test Chrome profile.
- [x] Ask Claude to check, through the Todoist server, which user is logged in. It must
      be the test account.
- [x] Document it: add a "Todoist" section to [docs/mcp-setup.md](../mcp-setup.md) using
      the template there, and fill in the Todoist row and your row in the root `README.md`.
- [x] Fill Todoist with **at least 10 natural items** that fit the story (see "Ideas for
      the extra services" in [test-data-story.md](test-data-story.md)).
- [x] Commit and push `.mcp.json`, `docs/mcp-setup.md`, and `README.md`.
- [ ] Tell Franco that Todoist is ready.
- [ ] End this conversation with `/clear`. The assignment requires filling the test data
      in a different conversation from the rest of the work.

## Part 2 - PowerPoint (new conversation)

You can start the slides any time. The dashboard screenshots have to wait until Rangio
finishes the dashboard. Start a new conversation and send:
> Read docs/team-tasks/ivan.md and guide me through Part 2.

- [x] `git pull` and read the root `README.md`, `docs/mcp-setup.md`, and (once it exists)
      `localStorageFormats.md`.
- [x] Create the presentation in `presentation/` (for example `presentation/third-party-services-dashboard.pptx`). Suggested slides:
  1. Title, team members, course
  2. What the project does: services -> official MCP servers -> Claude Code -> `dataExports/` -> local dashboard
  3. The services and their official MCP servers, and who did each extra service
  4. What each team member did
  5. Test accounts and test data (why test accounts: the repo is public)
  6. Local storage formats (summary of `localStorageFormats.md`) and the download skill
  7. **One slide per service**: a screenshot of the original test content in the
     service's website (in the test Chrome profile) **and** a screenshot of the same
     content in the dashboard
  8. Cross-service search in the dashboard
  9. Security: how we kept passwords and tokens out of the public repo
- [ ] Take the screenshots of the original content in every service. Log in with the test
      accounts in the test Chrome profile.
- [ ] After Rangio finishes the dashboard, run it and take the matching dashboard
      screenshots.
- [ ] Make sure no screenshot shows a personal account, a password, or a token.
- [ ] Commit and push, then tell the team.
