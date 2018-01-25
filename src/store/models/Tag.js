const _ = require('eplodash');
const Base = require('./Base');

class Tag extends Base {
  name = undefined;
  value = undefined;
  constructor() { super(); }
}
Tag.modelName = 'Tag';
Tag.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = Tag;
