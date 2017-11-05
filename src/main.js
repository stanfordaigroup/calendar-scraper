const CONFIG = require("./config");
const GitHubApi = require('github');
const base64 = require('js-base64').Base64;
const CalendarAPI = require('node-google-calendar');

const cal = new CalendarAPI(CONFIG.googleCalendar);

const github = new GitHubApi({});

console.log('Config data:', CONFIG);

async function init() {
  let hasChanged = false;
  let newCalendarData = null;
  let fileSHA = null;

  // Setup GitHub authentication
  github.authenticate({
    type: 'token',
    token: CONFIG.token,
  });

  // Fetch the current JSON file in repo
  const curGitHubData = await fetchGitHubFile();
  const curJSONContent = base64.decode(curGitHubData.content);

  // Fetch upcoming events from GCal and generate a JSON file
  const curCalData = await fetchCalendarData();

  const parsedCalData = {
    data: curCalData.map(event => {
      return {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: event.start,
        end: event.end,
        updated: event.updated,
      };
    }),
  }
  
  newCalendarData = JSON.stringify(parsedCalData);

  // Diff new and old JSON files
  if (curJSONContent !== newCalendarData) {
    hasChanged = true;
  }

  // Update file (commit to repo) if there has been changes
  if (hasChanged && newCalendarData) {
    updateCalendarFile(curGitHubData, newCalendarData);
  } else {
    console.log('🚫 — No changes made.');
  }
}

function updateCalendarFile(curGitHubData, newCalendarData) {
  github.repos.getContent({
    ...CONFIG.repoOptions,
  }).then(data => {
    // Fetch the latest SHA of the requested file
    const fileSHA = curGitHubData.sha;
    const timestamp = new Date();
  
    // Now update the file
    github.repos.updateFile({
      ...CONFIG.repoOptions,
      message: 'Automated calendar update: ' + timestamp,
      content: base64.encode(newCalendarData),
      sha: fileSHA,
    }).then(data => {
      console.log('Success! 🎉');
      console.log('Updated file "' + CONFIG.repoOptions.path + '" on ' + timestamp + '.');
    }).catch(error => {
      console.error('Error updating file: ', CONFIG.repoOptions.path, error);
    });
  }).catch(error => {
    console.error('Error fetching file content for: ', CONFIG.repoOptions.path, error);
  }); 
}

async function fetchGitHubFile() {
  let response;

  try {
    response = await github.repos.getContent(CONFIG.repoOptions);
    response = response.data;
  } catch (error) {
    console.error('Error fetching file content for: ', CONFIG.repoOptions.path, error);
  }

  return response;
}

async function fetchCalendarData() {
  let response;

  const params = {
    showHidden: true,
    timeMin: new Date(Date.now()).toISOString(),
  };

  try {
    response = await cal.Events.list(CONFIG.googleCalendar.calendarId.saig, params);
  } catch (error) {
    console.error('Error fetching calendar data for: ', error);
  }

  return response;
}

init();