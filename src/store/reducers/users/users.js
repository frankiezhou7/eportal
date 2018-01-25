const { List, Map, fromJS } = require('epimmutable');
const domain = require('../../domain');
const {createMultiRemoteActionsReducer} = require('epui-reducer');

module.exports = function usersReducer(state = Map(), { type, payload }) {
  switch (type) {
    case 'FIND_USERS_BY_USER_GROUP': {
      state = domain.create('Users', payload.response)
        .setMetas('loading', false, 'error', null)
      return state;
    }
    case 'FIND_USERS_BY_USER_GROUP_LOADING': {
      return state.setMetas('loading', true, 'error', null);
    }
    case 'FIND_USERS_BY_USER_GROUP_FAIL': {
      return state.setMetas('loading', false, 'error', payload.error);
    }
    default:
      return state;
  }
}
