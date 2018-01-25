const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class Settings extends BasePageable {
  constructor() { super(); }
}
Settings.modelName = 'Settings';
Settings.ENTRY_TYPE = 'Setting';

module.exports = Settings;
