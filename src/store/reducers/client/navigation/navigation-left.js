const { Map } = require('epimmutable');
const domain = require('~/src/store/domain');

module.exports = function navigation_left_reducer(state = Map(), { type, payload, src }) {
  if(src !== 'client') { return state; }

  const {
    TOGGLE_LEFT_NAV,
    OPEN_LEFT_NAV,
    CLOSE_LEFT_NAV,
    OPEN_COMBO_SEARCH,
  } = global.cli.navigation;

  switch (type) {
    case OPEN_COMBO_SEARCH:
      return state.set('open', true).set('mode', 'search').set('searchQuery', payload);
    case TOGGLE_LEFT_NAV:
      return state.set('open', payload);
    case OPEN_LEFT_NAV:
      return state.set('open', true);
    case CLOSE_LEFT_NAV:
      return state.set('open', false);
    default:
      return state;
  }
}
