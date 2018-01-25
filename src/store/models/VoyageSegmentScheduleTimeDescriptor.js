const _ = require('eplodash');
const Base = require('./Base');

class VoyageSegmentScheduleTimeDescriptor extends Base {
  time = undefined;
  period = undefined;
  estimated = undefined;
  constructor() { super(); }
}
VoyageSegmentScheduleTimeDescriptor.modelName = 'VoyageSegmentScheduleTimeDescriptor';
module.exports = VoyageSegmentScheduleTimeDescriptor;
