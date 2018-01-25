const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class Events extends BasePageable {

  entries = undefined;

  constructor() {
    super();
  }

  $unshift(entry) {
    let events = this.asMutable();

    events.entries = events.entries.unshift(entry);

    return events.asImmutable();
  }
}

Events.modelName = 'Events';

Events.ENTRY_TYPE = 'Event';

module.exports = Events;
