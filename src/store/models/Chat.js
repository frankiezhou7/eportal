const _ = require('eplodash');
const Base = require('./Base');


class Chat extends Base {
  __v = undefined;
  _id = undefined;
  time = undefined;
  order = undefined;
  userId = undefined;
  userPhoto = undefined;
  userName = undefined;
  msg = undefined;
  constructor() {
    super();
  }
}
Chat.modelName = 'Chat';
Chat.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }
  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = Chat;
