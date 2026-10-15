# Demo video script (silent, about 3 minutes)

A screen recording with no voice. Short caption cards
([demo-captions.html](demo-captions.html), opened in Chrome) explain each part.
Press **→** or **Space** for the next card.

## Before recording (about 10 minutes, not filmed)

1. **Practice run.** In a new Claude Code session in this repo folder, send the
   download prompt from scene 3 once. If Claude asks permission for ClickUp tools,
   choose **"Yes, and don't ask again"**, so the recording has no permission pop-ups.
2. **Log out of ClickUp** in the test Chrome profile ("AI-Class-Test"): avatar (bottom
   left) > **Log out**. Scene 2 shows the login.
3. **Open the windows you need**, in the test Chrome profile:
   - Tab 1: `presentation/demo-captions.html` (drag the file into Chrome), full screen
   - Tab 2: `https://app.clickup.com` (login page)
   - Tab 3: empty, for the dashboard later
   - Claude Code: a **new** session in this repo folder
   - Terminal (or a second Claude Code tab) in this repo folder, for the dashboard
4. **Privacy check.** Close email, chats, notifications (turn on Do Not Disturb), and
   any personal browser profile. In the Claude app, collapse the sidebar so your
   personal account name and past chats are not visible. No password or token on screen.

## Recording

Start with **Cmd + Shift + 5** > **Record Entire Screen** > **Record**.
Stop with the ⏹ button in the menu bar.

| # | Time | On screen | What to do |
|---|---|---|---|
| 1 | 0:00-0:15 | Captions, card 1 | Wait ~12 s on the title card. Press → for card 2. |
| 2 | 0:15-0:55 | ClickUp | Card 2 for 3 s. Switch to the ClickUp tab > **Continue with Google** > pick the test account. Open **Team Space > Campus Expansion > Lakeside College - January launch**. Click the task "Recruit a campus ambassador at Lakeside College" to show its description. |
| 3 | 0:55-1:45 | Claude Code + Finder | Card 3 for 3 s. In Claude Code, paste the prompt below and press Enter. When it finishes, show the files: open `dataExports/clickUp/` in Finder (or ask Claude to list it) and open one JSON file. |
| 4 | 1:45-2:40 | Terminal + dashboard | Card 4 for 3 s. In the terminal run `node dashboard/server.js`. Open `http://localhost:3000` in tab 3. Choose **ClickUp** in the drop-down and type `ambassador` (7 results). Click **Show full content** on one. Then choose **All services** and type `Lakeside` (19 results from 6 services). Point at the colored service badges. |
| 5 | 2:40-2:55 | Captions, card 5 | Switch to the captions tab, press → to the last card, wait ~10 s, stop recording. |

**Prompt for scene 3:**

> Use the download skill to refresh the ClickUp data in dataExports/clickUp/, then list the files.

## If something goes wrong

- **Claude takes too long in scene 3:** keep recording. Afterwards, open the video in
  **iMovie** and cut out the waiting (or speed it up with the speed button). The final
  video must be **3:00 or less**.
- **Wrong click:** keep going, and cut it in iMovie, or record again.
- **The file is bigger than 100 MB:** ask Claude Code to compress it (macOS
  `avconvert`), or upload it to YouTube as **Unlisted** and put the link in
  `presentation/`.
