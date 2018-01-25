const _ = require('eplodash');
const Base = require('./Base');

class UserGroupRole extends Base {
  name = undefined;
	code = undefined;

  constructor() { super(); }
}
UserGroupRole.modelName = 'UserGroupRole';
module.exports = UserGroupRole;
