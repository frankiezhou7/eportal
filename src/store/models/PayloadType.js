const _ = require('eplodash');
const Base = require('./Base');

class PayloadType extends Base {
  __v = undefined;
  _id = undefined;
  code = undefined;
  name = undefined;
  constructor() { super(); }
}
PayloadType.modelName = 'PayloadType';
module.exports = PayloadType;
