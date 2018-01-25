const { List, Map } = require('epimmutable');
const domain = require('../../domain');
const { createEntityCollectionReducer } = require('epui-reducer');

const config = {
  'updateVoyageSegmentById':null,
};
const listReducerAutoCreate = createEntityCollectionReducer('VoyageSegment', config, false,'List');

module.exports = function voyage_segment_reducer(state = Map(), action) {
  const {
    type,
    payload,
  } = action;

  let request = payload && payload.request;
  let id = request && request.id;
  let response = payload && payload.response;
  let pagination = response && response.pagination;
  let error = payload && payload.error;
  let entries = state.get('entries');
  let entry, index, schedule;

  switch (type) {
    case 'CREATE_VOYAGE_SEGMENT': {
      entry = domain.create('VoyageSegment', response)
        .setMetas('loading', false, 'error', null);
      entries = entries.unshift(entry);

      return state.set('entries', entries);
    }
    case 'CREATE_VOYAGE_SEGMENT_LOADING': {
      return state.setMetas('loading', true, 'error', null);
    }
    case 'CREATE_VOYAGE_SEGMENT_FAIL': {
      return state.setMetas('loading', false, 'error', error);
    }
    case 'FIND_VOYAGE_SEGMENTS_BY_SHIP_ID': {
      const cursor = pagination && pagination.cursor;
      const size = pagination && pagination.size;
      const firstPage = cursor <= size;

      state = firstPage ? domain.create('VoyageSegments', response)
        .setMetas('loading', false, 'error', null) :
        state.concat(response)
        .setMetas('loading', false, 'error', null);

      return state;
    }
    case 'FIND_VOYAGE_SEGMENTS_BY_SHIP_ID_LOADING': {
      const cursor = pagination && pagination.cursor;
      const size = pagination && pagination.size;
      const firstPage = cursor <= size;

      state = firstPage ? domain.create('VoyageSegments', {})
        .setMetas('loading', true, 'error', null) :
        state.setMetas('loading', true, 'error', null);

      return state;
    }
    case 'FIND_VOYAGE_SEGMENTS_BY_SHIP_ID_FAIL': {
      return state.setMetas('loading', false, 'error', error);
    }
    case 'UPDATE_SCHEDULE_BY_SEGMENT_ID': {
      index = entries.findIndex(e => id = e.get('_id'));
      schedule = domain.create('VoyageSegmentSchedule', response);
      state = state.setIn(['entries', index, 'schedule'], schedule);

      return state;
    }
    case 'UPDATE_SCHEDULE_BY_SEGMENT_ID_LOADING': {
      return state;
    }
    case 'UPDATE_SCHEDULE_BY_SEGMENT_ID_FAIL': {
      return state;
    }
    default:
      return state.withMutations(s => {
         s.set('entries', listReducerAutoCreate(s.get('entries'), action));
      });
  }
}
