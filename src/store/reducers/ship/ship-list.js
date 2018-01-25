const { List, Map } = require('epimmutable');
const domain = require('../../domain');

module.exports = function ship_list_reducer(state = List.of([]), { type, payload }) {
  let request = payload && payload.request;
  let response = payload && payload.response;
  let id = response && response._id;
  let error = payload && payload.error;
  let index, entry;

  switch (type) {
    case 'FIND_SHIP_BY_ID': {
      index = state.findIndex(s => id === s.get('_id'));
      entry = domain.create('Ship', response)
        .setMetas('loading', false, 'error', null);
      if (index === -1) {
        state = state.push(entry);
      } else {
        state = state.set(index, entry);
      }
      return state;
    }
    case 'FIND_SHIP_BY_ID_LOADING': {
      id = request && request.id;
      index = state.findIndex(s => id === s.get('_id'));
      entry = domain.create('Ship', {_id: id})
        .setMetas('loading', true, 'error', null);
      if (index === -1) {
        state = state.push(entry);
      } else {
        state = state.set(index, entry);
      }

      return state;
    }
    case 'FIND_SHIP_BY_ID_FAIL': {
      id = request && request.id;
      index = state.findIndex(s => id === s.get('_id'));
      entry = domain.create('Ship', {_id: id})
        .setMetas('loading', false, 'error', payload.error);
      if (index === -1) {
        state = state.push(entry);
      } else {
        state = state.set(index, entry);
      }

      return state;
    }
    default:
      return state;
  }
}
