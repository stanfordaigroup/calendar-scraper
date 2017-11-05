const CONFIG = require("./config");
const GitHubApi = require('github');
const base64 = require('base-64');
const GitHubToken = require('../.credentials/github_token').token;

const github = new GitHubApi({});

github.authenticate({
  type: 'token',
  token: GitHubToken,
});

let fileSHA = null;

const timestamp = new Date();

github.repos.getContent({
  ...CONFIG.repoOptions,
}).then(data => {
  // Fetch the latest SHA of the requested file
  fileSHA = data.data.sha;

  github.repos.updateFile({
    ...CONFIG.repoOptions,
    message: 'Automated calendar update: ' + timestamp,
    content: base64.encode(timestamp),
    sha: fileSHA,
  }).then(data => {
    console.log(data);
  }).catch(error => {
    console.error(error)
  });
}).catch(error => {
  console.error(error);
});