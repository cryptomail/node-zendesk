const exampleConfig = require('./exampleConfig');
const zd = require('../lib/client');

var client = zd.createClient({
    username:  process.env.ZENDESK_TEST_USERNAME || exampleConfig.auth.username,
    token:     process.env.ZENDESK_TEST_TOKEN || exampleConfig.auth.token,
    remoteUri: process.env.ZENDESK_TEST_REMOTEURI || exampleConfig.auth.remoteUri
});

const ticket = {
  "ticket":
    {
      "subject":"My printer is on fire!",
      "comment": {
        "body": "The smoke is very colorful."
      }
    }
  };

(async () => {
  try {
    const result = await client.tickets.create(ticket);
    console.log(JSON.stringify(result, null, 2, true));
  } catch (err) {
    handleError(err);
  }
})();

function handleError(err) {
    console.log(err);
    process.exit(-1);
}
