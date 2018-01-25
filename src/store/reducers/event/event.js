const { Map, fromJS } = require('epimmutable');
const domain = require('../../domain');
const {createMultiRemoteActionsReducer} = require('epui-reducer');

const Config = {
  'findOrderEvents': null,
};

const reducer = createMultiRemoteActionsReducer('Events', Config, true);

const pubReducer = function(state, {type, payload}) {
  let response = payload && payload.response;
  let error = payload && payload.error;
  let entries = state.get('entries');
  let event = domain.create('Event', response);
  if (!entries) {
    state = domain.create('Events', {entries: [event]});
  } else {
    entries = entries.unshift(event);
    state = state.set('entries', entries);
  }

  return state;
};

module.exports = function event_reducer(state = Map(), action) {
  switch (action.type) {
    case 'FIND_ORDER_EVENTS':
      return state.withMutations(s => {
        s.set('orderEntryEvents', reducer(s.get('orderEntryEvents'), action));
      });
    case 'PUB_ORDER_EVENT':
      return state.withMutations(s => {
        s.set('orderEntryEvents', pubReducer(s.get('orderEntryEvents'), action));
      });
    default:
      return state;
  }
}
