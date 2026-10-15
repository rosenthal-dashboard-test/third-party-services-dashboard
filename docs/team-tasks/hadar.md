# Hadar's tasks

> **For Claude:** You are helping **Hadar Lavinsky**, a member of this team. Read
> [README.md](README.md) in this folder first (team rules and known problems). Guide
> Hadar **one step at a time** and wait until each step is confirmed before moving on.
> Hadar does every sign-up, login, password and terms acceptance personally: never ask
> for a password and never type one. Follow `CLAUDE.md`. When a step is done, tick its
> box in this file.

**Extra service:** ClickUp (suggested) · **Main tasks:** the demo video and the final README

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

## Part 1 - Extra service: ClickUp (a separate conversation, only for this)

Start a new conversation in the repo folder and send:
> Read docs/team-tasks/hadar.md and docs/team-tasks/test-data-story.md, and guide me through Part 1.

- [x] Confirm the service with the team. ClickUp is the suggestion. If you prefer another
      one, it must have an **official** MCP server made by the company itself, a free
      plan, and not be taken by someone else.
- [x] In the test Chrome profile, sign up at clickup.com with **Continue with Google**
      using the test Google account. Name the workspace "Pairly".
- [x] Add ClickUp's official server to `.mcp.json`:
      `"clickup": { "type": "http", "url": "https://mcp.clickup.com/mcp" }`
      (check ClickUp's MCP documentation first in case the address changed).
- [x] Open a new session so the server loads, then log in to it: send `/mcp`, choose
      `clickup` > **Authenticate**, and finish the login in the test Chrome profile.
- [x] Ask Claude to check, through the ClickUp server, which user is logged in. It must
      be the test account.
- [x] Document it: add a "ClickUp" section to [docs/mcp-setup.md](../mcp-setup.md) using
      the template there, and fill in the ClickUp row and your row in the root `README.md`.
- [x] Fill ClickUp with **at least 10 natural items** that fit the story (see "Ideas for
      the extra services" in [test-data-story.md](test-data-story.md)).
- [x] Commit and push `.mcp.json`, `docs/mcp-setup.md`, and `README.md`.
- [ ] Tell Franco that ClickUp is ready.
- [ ] End this conversation with `/clear`. The assignment requires filling the test data
      in a different conversation from the rest of the work.

## Part 2 - Demo video (new conversation)

**Wait until Rangio finishes the dashboard.** Then start a new conversation and send:
> Read docs/team-tasks/hadar.md and guide me through Part 2.

The assignment asks for a video of **3 minutes or less** that shows:
logging in to at least one real service, downloading its data with Claude Code,
starting the local dashboard, and searching for something that returns results.

- [ ] `git pull` and check that the download skill (in `.claude/skills/`) and the
      dashboard both work on your computer.
- [ ] Write a short script, about 3 minutes in total:
  1. (15 s) What the project is
  2. (40 s) Log in to ClickUp (or another service) in the test Chrome profile and show the test items
  3. (50 s) In Claude Code, ask it to download that service's data, then show the new files in `dataExports/`
  4. (50 s) Start the dashboard and search one service, then all services at once
  5. (15 s) Wrap-up
- [ ] Record the screen (Windows: Snipping Tool > Record, or Win + Alt + R). Before
      recording, close anything personal and check that no password or token is visible.
- [ ] GitHub rejects files over 100 MB. If the video is bigger, compress it or upload it
      as an unlisted YouTube video and put the link in `presentation/`.
- [ ] Put the video (or the link) in `presentation/`, commit and push, then tell the team.

## Part 3 - Final README (same or new conversation)

Send:
> Read docs/team-tasks/hadar.md and guide me through Part 3.

- [ ] `git pull`, then update the root `README.md` so someone who has never heard of the
      project understands it:
  - What the project is and what each part does
  - The team table: each person's job and extra service
  - Every service with its official MCP server and its data folder
  - "Downloading data": how to use the skill in `.claude/skills/`
  - "Running the dashboard": check that Rangio's section works when you follow it exactly
  - Where to find the presentation and the video
- [ ] Remove all the `_TBD_` placeholders.
- [ ] Commit and push, then tell the team.
