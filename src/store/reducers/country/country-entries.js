const cache = require('~/src/cache');
const domain = require('../../domain');
const { COUNTRY_ENTRIES } = cache;
const { Map } = require('epimmutable');

module.exports = function countries_entries_reducer(state = Map(), {type, payload}) {
  switch (type) {
    case 'FIND_COUNTRY_BY_ID': {
      let id = payload.response._id;
      state = state.set(id, domain.create('Country', payload.response))
        .setMetasIn(id, 'loading', false, 'error', null);
      cache.set(COUNTRY_ENTRIES, state.toJS());
      return state;
    }
    case 'FIND_COUNTRY_BY_ID_LOADING': {
      let id = payload.request.id;
      return state.set(id, domain.create('Country', {})
        .setMetasIn(id, 'loading', true, 'error', null))
    }
    case 'FIND_COUNTRY_BY_ID_FAIL': {
      let id = payload.request.id;
      return state.setMetasIn(id, 'loading', false, 'error', payload.error);
    }
    default:
      return state;
  }
}
