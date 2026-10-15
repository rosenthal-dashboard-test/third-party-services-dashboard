# Local storage formats

This file describes how data downloaded from each third-party service is stored on
disk. Claude Code writes the files (through the download skill in `.claude/skills/`),
and the dashboard in `dashboard/` reads them. Nothing else should be needed to
understand a file in `dataExports/`.

## Folder layout

```
dataExports/
├── gmail/            one file per email
├── github/           one file per issue
├── notion/           one file per page
├── googleCalendar/   one file per event (a recurring event is one file)
└── todoist/          one file per task
```

Each service has its own folder, named in camelCase. New services (Linear, ClickUp)
get their own folder the same way (see [Adding a new service](#adding-a-new-service)).

## Common format

Every file is a single JSON object with the same nine top-level keys, always in this
order:

| Key | Type | Meaning |
|---|---|---|
| `service` | string | Folder name of the service (`gmail`, `github`, `notion`, `googleCalendar`, `todoist`) |
| `type` | string | Kind of item: `email`, `issue`, `page`, `event`, `task` |
| `id` | string | The service's own ID for the item. Unique within the service. |
| `title` | string | Short human-readable name (subject, issue title, page title, event name, task name) |
| `date` | string | The main date of the item, ISO 8601 (see [Dates](#dates)) |
| `url` | string | Link that opens the item in the service's website |
| `text` | string | The item's main content, for reading and searching. Can be `""`. |
| `downloadedAt` | string | When the item was downloaded, UTC, `YYYY-MM-DDTHH:MM:SSZ` |
| `metadata` | object | Every other field the service gives, different for each service (see below) |

Example (Gmail, `text` shortened):

```json
{
  "service": "gmail",
  "type": "email",
  "id": "1a1384439e59578c",
  "title": "Pairly beta launch plan - Nov 2",
  "date": "2026-10-14T02:35:57Z",
  "url": "https://mail.google.com/mail/?authuser=woptestwell@gmail.com#all/thread-f:1878990895497959308|msg-f:1878990895497959308",
  "text": "Hi Wop,\n\nWe're officially locking Sunday, November 2 as the Pairly beta launch date. ...",
  "downloadedAt": "2026-10-15T21:44:49Z",
  "metadata": {
    "threadId": "1a1384439e59578c",
    "from": "woptestwell@gmail.com",
    "to": ["woptestwell@gmail.com"],
    "cc": [],
    "bcc": [],
    "subject": "Pairly beta launch plan - Nov 2",
    "labels": ["UNREAD", "SENT", "INBOX"],
    "messagesInThread": 1,
    "positionInThread": 1,
    "historyId": "3693",
    "internalDate": "1791945357000",
    "sizeEstimate": 2557,
    "attachments": []
  }
}
```

## Rules for every service

- **File name:** `<id>.json`, except GitHub (`<repo>-<number>.json`, because its `id`
  contains `/` and `#`). Downloading the same item again overwrites its file, so there
  are never duplicates.
- **Encoding:** UTF-8, 2-space indentation. Emoji and accents (for example `Tomás`) are
  kept as they are.
- **Text:** plain text, newlines as `\n`. Nothing is shortened or summarized.
- **Missing values:** `null` for a missing single value, `[]` for an empty list. Keys are
  never left out.
- **Only test data:** download only the items created as test data for this project
  (see the filter in each service below). Never download real or personal data, and never
  store passwords, tokens or API keys. The repo is public.

### Dates

- Timestamps are ISO 8601. Most are UTC (`Z`). Calendar events keep the event's own
  offset, for example `2026-10-01T10:00:00-04:00`.
- A value with only a date (`YYYY-MM-DD`) means a whole day with no time: Todoist due
  dates and all-day Calendar events. Show it as that calendar day. Do not convert it to
  another time zone, or it can move to the previous day.
- What `date` means for each service:

| Service | `date` is |
|---|---|
| Gmail | When the email was sent |
| GitHub | When the issue was created |
| Notion | When the page was last edited (the Notion MCP does not give the creation time) |
| Google Calendar | When the event starts (first occurrence for a recurring event) |
| Todoist | The due date |

## Gmail

- **Source:** Claude's Gmail connector (Google's official Gmail MCP), tools
  `search_threads` and `get_thread` with `messageFormat: PLAIN_TEXT`.
- **What is downloaded:** the Pairly test emails, found with the query
  `from:woptestwell@gmail.com to:woptestwell@gmail.com`. Automatic emails from Google,
  Notion and other services in the inbox are left out on purpose.
- **One file per email**, not per conversation. Replies in the same conversation share
  `metadata.threadId`.
- `id` = Gmail message ID. `title` = subject. `text` = plain-text body (replies include
  the quoted earlier message, as in Gmail).
- The test emails are all sent from the test account to itself. The person who "wrote"
  each email in the story is the signature at the end of `text`.

| `metadata` key | Meaning |
|---|---|
| `threadId` | Conversation ID |
| `from` | Sender address |
| `to`, `cc`, `bcc` | Lists of recipient addresses |
| `subject` | Subject line |
| `labels` | Gmail label IDs (`INBOX`, `SENT`, `UNREAD`, ...) |
| `messagesInThread` | Number of emails in the conversation |
| `positionInThread` | 1 for the first email, 2 for the first reply, ... |
| `historyId`, `internalDate`, `sizeEstimate` | Gmail's own values, kept as given |
| `attachments` | List of attachments (empty for the test data) |

## GitHub

- **Source:** GitHub's official MCP server (`.mcp.json`, server `github`), tool
  `list_issues`.
- **What is downloaded:** all issues of the test repos `pairly-api`, `pairly-mobile` and
  `pairly-website` under `rosenthal-dashboard-test`. This project's own repo
  (`third-party-services-dashboard`) is not included.
- **File name:** `<repo>-<number>.json`, for example `pairly-api-1.json`.
- `id` = `owner/repo#number`, for example `rosenthal-dashboard-test/pairly-api#1`.
  `text` = issue body in GitHub Markdown.

| `metadata` key | Meaning |
|---|---|
| `owner`, `repo`, `number` | Where the issue lives |
| `state` | `OPEN` or `CLOSED` |
| `labels` | Label names (`bug`, `enhancement`, `design`) |
| `assignees` | Usernames |
| `author` | Username that opened the issue |
| `createdAt`, `updatedAt` | UTC timestamps |

## Notion

- **Source:** Notion's official MCP server (`.mcp.json`, server `notion`), tools
  `notion-search` and `notion-fetch`.
- **What is downloaded:** the page "Pairly HQ" and every page inside it.
- `id` = page ID (UUID with dashes). `title` = page title without its emoji icon (the
  emoji is in `metadata.icon`). `url` = page link without query parameters.
- `text` = page content exactly as the Notion MCP returns it: Markdown plus a few Notion
  tags. To show it nicely in the dashboard:
  - `<mention-date start="2026-11-02"/>` → show the date `2026-11-02`
  - `<page url="...">Title</page>` → a link to a child page
  - `<callout icon="👋" color="blue_bg">...</callout>` → a highlighted box
  - `- [x]` / `- [ ]` → checked / unchecked to-do items

| `metadata` key | Meaning |
|---|---|
| `icon` | Page emoji |
| `workspace` | Workspace name |
| `parentId`, `parentTitle` | Parent page (`null` for Pairly HQ) |
| `path` | Titles of the ancestor pages |
| `lastEditedTime` | UTC timestamp |
| `childPageIds` | IDs of the pages inside this one |
| `contentFormat` | Always `notion-enhanced-markdown` |

## Google Calendar

- **Source:** Claude's Google Calendar connector (Google's official Calendar MCP), tools
  `list_events` (on the calendar `woptestwell@gmail.com`) and `get_event` (to read the
  repeat rule of recurring events).
- **What is downloaded:** the Pairly test events. The "Holidays in United States"
  calendar is not included.
- **Recurring events are stored once**, under the series ID. `metadata.recurrence` has
  the repeat rule and `metadata.occurrences` lists every start time. Example: "Pairly
  weekly sync" repeats on 10 Thursdays and is one file.
- `title` = event name. `text` = event description. `url` = link to the event in Google
  Calendar.
- Attendees appear in `text`, because the test events have no invited guests.

| `metadata` key | Meaning |
|---|---|
| `calendarId` | Calendar the event belongs to |
| `start`, `end` | Start and end. For all-day events, `YYYY-MM-DD`, and `end` is the day **after** the last day (Google's rule) |
| `allDay` | `true` for all-day events |
| `timeZone` | Time zone of the event |
| `location` | Place or call, or `null` |
| `status` | `confirmed`, `tentative` or `cancelled` |
| `eventType` | Google's event type (`DEFAULT` for normal events) |
| `transparency` | `opaque` = busy, `transparent` = free |
| `organizer`, `creator` | Email addresses |
| `created`, `updated` | UTC timestamps |
| `recurrence` | List of RRULE strings, or `null` |
| `occurrences` | Start of every occurrence (one item for single events) |
| `reminders` | Reminder settings |

## Todoist

- **Source:** Doist's official Todoist MCP server (`.mcp.json`, server `todoist`), tools
  `find-projects` and `find-tasks`.
- **What is downloaded:** all tasks of the test account. Today they are all in the
  Inbox project.
- `title` = task name. `text` = task description (`""` when the task has none).
  `url` = `https://app.todoist.com/app/task/<id>`.

| `metadata` key | Meaning |
|---|---|
| `projectId`, `projectName` | Project the task belongs to |
| `dueDate` | `YYYY-MM-DD`, or `null` |
| `recurring` | `true` if the task repeats |
| `priority` | `p1` (highest) to `p4` (lowest), as in the Todoist app |
| `labels` | Label names |
| `checked` | `true` if the task is completed |
| `addedAt` | When the task was created, UTC |

## Adding a new service

1. Create `dataExports/<serviceName>/`, in camelCase.
2. Use the nine common keys above, in the same order.
3. Pick a `type` and decide what `date` means for the service.
4. Put every other field the MCP returns in `metadata`, renamed to camelCase. Use
   `null` and `[]` for missing values.
5. Add a section to this file, like the ones above: source and tools, what is
   downloaded, file name, `id`/`title`/`text`, and a `metadata` table.

## Notes for the dashboard

- To list all items, read every `*.json` file in every folder of `dataExports/` (ignore
  `.gitkeep`). Each file is one item.
- To search across services, search `title` and `text`. Searching `metadata` too also
  finds names in recipients, labels and so on.
- To sort by `date`, be careful with dates that have no time (`YYYY-MM-DD`). Treat them
  as the start of that local day.
