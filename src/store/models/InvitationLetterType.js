const _ = require('eplodash');
const Base = require('./Base');

class InvitationLetterType extends Base {
  _id = undefined;
  code = undefined;
  name = undefined;
  englishName = undefined;
  constructor() {
    super();
  }
}
InvitationLetterType.modelName = 'InvitationLetterType';
InvitationLetterType.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }

  // add customized operations

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = InvitationLetterType;
