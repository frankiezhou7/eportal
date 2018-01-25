const { List, Map, fromJS } = require('epimmutable');
const { config, collConfig} = require('./chat-config');
const domain = require('../../domain');
const {createMultiRemoteActionsReducer, createEntityCollectionReducer} = require('epui-reducer');

const listReducerAutoCreate = createEntityCollectionReducer('Chat', config, collConfig, 'List', false);

module.exports = function chat_reducer(state = Map(), action) {
  const {
    type,
    payload,
  } = action;

  let entries = state.get('entries');
  let response = payload && payload.response;
  let request = payload && payload.request;
  let id = request && request.id;
  let error = payload && payload.error;

  switch (type) {
    case 'FIND_CHATTING_MSG_BY_ORDER': {
      state = domain.create('Chats', response)
        .setMetas('loading', false, 'error', null)
      return state;
    }
    case 'RESET_PAGINATION': {
      state = domain.create('Chats', response)
        .setMetas('loading', false, 'error', null)
      return state;
    }
    case 'FIND_CHATTING_MSG_BY_ORDER_LOADING': {
      return state.setMetas('loading', true, 'error', null);
    }
    case 'FIND_CHATTING_MSG_BY_ORDER_FAIL': {
      return state.setMetas('loading', false, 'error', error);
    }
    // default: {
    //   return state.withMutations(s => {
    //     s.set('pagination', listReducerAutoCreate(s.get('pagination'), action));
    //   });
    // }
  }
}
