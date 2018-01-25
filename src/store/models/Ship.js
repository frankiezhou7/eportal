const _ = require('eplodash');
const Base = require('./Base');
const { Map } = require('epimmutable');

class Ship extends Base {
  __v = undefined;
  _id = undefined;
  userCreate = undefined;
  imo = undefined;
  verifyStatus = undefined;
  breadth = {
    moulded: null,
    extreme: null,
  };
  classSocieties = undefined;
  contactMethods = undefined;
  crane = undefined;
  height = {
    toTopMast: null,
    toDesk: null,
    toTopOfHatch: null,
  };
  depth = {
    moulded: null,
    extreme: null,
  };
  dwt = undefined;
  length = {
    overall: null,
    registered: null,
    betweenPerpendiculars: null,
    atWaterLine: null,
    bowToBridge: null,
    bridgeToAft: null,
  };
  loadLines = undefined;
  name = undefined;
  nationality = undefined;
  sizeType = {
    code: null,
    name: null,
  };
  type = {
    _id: null,
    code: null,
    name: null,
  };
  grt = {
    ictm69: null,
    suez: null,
  };
  nrt = {
    ictm69: null,
    suez: null,
  };
  viewModes = Map({
    edit: null
  });
  voyageSegments = undefined;
  activeSegmentId = undefined;
  status = {
    code: null,
    name: null,
  };
  piClub= undefined;
  classNotation= undefined;
  portOfRegistry= {
    code: null,
    name: null,
  };
  officialNo= undefined;
  builder= undefined;
  buildYear= undefined;
  managements = undefined;
  tpc= undefined;
  fwa= undefined;
  displacement= undefined;
  mainEngine= undefined;
  auxEngines= undefined;
  propeller= undefined;
  speed= undefined;
  holds= undefined;
  shipParticular = undefined;

  constructor() { super() }

  update(obj) {
    global.api.order.updateShip(this._id, obj);
  }

  getGRT() {
    return this.getIn(['grt', 'ictm69']);
  }

  getNRT() {
    return this.getIn(['nrt', 'ictm69']);
  }

  getSegment(segId) {
    let segs = this.voyageSegments;
    return segs && segs.getEntry(segId);
  }
}
Ship.modelName = 'Ship';
Ship.fromJS = function(obj) {
  if(!obj) { return obj; }

  obj.voyageSegments = this.domain.toModel(obj.voyageSegments || {}, 'VoyageSegments');

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = Ship;
