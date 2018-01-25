const _ = require('eplodash');
const Base = require('./Base');


class ProductCostType extends Base {
  _id = null;
  costType = null;
  index = null;
  defaultVisiable = null;
  isEditable=null;
  tags = null;
  constructor() {
    super();
  }
}
ProductCostType.modelName = 'ProductCostType';
ProductCostType.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }

  if (obj.costType && !_.isString(obj.costType)) {
    obj.costType = this.domain.toModel(obj.costType, 'CostType');
  }

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = ProductCostType;
