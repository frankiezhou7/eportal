const _ = require('eplodash');
const Base = require('./Base');


class ModelField extends Base {
  children = undefined;
  component = undefined;
  isArray = undefined;
  isNested = undefined;
  layout = undefined;
  name = undefined;
  props = undefined;
  value = undefined;
  constructor() { super(); }
}
ModelField.modelName = 'ModelField';
ModelField.fromJS = function(obj) {
  if(!obj) { return obj; }

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = ModelField;
