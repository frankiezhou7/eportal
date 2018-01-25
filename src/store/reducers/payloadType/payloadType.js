const domain = require('../../domain');
const listReducer = require('./payloadType-list');
const { Map, fromJS } = require('epimmutable');

module.exports = function payload_type_reducer(state, action) {
  return state.withMutations(s => {
    s.set('list', listReducer(s.get('list'), action));
  });
}
