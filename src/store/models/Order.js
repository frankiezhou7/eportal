const _ = require('eplodash');
const Base = require('./Base');
const invariant = require('fbjs/lib/invariant');
const statusable = require('./mixins/statusable');
const warning = require('fbjs/lib/warning');
const { List } = require('epimmutable');

const ORDER_ENTRY_STATUS = require('./constants').ORDER_ENTRY_STATUS;
const STATUS = require('./constants').ORDER_STATUS;

class Order extends Base {
  orderNumber= undefined;
  type = undefined;
  ship = undefined;
  segment = undefined;
  consigner = undefined;
  consignee = undefined;
  status = undefined;
  orderEntries = undefined;
  settings = undefined;
  config = undefined;
  email = undefined;
  totalAmountEstimated = undefined;
  totalAmountConfirmed = undefined;
  totalAmountFinal = undefined;
  __v = undefined;
  dateCreate = undefined;
  cancelReason = undefined;
  rejectReason = undefined;
  parent = undefined;
  child = undefined;
  currentExchange = undefined;
  constructor() {
    super();

    statusable(this, STATUS);

    _.forOwn(ORDER_ENTRY_STATUS, (val, key) => {
      let name = _.upperFirst(_.camelCase(key));

      this[`hasAll${name}`] = function() {
        let entries = this.orderEntries;
        if (!entries || entries.size <= 0) {
          return false;
        }
        for (let entry of entries) {
          if (entry.status !== val) {
            return false;
          }
        }
        return true;
      };

      this[`hasAny${name}`] = function() {
        let entries = this.orderEntries;
        if (!entries || entries.size <= 0) {
          return false;
        }
        for (let entry of entries) {
          if (entry.status === val) {
            return true;
          }
        }
        return false;
      };

    });
  }

  getOrderEntryStatuses() {
    let obj = this.getOrderEntryStatusCount();
    return _(obj)
      .keys()
      .map(a => Number(a))
      .sortBy()
      .value();
  }

  getOrderEntryStatusCount() {
    let entries = this.orderEntries;
    if (!entries || entries.size <= 0) {
      return [];
    }

    let status = {};
    for (let entry of entries) {
      let c = status[entry.status] || 0;
      status[entry.status] = c + 1;
    }
    return status;
  }

  hasAllBeyond(status) {
    let entries = this.orderEntries;
    if (!entries || entries.size <= 0) {
      return false;
    }

    for (let entry of entries) {
      if (entry.status <= status) {
        return false;
      }
    }
    return true;
  }

  hasAnyBeyond(status) {
    let entries = this.orderEntries;
    if (!entries || entries.size <= 0) {
      return false;
    }

    for (let entry of entries) {
      if (entry.status > status) {
        return true;
      }
    }
    return false;
  }

  hasProduct(prodCode) {
    return !!this.orderEntries.find(it=>it.product.code === prodCode);
  }

  getCost() {
    return {
      cost: this.getActCost(),
      est: this.getEstCost(),
    };
  }

  getActCost() {
    if (!this.orderEntries) {
      return 0;
    }
    return this.orderEntries.reduce((sum, entry) => {
      return sum + entry.getActCost();
    }, 0);
  }

  getEstCost() {
    if (!this.orderEntries) {
      return 0;
    }
    return this.orderEntries.reduce((sum, entry) => {
      return entry.status === ORDER_ENTRY_STATUS.CANCELLED ? sum : sum + entry.getEstCost();
    }, 0);
  }

  renderPrice(price) {
    let num = Number(price);
    if (_.isNaN(price)) {
      return null;
    }
    //TODO: 根据订单货币类型渲染价格
    return 'USD ' + num.toFixed(2);
  }

  updateNotificationSettings(settings) {
    global.api.order.updateEmailSettings(this._id, settings);
  }

  /**
   * Methods for store
   */
  $push(orderEntry) {
    if(!this.domain.instanceof('OrderEntry', orderEntry)) { return this; }
    let entries = this.orderEntries || List();
    entries = entries.push(orderEntry);
    return this.set('orderEntries', entries);
  }

  $remove(orderEntry) {
    if(!orderEntry || !orderEntry._id || !this.orderEntries) { return this; }
    let id = orderEntry._id;
    let idx = this.orderEntries.findIndex((entry) => {
      return entry._id === id;
    });

    if(idx < 0) { return this; }

    let ref = this.set('orderEntries', this.orderEntries.delete(idx));
    return ref;
  }

  $mergeOrder(order) {
    if (!order) {
      return this;
    }
    order = this.domain.create('Order', order);

    let rec = this.asMutable();
    order.forEach((v, k) => {
      if (_.isUndefined(v)) {
        return;
      }
      rec.set(k, v);
    });

    return rec.asImmutable();
  }

