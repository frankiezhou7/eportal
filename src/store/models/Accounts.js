const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class Accounts extends BasePageable {
  constructor() { super(); }
}
Accounts.modelName = 'Accounts';
Accounts.ENTRY_TYPE = 'Account';

module.exports = Accounts;
