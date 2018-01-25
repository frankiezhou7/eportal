const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class InvitationLetterTypes extends BasePageable {
  constructor() {
    super();
  }
}
InvitationLetterTypes.modelName = 'InvitationLetterTypes';
InvitationLetterTypes.ENTRY_TYPE = 'InvitationLetterType';

module.exports = InvitationLetterTypes;
