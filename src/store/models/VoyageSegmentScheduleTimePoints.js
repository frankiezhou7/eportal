const _ = require('eplodash');
const Base = require('./Base');

class VoyageSegmentScheduleTimePoints extends Base {
  arrival = undefined;
  berth = undefined;
  departure = undefined;
  constructor() { super(); }
}
VoyageSegmentScheduleTimePoints.modelName = 'VoyageSegmentScheduleTimePoints';
VoyageSegmentScheduleTimePoints.fromJS = function(obj) {
  if(!obj) { return obj; }

  obj.arrival = this.domain.toModel(obj.arrival, 'VoyageSegmentScheduleTimeDescriptor');
  obj.berth = this.domain.toModel(obj.berth, 'VoyageSegmentScheduleTimeDescriptor');
  obj.departure = this.domain.toModel(obj.departure, 'VoyageSegmentScheduleTimeDescriptor');

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
};

module.exports = VoyageSegmentScheduleTimePoints;
