const { Map, fromJS } = require('epimmutable');
const accountReducer = require('./search-account');
const portReducer = require('./search-port');
const shipReducer = require('./search-ship');
const settingReducer = require('./search-setting');

module.exports = function search_reducer(state = Map(), action) {
  return state.withMutations(s => {
    s.set('account', accountReducer(s.get('account'), action));
    s.set('port', portReducer(s.get('port'), action));
    s.set('ship', shipReducer(s.get('ship'), action));
    s.set('setting', settingReducer(s.get('setting'), action));
  });
}
