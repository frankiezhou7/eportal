const _ = require('eplodash');
const Base = require('./Base');
const constants = require('~/src/shared/constants');
const ACCOUNT_MANAGEMENT = constants.ACCOUNT_MANAGEMENT;
const ORDER_PERMISSION_AGENCY = constants.ORDER_PERMISSION_AGENCY;
const ORDER_PERMISSION_PRINCIPAL = constants.ORDER_PERMISSION_PRINCIPAL;

class User extends Base {
  username = undefined;
  status = undefined;
  photo = undefined;
  photoURL = undefined;
  fullname = undefined;
  name = undefined;
  position = undefined;
  roles = undefined;
  dateUpdate = undefined;
  emergencyEmail = undefined;
  emergencyPhone = undefined;
  emergencyMobile = undefined;
  isSuperAdmin = undefined;
  __v = undefined;

  constructor() { super(); }

  isAnonymous() {
    return !this._id;
  }

  getPosition() {
    return this.position;
  }

  getGroup() {
    return this.position && this.position.group;
  }

  getAccountManagement() {
    if(!this.position) { return null; }
    let accMngt = _.get(this.position, ['group', 'accountManagement']);
    if(!accMngt) { return null; }
    accMngt = accMngt.split('');
    let access = {};
    _.forEach(ACCOUNT_MANAGEMENT, (role, index) => {
      access[role] = !!parseInt(accMngt[index]);
    });
    return access;
  }

  getOrderPermission() {
    if(!this.position) { return null; }
    let orderPerm = _.get(this.position, ['group', 'orderPermission']);
    if(!orderPerm) { return null; }
    orderPerm = orderPerm.split('');
    let access = {};
    if(this.getAccountType() === 'AGENCY'){
      _.forEach(ORDER_PERMISSION_AGENCY, (permission, index) => {
        access[permission] = !!parseInt(orderPerm[index]);
      });
    }else if(this.getAccountType() === 'PRINCIPAL'){
      _.forEach(ORDER_PERMISSION_PRINCIPAL, (permission, index) => {
        access[permission] = !!parseInt(orderPerm[index]);
      });
    }
    return access;
  }

  getAccount() {
    if(!this.position) { return null; }
    return this.position.group && this.position.group.account;
  }

  hasRole(roles) {
    if(!this.roles) { return false; }

    if(!_.isArray(roles)) {
      roles = [roles];
    }

    for(let role of roles) {
      if(this.roles.find(r => r.get('code') === role)) { return true; }
    }

    return false;
  }

  hasAccess(resource, ...names) {
    if(!this.roles) { return false; }

    for(let role of this.roles) {
      for(let rule of role.get('rules')) {
        const r = rule.get('resource');
        const n = rule.get('name');
        if(r === resource && _.includes(names, n)) {
          return true;
        }
      }
    }

    return false;
  }

  getAccountType() {
    let acc = this.getAccount();
    let type = '';
    let isAgency = _.includes(acc.get('types').toJS(),'consignee');
    let isPrincipal = _.includes(acc.get('types').toJS(),'consigner');
    if(isAgency) { type = 'AGENCY' };
    if(isPrincipal) { type = 'PRINCIPAL' };
    return type;
  }
}
User.modelName = 'User';
User.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }

  obj.position = obj.position ? this.domain.toModel(obj.position, 'UserPosition') : undefined;

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = User;
