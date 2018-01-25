const _ = require('eplodash');
const invariant = require('fbjs/lib/invariant');
const warning = require('fbjs/lib/warning');
const statusable = require('./mixins/statusable');
const Base = require('./Base');

const STATUS = require('./constants').ORDER_ENTRY_STATUS;


class OrderEntry extends Base {
  order = undefined;
  product = undefined;
  costItems = undefined;
  costItemsEstimated = undefined;
  amountInitial = undefined;
  amountEstimated = undefined;
  amountConfirmed = undefined;
  amountFinal = undefined;
  status = undefined;
  visible = undefined;
  fixed = undefined;
  productConfig = undefined;
  __v = undefined;

  constructor() {
    super();
    statusable(this, STATUS);
  }

  getEstCost() {
    if (!this.costItemsEstimated) {
      return 0;
    }
    return this.costItemsEstimated.reduce((total, item) => {
      return item.amount + total;
    }, 0);
  }

  getActCost() {
    if (!this.costItems) {
      return 0;
    }
    return this.costItems.reduce((total, item) => {
      return item.amount + total;
    }, 0);
  }

  canSetStatus(status) {
    //TODO: 根据当前状态检测是否允许变更为目标状态
    return true;
  }

  calculateOrderEntryFee(orderId, product, portId) {
    global.api.order.calculateOrderEntryFee(orderId, this._id, product, portId);
  }

  setStatus(status, partial) {
    let current = this.status;
    if (current === status) { return; }
    let valid = _.includes(_.values(STATUS), status);
    if (!valid) {
      warning(`value ${status} is invalid as an OrderEntry status`);
      return;
    }
    global.api.order.setOrderEntryStatus(this.order, this._id, status);
  }

  update(obj) {
    global.api.order.updateOrderEntry(this.order, this._id, obj);
  }

  convertCostItemJsToModel(costItemJS) {
    return this.domain.toModel(costItemJS, 'CostItem');
  }

  convertEventItemToModel(eventItem) {
    return this.domain.toModel(eventItem, 'Event');
  }

}

OrderEntry.modelName = 'OrderEntry';
OrderEntry.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }
  if(obj.product) { obj.product = this.domain.toModel(obj.product, 'Product'); }
  if(obj.costItems) { obj.costItems = this.domain.toList(obj.costItems, 'CostItem'); }
  if(obj.costItemsEstimated) { obj.costItemsEstimated = this.domain.toList(obj.costItemsEstimated, 'CostItem'); }
  if(obj.productConfig){ obj.productConfig = this.domain.toModel(obj.productConfig, 'ProductConfig'); }
  obj = this.domain.fromJS(obj);

  let Type = this;
  let orderEntry = new Type(obj, true);
  return orderEntry;
}

module.exports = OrderEntry;
module.exports.STATUS = STATUS;
