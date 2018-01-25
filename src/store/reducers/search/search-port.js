const domain = require('../../domain');
const { List, Map, fromJS } = require('epimmutable');
const { createMultiRemoteActionsReducer } = require('epui-reducer');

const Config = {
  'searchPorts': function(entity, payload) {
    entity = domain.create('Ports', payload.response)
      .setMetas('loading', false, 'error', null);
    return entity;
  }
};

module.exports = createMultiRemoteActionsReducer('Ports', Config, true);
