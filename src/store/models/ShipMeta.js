const _ = require('eplodash');
const Base = require('./Base');
const Map = alt.Map;


class ShipMeta extends Base {
  __v = undefined;
  _id = undefined;
  imo = undefined;
  name = undefined;
  nationality = {
    code: null,
    name: null,
  };
  sizeType = {
    code: null,
    name: null,
  };
  type = {
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
}
ShipMeta.modelName = 'ShipMeta';
ShipMeta.fromJS = function(obj) {
  if(!obj) { return obj; }

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = ShipMeta;
