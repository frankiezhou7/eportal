const { config, collConfig} = require('./order-config');
const domain = require('../../domain');
const { createEntityCollectionReducer } = require('epui-reducer');
const { fromJS, List, Map } = require('epimmutable');

const listReducerAutoCreate = createEntityCollectionReducer('Order', config, collConfig, 'List', false);

module.exports = listReducerAutoCreate;

module.exports = function OrderReducer(state = Map(), action) {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case 'FIND_ORDERS_BY_VOYAGE_SEGMENT_ID': {
      const response = payload && payload.response;
      const pagination = response && response.pagination;
      const cursor = pagination && pagination.cursor;
      const size = pagination && pagination.size;
      const firstPage = cursor <= size;

      state = firstPage ? domain.create('Orders', response)
        .setMetas('loading', false, 'error', null) :
      state.concat(response)
        .setMetas('loading', false, 'error', null);

      return state;
    }
    case 'FIND_ORDERS_BY_VOYAGE_SEGMENT_ID_LOADING': {
      const response = payload && payload.response;
      const pagination = response && response.pagination;
      const cursor = pagination && pagination.cursor;
      const size = pagination && pagination.size;
      const firstPage = cursor <= size;

      state = firstPage ? domain.create('Orders', {})
          .setMetas('loading', true, 'error', null) :
        state.setMetas('loading', true, 'error', null);

      return state;
    }
    case 'FIND_ORDERS_BY_VOYAGE_SEGMENT_ID_FAIL': {
      return state.setMetas('loading', false, 'error', payload.error);
    }
    default: {
      return state.withMutations(s => {
        s.set('entries', listReducerAutoCreate(s.get('entries'), action));
      });
    }
  }
};
