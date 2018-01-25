const _ = require('eplodash');
const Base = require('./Base');


class ProductConfig extends Base {
  __v = null;
  _id = null;
  order = null;
  orderEntry = null;
  dateCreate = null;
  dateUpdate = null;
  products = null;
  constructor() {
    super();
  }

  refresh(){
    global.api.order.findProductConfigById(this.order,this.orderEntry,this._id);
  }

  $mergeProductConfig(productConfig){
    let old = this.asMutable();
    let products = productConfig.products;
    let merged = old.products.map(function(product) {
      let found = products.find(p => product._id === p._id);
      if (!found) {
        return product;
      }
      product = product.asMutable();
      product.config = found.config;
      product.priceConfig = found.priceConfig;
      product.select = found.select;
      product.__v = found.__v;
      return product.asImmutable();
    });
    old.products = merged;
    old.__v = productConfig.__v;
    return old.asImmutable();
  }
}
ProductConfig.modelName = 'ProductConfig';
ProductConfig.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }
  if(obj.products) { obj.products = this.domain.toList(obj.products, 'ProductConfigProduct'); }
  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = ProductConfig;
