const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class UserGroups extends BasePageable {
  constructor() { super(); }
}
UserGroups.modelName = 'UserGroups';
UserGroups.ENTRY_TYPE = 'UserGroup';

module.exports = UserGroups;
