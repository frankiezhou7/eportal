const { Map, fromJS } = require('epimmutable');
const _ = require('eplodash');
const cache = require('~/src/cache');
const DEFAULT_PHOTO_URL = require('~/src/app/images/default.png');
const { RESET } = require('~/src/store/actions/user');

module.exports = function local_reducer(state = Map(), { type, payload }) {
  let local = cache.get(cache.LOCAL);
  let error = payload && payload.error;

  switch (type) {
    case 'LOGIN_FAIL': {
      return state.withMutations(s => {
        s.set('username', local && local.username);
        s.set('photo', local && local.photo);
        s.set('photoURL', (local && local.photoURL) || DEFAULT_PHOTO_URL);
        s.set('fullname', local && local.fullname);
        s.set('quick', local && !!(local.username && local.fullname));
        s.set('error', error);
        s.set('accountManagement', null);
      });
    }
    case RESET: {
      return state.withMutations(s => {
        s.set('username', null);
        s.set('photo', null);
        s.set('photoURL', DEFAULT_PHOTO_URL);
        s.set('fullname', null);
        s.set('quick', false);
        s.set('error', null);
        s.set('accountManagement', null);
      });
    }
    default:
      return state.withMutations(s => {
        s.set('username', local && local.username);
        s.set('photo', local && local.photo);
        s.set('photoURL', (local && local.photoURL) || DEFAULT_PHOTO_URL);
        s.set('fullname', local && local.fullname);
        s.set('quick', local && !!(local.username && local.fullname));
        s.set('error', local && local.error);
        s.set('accountManagement', _.get(local, ['position', 'group', 'accountManagement']));
      });
  }
}
