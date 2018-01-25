const { Map, fromJS } = require('epimmutable');
const cache = require('~/src/cache');
const domain = require('../../domain');

module.exports = function payload_type_list_reducer(state, { type, payload }) {
  switch (type) {
    case 'LIST_PAYLOAD_TYPES':
      cache.set(cache.PAYLOAD_TYPE_LIST, payload.response);
      return domain.create('List<PayloadType>', payload.response)
        .setMetas('loading', false, 'error', null);
    case 'LIST_PAYLOAD_TYPES_LOADING':
      return domain.create('List<PayloadType>', [])
        .setMetas('loading', true, 'error', null);
    case 'LIST_PAYLOAD_TYPES_FAIL':
      return state.setMetas('loading', false, 'error', payload.error);
    default:
      return state;
  }
}
