const { Map } = require('epimmutable');
const cache = require('~/src/cache');
const domain = require('../domain');
const { SET_SESSION, CLEAR_SESSION } = require('../actions/session');
const { LOGOFF } = require('~/src/store/actions/user');

module.exports = function sessionReducer(session, action) {
  let { type, payload } = action;
  return session.withMutations(s => {
    if (type === LOGOFF) {
      s.set('loggingOut', true);
    } else if (type === 'LOGOUT_LOADING') {
      s.set('loggingOut', true);
      return;
    } else if (type === 'LOGOUT') {
      cache.remove(cache.SESSION_ID);
      s.set('account', null);
      s.set('user', null);
      s.set('initialized', true);
      s.set('loggingOut', false);
      return;
    } else if (type === 'LOGOUT_FAIL') {
      cache.remove(cache.SESSION_ID);
      s.set('account', null);
      s.set('user', null);
      s.set('loggingOut', false);
      return;
    }

    let user = require('./user')(session.get('user'), action);
    s.set('user', user);
    if(!user) { return; }

    let accountId = user.getIn(['position', 'group', 'account', '_id']);
    if(!accountId) { return; }
    if (type === 'FIND_ACCOUNT_BY_ID_LOADING') {
      s.set('account', domain.create('Account', {}).setMetas('loading', true, 'error', null));
    }
    if(type === 'FIND_ACCOUNT_BY_ID' && accountId === payload.response._id) {
      s.set('account', domain.create('Account', payload.response).setMetas('loading', false, 'error', null));
    }
    if (type === 'FIND_ACCOUNT_BY_ID_FAIL') {
      s.set('account', domain.create('Account', {}).setMetas('loading', false, 'error', payload.error));
    }
  });
}
