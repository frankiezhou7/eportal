const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class Products extends BasePageable {
  constructor() { super(); }
}
Products.modelName = 'Products';
Products.ENTRY_TYPE = 'Product';

module.exports = Products;
