const _ = require('eplodash');
const Base = require('./Base');


class Feedback extends Base {
  _id = undefined;
  order = undefined;
  user = undefined;
  content = undefined;
  dateCreate = undefined;
  replies = undefined;
  constructor() {
    super();
  }
}
Feedback.modelName = 'Feedback';
Feedback.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }
  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = Feedback;
