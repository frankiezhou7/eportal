const domain = require('../../domain');
const { List, Map, fromJS } = require('epimmutable');
const { createMultiRemoteActionsReducer } = require('epui-reducer');

const Config = {
  'searchSettings': function(entity, payload) {
    entity = domain.create('Settings', payload.response)
      .setMetas('loading', false, 'error', null);
    return entity;
  }
};

module.exports = createMultiRemoteActionsReducer('Settings', Config, true);
