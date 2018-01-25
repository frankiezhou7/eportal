const cache = require('~/src/cache');
const domain = require('../../domain');
const { Map, fromJS } = require('epimmutable');
const { createMultiRemoteActionsReducer } = require('epui-reducer');

const Config = {
  'findCurrencies': function(entity, payload) {
    cache.set(cache.CURRENCY_LIST, payload.response);

    return domain.create('Currencies', payload.response)
      .setMetas('loading', false, 'error', null);
  },
};

const reducer = createMultiRemoteActionsReducer('Currencies', Config, true);

module.exports = function currency_reducer(state = Map(), action) {
  return state.withMutations(s => {
    s.set('list', reducer(s.get('list'), action));
  });
}
