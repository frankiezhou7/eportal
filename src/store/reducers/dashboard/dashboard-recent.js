const { Map, fromJS } = require('epimmutable');
const domain = require('../../domain');
const cache = require('~/src/cache');

module.exports = function dashboard_recent_reducer(state = Map(), {type, payload}) {
  switch (type) {
    case 'GET_RECENT_ORDERS_FOR_EACH_SHIP': {
      const response = payload && payload.response;
      const pagination = response && response.pagination;
      const cursor = pagination && pagination.cursor;
      const size = pagination && pagination.size;
      const firstPage = cursor <= size;

      if(firstPage) return fromJS(response).setMetas('loading', false, 'error', null);

      let recent = state.toJS();
      recent.pagination = response.pagination;
      recent.entries = recent.entries.concat(response.entries);
      return fromJS(recent).setMetas('loading', false, 'error', null);
    }
    case 'GET_RECENT_ORDERS_FOR_EACH_SHIP_LOADING': {
      state = state.setMetas('loading', true, 'error', null);
      return state;
    }
    case 'GET_RECENT_ORDERS_FOR_EACH_SHIP_FAIL': {
      state = state.setMetas('loading', false, 'error', payload.error);
      return state;
    }
    default:
      return state;
  }
}
