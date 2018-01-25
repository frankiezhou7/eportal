const { Map } = require('epimmutable');
const navigationReducer = require('./navigation');

module.exports = function clientReducer(state = Map(), action) {
  return state.withMutations(s => {
    s.set('navigation', navigationReducer(s.get('navigation'), action));
  });
};
