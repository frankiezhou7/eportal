const _ = require('eplodash');
const Base = require('./Base');


class CostItem extends Base {
  _id = undefined;
  product = undefined;
  parent = undefined;
  description = undefined;
  costType = undefined;
  amount = undefined;
  amountRMB = undefined;
  index = undefined;
  isAdd= undefined;
  variables = undefined;
  note= undefined;
  subName= undefined;
  constructor() {
    super();
  }
}
CostItem.modelName = 'CostItem';
CostItem.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }
  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = CostItem;
