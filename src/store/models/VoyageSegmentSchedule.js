const _ = require('eplodash');
const Base = require('./Base');

class VoyageSegmentSchedule extends Base {
  user = undefined;
  date = undefined;
  timePoints = undefined;
  constructor() { super(); }
}
VoyageSegmentSchedule.modelName = 'VoyageSegmentSchedule';
VoyageSegmentSchedule.fromJS = function(obj) {
  if(!obj) { return obj; }

  obj.timePoints = this.domain.toModel(obj.timePoints, 'VoyageSegmentScheduleTimePoints');

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = VoyageSegmentSchedule;
