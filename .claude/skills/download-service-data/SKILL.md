---
name: download-service-data
description: Download test data from this project's third-party services (Gmail, GitHub, Notion, Google Calendar, Todoist, and new ones such as Linear or ClickUp) through their official MCP servers, and store it in dataExports/<service>/ in the format of localStorageFormats.md. Use whenever asked to download, export, refresh or add data from any service, or to add a new service to dataExports/.
---

# Download service data

Downloads items from each connected service and saves one JSON file per item in
`dataExports/<service>/`. The format is defined in `localStorageFormats.md` at the repo
root. That file is the source of truth: read it before every download, and if it
disagrees with this skill, follow it.

## Safety rules (always)

- **The repo is public.** Download only the project's test data (the filters below).
  Never download real or personal data, and never write passwords, tokens or API keys
  into any file.
- **Only the test accounts.** Use the project MCP servers in `.mcp.json` (`github`,
  `notion`, `todoist`) and Claude's Gmail and Google Calendar connectors. Do **not** use
  any other claude.ai connector, for example a claude.ai Notion connector: it may be
  linked to someone's personal account.
- **Check the account before reading anything** (step 1). If a service is logged in
  to any account other than the test one, stop and tell the user.
- In **auto** permission mode, reading Gmail may be blocked. If that happens, ask the
  user to switch to a mode that asks before each action and approve the call.

## Steps

1. **Check each account.** Every service must show the test account
   (`woptestwell@gmail.com`, name "Wop testwell", GitHub user `rosenthal-dashboard-test`):

   | Service | How to check |
   |---|---|
   | GitHub | `get_me` → login `rosenthal-dashboard-test` |
   | Notion | `notion-get-self` → email `woptestwell@gmail.com` |
   | Todoist | `user-info` → email `woptestwell@gmail.com` |
   | Google Calendar | `list_calendars` → a calendar with id `woptestwell@gmail.com` |
   | Gmail | `search_threads` (`pageSize` 3, `view` `THREAD_VIEW_METADATA_ONLY`) → `toRecipients` is `woptestwell@gmail.com` |

   A service whose tools are missing is not connected: skip it and say so at the end.
2. **Get one timestamp for the whole run** with `date -u +%Y-%m-%dT%H:%M:%SZ` and use it
   as `downloadedAt` in every file.
3. **Download each service** with the recipe below. Write one file per item with the
   Write tool: the nine common keys in the order of `localStorageFormats.md`, 2-space
   indentation, UTF-8, `null` / `[]` for missing values.
4. **Run the checker** and fix every problem it reports:
   ```bash
   python -I .claude/skills/download-service-data/scripts/check_exports.py dataExports
   ```
5. **Report** to the user: items per service, which files are new and which were
   overwritten, and any service that was skipped. Do not commit unless the user asks.

When the user asks for "more" or "additional" data, list the items first. Items whose
file already exists are overwritten with fresh data, which is fine. Tell the user how
many items are really new. If a service has no new test items, say so; never fill the
gap with non-test data.

## Recipes

### Gmail → `dataExports/gmail/`

- `search_threads` with `query: "from:woptestwell@gmail.com to:woptestwell@gmail.com"`
  (the Pairly test emails, all self-sent). Never download the automatic emails from
  Google, Notion and other services that are also in the inbox.
- `get_thread` for each thread with `messageFormat: PLAIN_TEXT`.
- **One file per message**, named `<messageId>.json`. `title` = subject, `date` = message
  `date`, `url` = the message's `viewUrl`, `text` = `plaintextBody`.
- `metadata`: `threadId`, `from` (= `sender`), `to`, `cc`, `bcc`, `subject`, `labels`
  (= `labelIds`), `messagesInThread`, `positionInThread` (1-based, in thread order),
  `historyId`, `internalDate`, `sizeEstimate`, `attachments`.

### GitHub → `dataExports/github/`

- `list_issues` for owner `rosenthal-dashboard-test` and each test repo: `pairly-api`,
  `pairly-mobile`, `pairly-website`. Never include `third-party-services-dashboard` (this
  project).
- File `<repo>-<number>.json`. `id` = `rosenthal-dashboard-test/<repo>#<number>`,
  `date` = `created_at`, `url` = `https://github.com/rosenthal-dashboard-test/<repo>/issues/<number>`,
  `text` = `body`.
- `metadata`: `owner`, `repo`, `number`, `state`, `labels` (names), `assignees`,
  `author` (= `user.login`), `createdAt`, `updatedAt`.

### Notion → `dataExports/notion/`

- `notion-search` with query `Pairly HQ`, then `notion-fetch` for "Pairly HQ" and each
  page whose path is "Pairly HQ" (or deeper inside it).
- File `<pageId>.json`, ID with dashes. `title` = page title **without** the leading
  emoji, `date` = `page_last_edited_at`, `url` = page URL without `?pvs=...`.
- `text` = everything between `<content>` and `</content>` in the fetch result, unchanged
  (Notion tags such as `<mention-date .../>` are kept).
- `metadata`: `icon`, `workspace` ("Wop testwell’s Space", from `notion-get-self`),
  `parentId`, `parentTitle`, `path`, `lastEditedTime`, `childPageIds` (from the
  `<page url=...>` tags in the content), `contentFormat` = `notion-enhanced-markdown`.

### Google Calendar → `dataExports/googleCalendar/`

- `list_events` on `calendarId: woptestwell@gmail.com` with a wide range, for example
  `startTime: 2026-09-01T00:00:00`, `endTime: 2026-12-31T00:00:00`,
  `orderBy: startTime`, `pageSize: 100`. Skip the "Holidays in United States" calendar.
- **Recurring events:** instances share `recurringEventId`. Save them as **one** file
  named after the series ID. Call `get_event` with the series ID to get `recurrence`,
  and list every instance start in `occurrences`. `date` = first occurrence.
- **All-day events:** the connector returns `start.date` like `2026-10-25T00:00:00Z`.
  Store only the date part (`2026-10-25`) in `date`, `start`, `end` and `occurrences`,
  and set `allDay: true`.
- `title` = `summary`, `url` = `htmlLink`, `text` = `description` (`""` if none).
- `metadata`: `calendarId`, `start`, `end`, `allDay`, `timeZone`, `location`, `status`,
  `eventType`, `transparency` (`opaque` when missing), `organizer` and `creator`
  (email), `created`, `updated`, `recurrence` (or `null`), `occurrences`, `reminders`.

### Todoist → `dataExports/todoist/`

- `find-projects`, then `find-tasks` for each project with `limit: 100` and
  `responsibleUserFiltering: all`.
- File `<taskId>.json`. `title` = `content`, `date` = `dueDate` (`addedAt` if the task
  has no due date), `url` = `https://app.todoist.com/app/task/<id>`,
  `text` = `description`.
- `metadata`: `projectId`, `projectName`, `dueDate`, `recurring`, `priority`, `labels`,
  `checked`, `addedAt`.

## Adding a new service (Linear, ClickUp, ...)

1. Make sure its official MCP server is in `.mcp.json` and logged in to the test
   account (the user does the login), and check the account as in step 1.
2. Choose the folder name (camelCase), `type`, file name, and what `date` and `text`
   mean, following "Adding a new service" in `localStorageFormats.md`.
3. Download as above, then run the checker. Add the service to `SERVICES` in
   `scripts/check_exports.py` if its file names do not follow `<id>.json`.
4. Add a section for the service to `localStorageFormats.md`, and a recipe to this
   skill.
