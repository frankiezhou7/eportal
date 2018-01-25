const _ = require('eplodash');
const { Map, List, fromJS } = require('epimmutable');
const domain = require('../../domain');

module.exports = {
  config: {
    // 'resetPagination': null,
  },
  collConfig: {
    // 'publishChattingMsg': (state, payload) => {
    //   let response = payload && payload.response;
    //
    //   return state.push(domain.create('Chat', response))
    //     .setMetas('loading', false, 'error', null);
    // },
  },
};
