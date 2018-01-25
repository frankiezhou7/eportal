const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class PayloadTypes extends BasePageable {
  constructor() { super(); }
}
PayloadTypes.modelName = 'PayloadTypes';
PayloadTypes.ENTRY_TYPE = 'PayloadType';

module.exports = PayloadTypes;