  $mergeCosts(order) {
    order = this.domain.create('Order', order);
    let old = this.asMutable();
    old.totalAmountEstimated = order.totalAmountEstimated;
    old.totalAmountConfirmed = order.totalAmountConfirmed;
    old.totalAmountFinal = order.totalAmountFinal;
    if(order.config) old.config = order.config;
    let entries = order.orderEntries;
    let merged = old.orderEntries.map(function(entry) {
      let found = entries.find(e => entry._id === e._id);
      if (!found) {
        return entry;
      }
      entry = entry.asMutable();
      entry.amountInitial = found.amountInitial;
      entry.amountEstimated = found.amountEstimated;
      entry.amountConfirmed = found.amountConfirmed;
      entry.amountFinal = found.amountFinal;
      entry.costItems = found.costItems;
      entry.costItemsEstimated = found.costItemsEstimated;
      entry.__v = found.__v;
      entry.productConfig = entry.productConfig.$mergeProductConfig(found.productConfig);
      return entry.asImmutable();
    });

    old.orderEntries = merged;
    old.__v = order.__v;
    return old.asImmutable();
  }

  $mergeEntries(entries) {
    let merged = this.orderEntries.map(function(entry) {
      let found = entries.find((e) => entry._id === e._id);
      if (!found) {
        return entry;
      }
      entry = entry.asMutable()
      found.forEach((v, k) => {
        if (k === '_id' || _.isUndefined(v)) {
          return;
        }
        entry.set(k, v);
      });
      return entry.asImmutable();
    });

    if (merged === this.orderEntries) {
      return this;
    }

    return this.set('orderEntries', merged)
  }

  /**
   * Status related
   */
  // canSetStatus(status) {
  //   //TODO: 检查是否可以改变状态
  //   return true;
  // }
  //
  // setStatus(status) {
  //   let current = this.status;
  //   if (current === status) {
  //     return;
  //   }
  //   let valid = _.includes(_.values(STATUS), status);
  //
  //   invariant(valid, `value ${status} is invalid as an Order status`);
  //
  //   global.api.order.setOrderStatus(this._id, status);
  // }

  //entryIds为订单项ID数组
  confirm(entryIds,state) {
    if (!entryIds) {
      entryIds = this.orderEntries.map(o => o._id).toJS();
    }
    global.api.order.confirmOrder(this._id, this.__v, entryIds,state);
  }

  quote(entryIds,state) {
    if (!entryIds) {
      entryIds = this.orderEntries.map(o => o._id).toJS();
    }
    global.api.order.quoteOrder(this._id, this.__v, entryIds,state);
  }

  accept(entryIds,state) {
    if (!entryIds) {
      entryIds = this.orderEntries.map(o => o._id).toJS();
    }
    global.api.order.acceptOrder(this._id, this.__v, entryIds,state);
  }

  reject(entryIds, rejctReason,state) {
    if (!entryIds) {
      entryIds = this.orderEntries.map(o => o._id).toJS();
    }
    global.api.order.rejectOrder(this._id, this.__v, entryIds, rejctReason,state);
  }

  beginExecute(entryIds,state) {
    if (!entryIds) {
      entryIds = this.orderEntries.map(o => o._id).toJS();
    }
    global.api.order.beginExecuteOrder(this._id, this.__v, entryIds,state);
  }

  endExecute(entryIds,state) {
    if (!entryIds) {
      entryIds = this.orderEntries.map(o => o._id).toJS();
    }
    global.api.order.endExecuteOrder(this._id, this.__v, entryIds,state);
  }

  close(state) {
    global.api.order.closeOrder(this._id, this.__v,state);
  }

  cancel(cancelReason,state) {
    global.api.order.cancelOrder(this._id, this.__v, cancelReason,state);
  }

  refresh(){
    global.api.order.findOrderById(this._id);
  }

  /**
   * Actions
   */
  // update(partial) {
  //   global.api.order.updateOrder(this._id, partial);
  // }

  setConsignee(orgId) {
    global.api.order.setOrderConsignee(this._id, orgId);
  }

  setConsigner(orgId) {
    global.api.order.setOrderConsigner(this._id, orgId);
  }

  createOrderEntry(entry) {
    global.api.order.addOrderEntryToOrder(this._id, entry, this.__v);
  }

  removeOrderEntry(entry) {
    global.api.order.removeOrderEntryFromOrder(this._id, entry._id, entry.__v, this.__v);
  }
  //
  // sendEmail(options) {
  //   global.api.order.sendMail(this._id, options);
  // }
  //
  // remove() {
  //
  // }
}

Order.modelName = 'Order';
Order.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }

  if(obj.type) { obj.type = this.domain.toModel(obj.type, 'OrderType'); }
  if(obj.consigner) { obj.consigner = this.domain.toModel(obj.consigner, 'Organization'); }
  if(obj.consignee) { obj.consignee = this.domain.toModel(obj.consignee, 'Organization'); }
  if(obj.orderEntries) { obj.orderEntries = this.domain.toList(obj.orderEntries, 'OrderEntry'); }
  obj = this.domain.fromJS(obj);

  let Type = this;
  return new Type(obj, this);
};

module.exports = Order;
module.exports.STATUS = STATUS;
