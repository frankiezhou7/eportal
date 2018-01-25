const { List, Map, fromJS } = require('epimmutable');
const cache = require('~/src/cache');
const domain = require('../../domain');
const {createMultiRemoteActionsReducer} = require('epui-reducer');

const Config = {
  'getPortTypes': function(entity, payload) {
    cache.set(cache.PORT_TYPES, payload.response);
    entity = domain.create('List<Enum>', payload.response)
      .setMetas('loading', false, 'error', null);
    return entity;
  }
};

const reducer = createMultiRemoteActionsReducer('List<Enum>', Config, true);

module.exports = reducer;
