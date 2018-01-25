const listReducer = require('./ship-list');

module.exports = function ship_reducer(state, action) {
  return state.withMutations(s => {
    s.set('list', listReducer(s.get('list'), action));
  });
}
