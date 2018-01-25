const chatReducer = require('./chat');
const { List, Map, fromJS } = require('epimmutable');

module.exports = function chat_list_reducer(state = Map(), action) {
  const {
    type,
    payload,
  } = action;

  let request = payload && payload.request;
  let id = request && request.order;
  return state.withMutations(s => {
    s.set(id, chatReducer(s.get(id), action));
  });
}
