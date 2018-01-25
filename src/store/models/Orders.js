const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class Orders extends BasePageable {
  constructor() { super(); }
}
Orders.modelName = 'Orders';
Orders.ENTRY_TYPE = 'Order';

module.exports = Orders;
