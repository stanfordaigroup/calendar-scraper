const base64 = require('js-base64').Base64;
const keyData = JSON.parse(base64.decode(process.env.GOOGLE_PRIVATE_KEY));

module.exports = {
  calendarId: {
    'saig': process.env.GOOGLE_CALENDAR_ID,
  },
  serviceAcctId: process.env.GOOGLE_SERVICE_ACCOUNT_ID,
  timezone: 'UTC+08:00',
  key: keyData.private_key,
};