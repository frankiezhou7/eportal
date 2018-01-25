const _ = require('eplodash');
const Base = require('./Base');


class ProductConfigProduct extends Base {
  __v = null;
  _id = null;
  product = null;
  config = null;
  priceConfig = null;
  select = null;
  constructor() {
    super();
  }
}
ProductConfigProduct.modelName = 'ProductConfigProduct';
ProductConfigProduct.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }
  if(obj.config) { obj.config = this.domain.toModel(obj.config, 'Config'); }
  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = ProductConfigProduct;
