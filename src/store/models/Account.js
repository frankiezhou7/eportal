const _ = require('eplodash');
const Base = require('./Base');


class Account extends Base {
  name = undefined;
  organization = undefined;
  owner = undefined;
  types = undefined;

  constructor() {
    super();
  }

  getOrganization() {
    return this.organization;
  }

  getId(){
    return this._id;
  }

  isOther() {
    return _.compact([this.isConsigner(), this.isConsignee()]).length === 0;
  }

  isConsigner() {
    return this.types && !!this.types.find(t=>t==='consigner');
  }

  isConsignee() {
    return this.types && !!this.types.find(t=>t==='consignee');
  }
}
Account.modelName = 'Account';

Account.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }

  if(obj.organization) {
    obj.organization = this.domain.toModel(obj.organization, 'Organization');
  }
  if(obj.owner) {
    obj.owner = this.domain.toModel(obj.owner, 'UserPosition');
  }

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = Account;
