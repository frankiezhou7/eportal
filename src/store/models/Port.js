const _ = require('eplodash');
const Base = require('./Base');
const {Map} = require('epimmutable');

class Port extends Base {
  _id = undefined;
  __v = undefined;
  code = undefined;
  country = {
    code: undefined,
    name: undefined,
  };
  name = undefined;
  localNames = {
    languageCode: undefined,
    name: undefined,
  };
  timeZone = undefined;
  seaMapCode = undefined;
  contactMethods = {
    type: undefined,
    label: undefined,
    value: undefined,
    comment: undefined,
  };
  anchorages = {
    name: undefined,
    region: undefined,
    maxGRT: undefined,
    maxDraft: undefined,
    pilotStation: {
			longitude: undefined,
			latitude: undefined,
			geoHash: undefined,
		}
  };
  reportLines = {
    no: undefined,
    region: undefined,
  };
  terminals = undefined;
  viewModes = Map({
    edit: undefined
  });
  region = undefined;

  constructor() { super(); }

}
Port.modelName = 'Port';
Port.fromJS = function(obj) {
  if(!obj) { return obj; }

  obj = this.domain.fromJS(obj);
  let Type = this;

  return new Type(obj, true);
}

module.exports = Port;
