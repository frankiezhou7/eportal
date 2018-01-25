const domain = require('../../domain');
const entriesReducer = require('./country-entries');
const listReducer = require('./country-list');
const { Map, fromJS } = require('epimmutable');

module.exports = function country_reducer(state, action) {
  return state.withMutations(s => {
    s.set('list', listReducer(s.get('list'), action));
    s.set('entries', entriesReducer(s.get('entries'), action));
  });
}
