const { List, Map, fromJS } = require('epimmutable');
const cache = require('~/src/cache');
const domain = require('../../domain');
const {createMultiRemoteActionsReducer} = require('epui-reducer');

const Config = {
  'getIssuingAuthorities': function(entity, payload) {
    cache.set(cache.ISSUING_AUTHORITY, payload.response);
    entity = domain.create('List<IssuingAuthority>', payload.response)
      .setMetas('loading', false, 'error', null);
    return entity;
  }
};

const reducer = createMultiRemoteActionsReducer('List<IssuingAuthority>', Config, true);

module.exports = reducer;
