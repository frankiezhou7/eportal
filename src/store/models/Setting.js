const _ = require('eplodash');
const Base = require('./Base');
const {Map} = require('epimmutable');

class Setting extends Base {
  _id = undefined;
  __v = undefined;
  name = undefined;
  value = undefined;

  constructor() { super(); }

}
Setting.modelName = 'Setting';
Setting.fromJS = function(obj) {
  if(!obj) { return obj; }

  obj = this.domain.fromJS(obj);
  let Type = this;

  return new Type(obj, true);
}

module.exports = Setting;
