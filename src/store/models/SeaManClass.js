const _ = require('eplodash');
const Base = require('./Base');


class SeaManClass extends Base {
  _id = undefined;
  code = undefined;
  name = undefined;
  index = undefined;
  englishName = undefined;
  nakeName = undefined;
  constructor() {
    super();
  }
}
SeaManClass.modelName = 'SeaManClass';
SeaManClass.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }

  // add customized operations

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = SeaManClass;
