const { Map, fromJS } = require('epimmutable');
const leftReducer = require('./navigation-left');
const rightReducer = require('./navigation-right');

module.exports = function navigation_reducer(state = Map(), action) {
  if(action.src !== 'client') { return state; }

  return state.withMutations(s => {
    s.set('left', leftReducer(s.get('left'), action));
    s.set('right', rightReducer(s.get('right'), action));
  });
}
