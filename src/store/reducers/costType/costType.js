const { List, Map, fromJS } = require('epimmutable');
const cache = require('~/src/cache');
const domain = require('../../domain');
const {createMultiRemoteActionsReducer} = require('epui-reducer');

const Config = {
  'getCostTypes': function(entity, payload) {
    cache.set(cache.COST_TYPE_LIST, payload.response);
    entity = domain.create('List<CostType>', payload.response)
      .setMetas('loading', false, 'error', null);
    return entity;
  }
};

const reducer = createMultiRemoteActionsReducer('List<CostType>', Config, true);

module.exports = reducer;
