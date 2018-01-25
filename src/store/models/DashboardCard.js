const _ = require('eplodash');
const Base = require('./Base');
const Map = alt.Map;


class DashboardCard extends Base {
  __v = undefined;
  _id = undefined;
  consignee = undefined;
  consigner = undefined;
  segment = undefined;
  ship = undefined;
  status = undefined;
  type = undefined;
  isFinished = undefined;
  constructor() { super() }
}
DashboardCard.modelName = 'DashboardCard';
DashboardCard.fromJS = function(obj) {
  if(!obj) { return obj; }

  obj.segment = this.domain.toModel(obj.segment || {}, 'VoyageSegment');
  obj.ship = this.domain.toModel(obj.ship || {}, 'Ship');

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = DashboardCard;
