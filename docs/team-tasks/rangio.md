# Rangio's tasks

> **For Claude:** You are helping **Rangio Nachlieli**, a member of this team. Read
> [README.md](README.md) in this folder first (team rules and known problems). Guide
> Rangio **one step at a time** and wait until each step is confirmed before moving on.
> Rangio does every sign-up, login, password and terms acceptance personally: never ask
> for a password and never type one. Follow `CLAUDE.md`. When a step is done, tick its
> box in this file.

**Extra service:** Linear (suggested) · **Main task:** the dashboard website

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

## Part 1 - Extra service: Linear (a separate conversation, only for this)

Start a new conversation in the repo folder and send:
> Read docs/team-tasks/rangio.md and docs/team-tasks/test-data-story.md, and guide me through Part 1.

- [x] Confirm the service with the team. Linear is the suggestion. If you prefer another
      one, it must have an **official** MCP server made by the company itself, a free
      plan, and not be taken by someone else.
- [x] In the test Chrome profile, sign up at linear.app with **Continue with Google** using
      the test Google account. Name the workspace "Pairly".
- [x] Add Linear's official server to `.mcp.json`:
      `"linear": { "type": "http", "url": "https://mcp.linear.app/mcp" }`
- [x] Open a new session so the server loads, then log in to it: send `/mcp`, choose
      `linear` > **Authenticate**, and finish the login in the test Chrome profile.
- [x] Ask Claude to check, through the Linear server, which user is logged in. It must
      be the test account.
- [x] Document it: add a "Linear" section to [docs/mcp-setup.md](../mcp-setup.md) using
      the template there, and fill in the Linear row and your row in the root `README.md`.
- [x] Fill Linear with **at least 10 natural items** that fit the story (see "Ideas for
      the extra services" in [test-data-story.md](test-data-story.md)).
- [x] Commit and push `.mcp.json`, `docs/mcp-setup.md`, and `README.md`.
- [x] Tell Franco that Linear is ready.
- [ ] End this conversation with `/clear`. The assignment requires filling the test data
      in a different conversation from the rest of the work.

## Part 2 - Dashboard website (new conversation)

**Wait until Franco says the data is in `dataExports/`.** Then start a new conversation
and send:
> Read docs/team-tasks/rangio.md and guide me through Part 2.

Do **not** read `test-data-story.md` in this part. The dashboard must work only from the
downloaded data.

- [x] `git pull`, then read `localStorageFormats.md` and look at the files in `dataExports/`.
- [x] Build the dashboard in `dashboard/`. Requirements from the assignment:
  - A website that runs locally and reads **only** from `dataExports/`
  - Search for any text and show the real content that matches
  - Choose one service to show content from, **or** search all services at once
  - Every result clearly shows which service it comes from
- [x] Keep it simple: one command to start it, no database, no accounts.
- [x] Test some searches that should return results from several services, for example
      a person's name that appears in emails, issues, pages, and events.
- [x] Write the "Running the dashboard" section of the root `README.md`: what to install
      and the exact command to start it.
- [ ] Commit and push, then tell the team. Ivan needs the dashboard for his screenshots
      and Hadar for the video.
