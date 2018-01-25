const _ = require('eplodash');
const Base = require('./Base');


class Event extends Base {
  _id = undefined;
  type = undefined;
  subType = undefined;
  description = undefined;
  data = undefined;
  order = undefined;
  orderEntry = undefined;
  port = undefined;
  ship = undefined;
  segment = undefined;
  user = undefined;
  position = undefined;
  date = undefined;
  dateCreate = undefined;
  constructor() {
    super();
  }
}
Event.modelName = 'Event';
Event.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }
  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = Event;
