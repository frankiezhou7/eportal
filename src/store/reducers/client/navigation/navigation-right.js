const { Map } = require('epimmutable');
const domain = require('~/src/store/domain');

module.exports = function navigation_right_reducer(state = Map(), { type, payload, src }) {
  if(src !== 'client') { return state; }

  const {
    OPEN_RIGHT_NAV,
    CLOSE_RIGHT_NAV,
    TOGGLE_RIGHT_NAV,
  } = global.cli.navigation;

  switch (type) {
    case OPEN_RIGHT_NAV:
      return state.set('open', true);
    case CLOSE_RIGHT_NAV:
      return state.set('open', false);
    case TOGGLE_RIGHT_NAV:
      return state.set('open', payload);
    default:
      return state;
  }
}
