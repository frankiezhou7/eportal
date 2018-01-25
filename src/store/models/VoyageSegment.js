const _ = require('eplodash');
const statusable = require('./mixins/statusable.js')
const Base = require('./Base');

const STATUS = {
  UNKNOWN: 0,
  ON_THE_WAY: 300,
  ARRIVED: 700,
  BERTHED: 1000,
  DEPARTURED: 1500,
  IN_ACCIDENT: 3000,
  CANCELED: -1,
};

class VoyageSegment extends Base {
  __v = undefined;
  _id = undefined;
  ship = undefined;
  departurePort = undefined;
  arrivalPort = undefined;
  nextPort = undefined;
  status = undefined;
  schedule = undefined;
  terminal = undefined;
  shipyard = undefined;
  scheduleHistory = [];
  constructor() {
    super();
    statusable(this, STATUS);
  }

  findOrders() {
    global.api.order.findOrdersBySegmentId(this.ship, this._id);
  }

  updateSchedule(schedule) {
    global.api.order.updateScheduleBySegmentId(this._id, schedule);
  }

  createOrder(order) {
    order = _.merge({
      ship: this.ship,
      segment: this._id,
    }, order);
    global.api.order.createOrder(order);
  }
}
VoyageSegment.modelName = 'VoyageSegment';
VoyageSegment.fromJS = function(obj) {
  if(!obj) { return obj; }

  obj.arrivalPort = this.domain.toModel(obj.arrivalPort, 'Port');
  if(obj.departurePort) {
    obj.departurePort = this.domain.toModel(obj.departurePort, 'Port');
  }
  if(obj.schedule) {
    obj.schedule = this.domain.toModel(obj.schedule, 'VoyageSegmentSchedule');
  }

  //obj.scheduleHistory = obj.scheduleHistory ? this.domain.toList(obj.scheduleHistory, 'VoyageSegmentSchedule') : null;

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
};

module.exports = VoyageSegment;
