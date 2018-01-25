const { List, Map, fromJS } = require('epimmutable');
const cache = require('~/src/cache');
const domain = require('../../domain');
const _ = require('eplodash');

module.exports = function userGroupReducer(state = Map(), { type, payload }) {
  let entries = state.get('entries');
  let response = payload && payload.response;
  let request = payload && payload.request;
  let id = request && request.id;
  let error = payload && payload.error;
  let entry, index;

  switch (type) {
    case 'CREATE_USER_GROUP': {
      entry = domain.create('UserGroup', response)
        .setMetas('loading', false, 'error', null);
      entries = entries.push(entry);

      return state.set('entries', entries);
    }
    case 'CREATE_USER_GROUP_LOADING': {
      return state.setMetas('loading', true, 'error', null);
    }
    case 'CREATE_USER_GROUP_FAIL': {
      return state.setMetas('loading', false, 'error', error);
    }
    // case 'UPDATE_USER_GROUP_BY_ID': {
    //   let index = _.findIndex(entries.toJS(), {_id: id});
    //   entry = domain.create('UserGroup', response);
    //   state = state.setIn(['entries', index], entry);
    //   return state;
    // }
    // case 'UPDATE_USER_GROUP_BY_ID_LOADING': {
    //   return state.setMetas('loading', true, 'error', null);
    // }
    // case 'UPDATE_USER_GROUP_BY_ID_FAIL': {
    //   return state.setMetas('loading', false, 'error', error);
    // }
    // case 'REMOVE_USER_GROUP_BY_ID': {
    //   let index = _.findIndex(entries.toJS(), {_id: id});
    //   state = state.remove(index);
    //   return state;
    // }
    // case 'REMOVE_USER_GROUP_BY_ID_LOADING': {
    //   return state.setMetas('loading', true, 'error', null);
    // }
    // case 'REMOVE_USER_GROUP_BY_ID_FAIL': {
    //   return state.setMetas('loading', false, 'error', error);
    // }
    case 'FIND_USER_GROUPS_BY_OWNER': {
      state = domain.create('UserGroups', response)
        .setMetas('loading', false, 'error', null)
      return state;
    }
    case 'FIND_USER_GROUPS_BY_OWNER_LOADING': {
      return state.setMetas('loading', true, 'error', null);
    }
    case 'FIND_USER_GROUPS_BY_OWNER_FAIL': {
      return state.setMetas('loading', false, 'error', error);
    }
    default:
      return state;
  }
}
