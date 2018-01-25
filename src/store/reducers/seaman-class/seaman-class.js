const { List, Map, fromJS } = require('epimmutable');
const cache = require('~/src/cache');
const domain = require('../../domain');
const {createMultiRemoteActionsReducer} = require('epui-reducer');

const Config = {
  'getSeamanClasses': function(entity, payload) {
    cache.set(cache.SEAMAN_CLASSES, payload.response);
    entity = domain.create('List<SeaManClass>', payload.response)
      .setMetas('loading', false, 'error', null);
    return entity;
  }
};

const reducer = createMultiRemoteActionsReducer('List<SeaManClass>', Config, true);

module.exports = reducer;
