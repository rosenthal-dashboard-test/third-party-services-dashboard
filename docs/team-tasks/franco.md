# Franco's tasks

> **For Claude:** You are helping **Franco Busso**, who coordinates the team. Read
> [README.md](README.md) in this folder first. Guide Franco **one step at a time** and
> wait until each step is confirmed. Franco does every login, password and terms
> acceptance personally. Follow `CLAUDE.md`. When a step is done, tick its box in this file.

**Extra service:** Google Calendar · **Main task:** downloading the data from every
service, `localStorageFormats.md`, and the download skill

## Done

- [x] Test accounts: Google, GitHub, Notion
- [x] MCP connections: GitHub and Notion (`.mcp.json`), Gmail and Google Calendar (Claude connectors)
- [x] Test data: Gmail (11 emails), GitHub (3 repos + 10 issues), Notion (11 pages), Google Calendar (12 events)
- [x] Team task files (this folder)

## Coordination

- [ ] Send each teammate their message, and send them the test Google account password
      privately (GitHub is logged in with Continue with Google, so no other password).
- [ ] Each time a teammate says their extra service is ready: `git pull`, open a new
      session, log in to the new server (`/mcp` > the server > **Authenticate**, in the
      test Chrome profile), and ask Claude which user is logged in to check that it is
      the test account.

## Download step (new conversation, after all extra services are ready)

Start a new conversation with `/clear`. Do **not** read `test-data-story.md` in this
part. Then send:
> Read docs/team-tasks/franco.md and guide me through the download step.

- [ ] Check that every service is connected to its test account. For Gmail and Google
      Calendar, list recent emails or calendars and confirm the test address.
- [ ] Download at least 5 items from **every** service into `dataExports/<service>/`,
      with all their metadata (for example, for emails: from, to, subject, date). Each
      item must be distinguishable from the others.
- [ ] Have Claude write `localStorageFormats.md`, explaining the format of every service.
      **Review it yourself.** The assignment says the format is your responsibility.
- [ ] Have Claude create the project skill for downloading and storing data, in
      `.claude/skills/`.
- [ ] Commit and push.

## Check the skill (new conversation)

- [ ] `/clear`, then ask Claude to download some additional data from every service.
      Check that the new files follow the skill and `localStorageFormats.md`.
- [ ] Commit and push, then tell Rangio that the data is ready for the dashboard.

## Final check

- [ ] Go through the deliverables checklist in [README.md](README.md#deliverables-checklist-from-the-assignment).
- [ ] Submit the repo URL: https://github.com/rosenthal-dashboard-test/third-party-services-dashboard
