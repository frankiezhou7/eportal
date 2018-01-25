const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class Users extends BasePageable {
  constructor() { super(); }
}
Users.modelName = 'Users';
Users.ENTRY_TYPE = 'User';

module.exports = Users;
