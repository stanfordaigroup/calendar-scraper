# Calendar Scraper

![](https://img.shields.io/badge/hacky,%20but%20it%20works%E2%84%A2-approved-green.svg?style=flat-square)

> _**NOTE**: Not meant for external use, but still open-source for those interested._

This script automatically updates the [SAIG calendar](http://www.stanfordai.group/) based on our shared google calendar.

## What this does:

1. Sets up GitHub API authentication and fetches the latest calendar.json file from the [SAIG website repo](https://github.com/stanfordaigroup/stanfordai.group).
2. Sets up Google Calendar API auth and fetches the latest calendar data.
3. Formats latest calendar data to only what we need.
4. Compare old and new data to see if changes exist.
5. Use the GitHub API to update (push a commit) the calendar.json file if we find changes.
6. Our netlify app hosting the website notices the new commit and automatically rebuilds the website with the new data.

The app is hosted on heroku, where we do a check every 10 min for changes to the calendar.

---

Cheers to automation! 🎉
