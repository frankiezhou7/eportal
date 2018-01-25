const _ = require('eplodash');
const Base = require('./Base');

class OrderType extends Base {
  name = undefined;
  flag = undefined;
  code = undefined;
  defaults = undefined;

  constructor() { super(); }
}

OrderType.modelName = 'OrderType';
OrderType.fromJS = function(obj) {
  if (!obj) { return obj; }

  obj.defaults = this.domain.toList(obj.orderEntries, 'Product');
  obj = this.domain.fromJS(obj);

  let Type = this;
  return new Type(obj, this);
};

module.exports = OrderType;
