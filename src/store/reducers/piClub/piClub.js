const { List, Map, fromJS } = require('epimmutable');
const cache = require('~/src/cache');
const domain = require('../../domain');
const {createMultiRemoteActionsReducer} = require('epui-reducer');

const Config = {
  'getPiClubs': function(entity, payload) {
    cache.set(cache.PI_CLUBS, payload.response);
    entity = domain.create('List<Enum>', payload.response)
      .setMetas('loading', false, 'error', null);
    return entity;
  }
};

const reducer = createMultiRemoteActionsReducer('List<Enum>', Config, true);

module.exports = reducer;
