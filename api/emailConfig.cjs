const {
  getTeamEmail,
  getFromAddress,
} = require('../server/smtpConfig.cjs');

module.exports = {
  TEAM_EMAIL: getTeamEmail(),
  FROM_ADDRESS: getFromAddress(),
};