#!/usr/bin/env node
const process = require('node:process');
const zd = require('../lib/client');
const exampleConfig = require('./exampleConfig');

const client = zd.createClient({
  username: process.env.ZENDESK_TEST_USERNAME || exampleConfig.auth.username,
  token: process.env.ZENDESK_TEST_TOKEN || exampleConfig.auth.token,
  remoteUri: process.env.ZENDESK_TEST_REMOTEURI || exampleConfig.auth.remoteUri,
});

const ticket = {
  ticket: {
    subject: 'My printer is on fire!',
    comment: {
      body: 'The smoke is very colorful.',
    },
  },
};

client.tickets.create(ticket, function (error, request, result) {
  if (error) return handleError(error);
  console.log(JSON.stringify(result, null, 2, true));
});

function handleError(error) {
  console.log(error);
  process.exit(-1);
}
