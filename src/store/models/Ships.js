const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class Ships extends BasePageable {
  constructor() { super(); }
}
Ships.modelName = 'Ships';
Ships.ENTRY_TYPE = 'Ship';

module.exports = Ships;
