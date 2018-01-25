const _ = require('eplodash');
const Base = require('./Base');

class EventTypes extends alt.BasePageable {
  constructor() {
    super();
  }
}
EventTypes.modelName = 'EventTypes';
EventTypes.ENTRY_TYPE = 'EventType';

module.exports = EventTypes;
