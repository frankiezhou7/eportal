const _ = require('eplodash');
const Base = require('./Base');


class Currency extends Base {
  _id = undefined;
  code = undefined;
  name = undefined;
  constructor() {
    super();
  }
}
Currency.modelName = 'Currency';
Currency.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }

  // add customized operations

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = Currency;
