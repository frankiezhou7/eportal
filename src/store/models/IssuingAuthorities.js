const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class IssuingAuthorities extends BasePageable {
  constructor() {
    super();
  }
}
IssuingAuthorities.modelName = 'IssuingAuthorities';
IssuingAuthorities.ENTRY_TYPE = 'IssuingAuthority';

module.exports = IssuingAuthorities;
