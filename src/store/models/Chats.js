const _ = require('eplodash');
const Base = require('./Base');
const BaseUnpageable = require('./BaseUnpageable');
const BasePageable = require('./BasePageable');

class Chats extends BasePageable {
  constructor() {
    super();
  }

  $pubMessage(msg) {
    return this.unshift(msg)
  }
}

Chats.modelName = 'Chats';
Chats.ENTRY_TYPE = 'Chat';

module.exports = Chats;
