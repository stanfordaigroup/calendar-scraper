const GitHubToken = require('../.credentials/github_token').token;
const GoogleCalendar = require('../.credentials/google_calendar');

const repoOptions = {
  owner: 'stanfordaigroup',
  repo: 'stanfordai.group',
  path: 'src/calendar.json',
};

module.exports = {
  repoOptions,
  token: GitHubToken,
  googleCalendar: GoogleCalendar,
};