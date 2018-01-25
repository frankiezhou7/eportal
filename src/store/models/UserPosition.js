const _ = require('eplodash');
const Base = require('./Base');

class UserPosition extends Base {
  user = undefined;
  group = undefined;
  title = undefined;
  name = undefined;
  dateValid = undefined;
  dateExpire = undefined;
  status = undefined;
  onHoliday = undefined;
  holidayDuration = undefined;

  constructor() { super(); }
}
UserPosition.modelName = 'UserPosition';
UserPosition.fromJS = function(obj) {
  if (!obj) { return obj; }

  obj.user = obj.user ? this.domain.toModel(obj.user, 'User') : undefined;
  obj.group = obj.group ? this.domain.toModel(obj.group, 'UserGroup') : undefined;

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = UserPosition;
