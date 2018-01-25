const { Map } = require('epimmutable');

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

let initialState = {
  locationBeforeTransitions: null
};

module.exports = function routerReducer(state = initialState, { type, payload }) {
  if (type === LOCATION_CHANGE) {
    return {
      locationBeforeTransitions: payload
    };
  }

  return state
};
