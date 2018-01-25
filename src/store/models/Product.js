const _ = require('eplodash');
const Base = require('./Base');


class Product extends Base {
  index = undefined;
  description = undefined;
  code = undefined;
  parent=undefined;
  name = undefined;
  costTypes = undefined;
  costTypesConfig = undefined;
  tags = undefined;
  categories = undefined;
  constructor() { super(); }

  isForOrderType(type) {
    if(!this.tags) { return false; }
    return this.hasTag('OrderType', type);
  }

  isInCategory(cate) {
    if(!this.tags) { return false; }
    return this.hasTag('Category', cate);
  }

  hasTag(name, value) {
    if(!this.tags) { return null; }
    return !!this.tags.find(tag => tag.name === name && tag.value === value);
  }
}

Product.modelName = 'Product';
Product.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }

  if (obj.costTypes && obj.costTypes.length > 0 && !_.isString(obj.costTypes[0])) {
    obj.costTypes = this.domain.toList(obj.costTypes, 'ProductCostType');
  }
  obj.tags = obj.tags && this.domain.toList(obj.tags, 'Tag');

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = Product;
