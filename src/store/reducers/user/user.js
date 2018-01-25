const { Map, fromJS } = require('epimmutable');
const cache = require('~/src/cache');
const domain = require('../../domain');
const { RESET } = require('~/src/store/actions/user');

module.exports = function userReducer(state, { type, payload }) {
  let REMOTE_TYPES = [ 'FETCH_ME', 'LOGIN', 'LOGOUT','UPDATE_USER_PROFILE' ];
  let REMOTE_TYPES_LOADING = [ 'FETCH_ME_LOADING', 'LOGIN_LOADING','UPDATE_USER_PROFILE_LOADING' ];
  let REMOTE_TYPES_FAIL = [ 'FETCH_ME_FAIL', 'LOGIN_FAIL', 'LOGOUT_FAIL','UPDATE_USER_PROFILE_FAIL' ];

  if(_.includes(REMOTE_TYPES_LOADING, type)) {
    if(!state) { state = domain.create('User'); }
    return state.setMetas('loading', true);
  } else if(_.includes(REMOTE_TYPES_FAIL, type)) {
    if(!state) { state = domain.create('User'); }
    return state.setMetas('loading', false, 'error', payload);
  } else if(_.includes(REMOTE_TYPES, type)) {
    if(!state) { state = domain.create('User'); }
    state = state.setMetas('loading', false, 'error', null);
  }

  switch (type) {
    case 'FETCH_ME': {
      cache.set(cache.LOCAL, domain.create('User', payload.response));
      return domain.create('User', payload.response);
    }
    case 'LOGIN': {
      cache.set(cache.LOCAL, domain.create('User', payload.response));
      return domain.create('User', payload.response);
    }
    case 'UPDATE_USER_PROFILE': {
      let user = state.toJS();
      _.merge(user,payload.response);
      cache.set(cache.LOCAL, domain.create('User', user));
      return domain.create('User', user);
    }
    case RESET: {
      cache.set(cache.LOCAL, domain.create('User', {}));
      return state;
    }
    default:
      return state;
  }
}
