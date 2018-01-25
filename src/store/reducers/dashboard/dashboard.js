const { Map, fromJS } = require('epimmutable');
const domain = require('../../domain');
const recentReducer = require('./dashboard-recent');

module.exports = function dashboard_reducer(state = Map(), action) {
  return state.withMutations(s => {
    s.set('recent', recentReducer(s.get('recent'), action));
  });
}
