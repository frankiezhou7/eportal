const { List, Map, fromJS } = require('epimmutable');
const cache = require('~/src/cache');
const domain = require('../../domain');
const {createMultiRemoteActionsReducer} = require('epui-reducer');

const Config = {
  'getInvitationLetterTypes': function(entity, payload) {
    cache.set(cache.INVITATION_LETTER_TYPES, payload.response);
    entity = domain.create('List<InvitationLetterType>', payload.response)
      .setMetas('loading', false, 'error', null);
    return entity;
  }
};

const reducer = createMultiRemoteActionsReducer('List<InvitationLetterType>', Config, true);

module.exports = reducer;
