const _ = require('eplodash');
const Base = require('./Base');

class UserGroup extends Base {
  name = undefined;
	description = undefined;
  account = undefined;
  parent = undefined;
  creator = undefined;
  owner = undefined;
  admins = undefined;
  accountManagement = undefined;
  orderPermission = undefined;
  __v = undefined;
  constructor() { super(); }
}
UserGroup.modelName = 'UserGroup';
UserGroup.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }

  obj.account = obj.account ? this.domain.toModel(obj.account, 'Account') : undefined;
  obj.parent = obj.parent ? this.domain.toModel(obj.parent, 'UserGroup') : undefined;
  obj.creator = obj.creator ? this.domain.toModel(obj.creator, 'UserPosition') : undefined;
  obj.owner = obj.owner ? this.domain.toModel(obj.owner, 'UserPosition') : undefined;

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = UserGroup;
