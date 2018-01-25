const { Map, fromJS } = require('epimmutable');
const cache = require('~/src/cache');
const domain = require('../../domain');

module.exports = function countries_list_reducer(state, { type, payload }) {
  switch (type) {
    case 'LIST_COUNTRIES':
      cache.set(cache.COUNTRY_LIST, payload.response);
      return domain.create('List<Country>', payload.response)
        .setMetas('loading', false, 'error', null);
    case 'LIST_COUNTRIES_LOADING':
      return domain.create('List<Country>', [])
        .setMetas('loading', true, 'error', null);
    case 'LIST_COUNTRIES_FAIL':
      return state.setMetas('loading', false, 'error', payload.error);
    default:
      return state;
  }
}
