// TicketAudits.js: Client for the zendesk API.
const {Client} = require('../client');

class TicketAudits extends Client {
  constructor(options) {
    super(options);
    this.jsonAPINames = ['audits', 'audit'];
    this.sideLoadMap = [
      {field: 'author_id', name: 'author', dataset: 'users'},
      {field: 'ticket_id', name: 'ticket', dataset: 'tickets'},
    ];
  }

  // Listing TicketAudits
  async list(ticketID) {
    return this.getAll(['tickets', ticketID, 'audits']);
  }
}

exports.TicketAudits = TicketAudits;
