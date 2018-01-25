const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class Ports extends BasePageable {
  constructor() { super(); }
}
Ports.modelName = 'Ports';
Ports.ENTRY_TYPE = 'Port';

module.exports = Ports;
