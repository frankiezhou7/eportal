const domain = require('../../domain');
const { List, Map, fromJS } = require('epimmutable');
const { createMultiRemoteActionsReducer } = require('epui-reducer');

const Config = {
  'searchShips': function(entity, payload) {
    entity = domain.create('Ships', payload.response)
      .setMetas('loading', false, 'error', null);
    return entity;
  }
};

module.exports = createMultiRemoteActionsReducer('Ships', Config, true);
