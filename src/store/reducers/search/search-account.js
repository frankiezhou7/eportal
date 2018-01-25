const domain = require('../../domain');
const { List, Map, fromJS } = require('epimmutable');
const { createMultiRemoteActionsReducer } = require('epui-reducer');

const Config = {
  'searchAccounts': function(entity, payload) {
    entity = domain.create('Accounts', payload.response)
      .setMetas('loading', false, 'error', null);
    return entity;
  }
};

module.exports = createMultiRemoteActionsReducer('Accounts', Config, true);
