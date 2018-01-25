const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class VoyageSegments extends BasePageable {
  constructor() { super(); }
}
VoyageSegments.modelName = 'VoyageSegments';
VoyageSegments.ENTRY_TYPE = 'VoyageSegment';

module.exports = VoyageSegments;
