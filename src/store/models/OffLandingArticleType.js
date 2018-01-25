const _ = require('eplodash');
const Base = require('./Base');


class OffLandingArticleType extends Base {
  _id = null;
  code = null;
  name = null;
  constructor() {
    super();
  }
}
OffLandingArticleType.modelName = 'OffLandingArticleType';
OffLandingArticleType.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }
  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = OffLandingArticleType;
