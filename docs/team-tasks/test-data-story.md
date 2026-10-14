# Test data story: Pairly

> **Only read this file while filling a service with test data.** Do not use it when
> downloading data or building the dashboard: those steps must work from the real
> downloaded data only.

All test data in every service tells one fictional story, so that a search in the
dashboard (for example "Maya Chen" or "Westbrook") returns results from all services.
Write everything in natural English, as if real people wrote it.

## The story

**Pairly** is a small startup that makes an app for university students. It matches
students into study groups of 3 to 5 people by shared courses, overlapping free time, and
study style (quiet, discussion, or exam cram).

- Public beta launch: **November 2, 2026** at the fictional **Westbrook University**
- App store submission (Android and iOS): October 25
- Database migration: Saturday, October 17, 11 PM - 1 AM Eastern
- Weekly team sync: Thursdays at 10 AM Eastern
- Investor: Harbor Seed Fund. Partner meeting where Lena presents Pairly: October 30
- Next campuses: **Lakeside College** (January) and **Crestview State** (March)

## People (all fictional)

| Name | Role |
|---|---|
| Maya Chen | Co-founder & CEO: investors, partnerships, campus expansion |
| Daniel Ortiz | CTO: backend and matching service (`pairly-api`) |
| Priya Raman | Product designer: onboarding redesign, app icon, brand colors |
| Sam Okafor | Mobile developer: Android and iOS app (`pairly-mobile`) |
| Lena Fischer | Principal at Harbor Seed Fund (potential investor) |
| Tomas Rivera | Campus ambassador at Westbrook University, runs the beta testers |
| Wop testwell | Project manager (the owner of all the test accounts) |

## Recurring topics

- Matching service v0.3: API takes 4 seconds with 200+ students (target: under 1 second)
- Push notifications broken on Android 15 (missing permission request)
- Onboarding redesign: 7 screens down to 4, the "about you" screen removed
- Final app icon (two overlapping speech bubbles forming a "P"), colors deep teal `#0F766E` and warm coral `#F97362`
- Beta numbers: 214 sign-ups, 131 weekly active (61%), 58 groups, 37 met at least twice
- Students' top request: book a library study room from the app
- Students want smaller groups (3-4) for problem sets and a "Leave group" button

## What already exists

- **Gmail:** 11 emails from the team, the investor, and the campus ambassador (launch plan, bug reports, beta feedback, investor follow-up, agenda...)
- **GitHub:** repos `pairly-api`, `pairly-mobile`, `pairly-website` with 10 issues
- **Notion:** "Pairly HQ" with 10 pages (launch checklist, onboarding redesign, brand guidelines, matching spec, two weekly sync notes, beta feedback, investor notes, campus expansion, team directory)
- **Google Calendar:** 12 events (weekly sync, investor meetings, migration, load test, store deadline, launch day, retrospective...)

## Ideas for the extra services

Add new things that fit the story, not copies of what already exists:

- **Linear:** the product backlog for **after** the launch (v0.4): waiting list that retries matching every 6 hours, library room booking, group size picker, "see a group's past sessions", campus course catalog import...
- **Todoist:** Wop's personal to-do list with due dates: send the migration notice to beta testers, store screenshots with Priya, launch day email, order stickers for the launch booth, send fresh numbers to Lena after Nov 2...
- **ClickUp:** the campus expansion plan: Lakeside College and Crestview State launches, recruiting campus ambassadors, loading course catalogs, private betas, contacting the libraries...
