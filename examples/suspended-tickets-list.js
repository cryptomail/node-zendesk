var exampleConfig = require('./exampleConfig');
var zd = require('../lib/client');

var client = zd.createClient({
  username:  process.env.ZENDESK_TEST_USERNAME || exampleConfig.auth.username,
  token:     process.env.ZENDESK_TEST_TOKEN || exampleConfig.auth.token,
  remoteUri: process.env.ZENDESK_TEST_REMOTEURI || exampleConfig.auth.remoteUri
});

client.suspendedtickets.list(function (err, req, result) {
  if (err) {views-list.js
    console.log(err);
    return;
  }
  console.log(JSON.stringify(result));
  console.log("Total suspended: "+result.length);
});
