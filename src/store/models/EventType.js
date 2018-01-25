const _ = require('eplodash');
const Base = require('./Base');


class EventType extends Base {
  __v = undefined;
  _id = undefined;
  code = undefined;
  name = undefined;
  parent = undefined;
  constructor() {
    super();
  }
}
EventType.modelName = 'EventType';
EventType.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }

  // add customized operations

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
};

module.exports = EventType;
