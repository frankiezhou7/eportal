const _ = require('eplodash');
const { Map, List, fromJS } = require('epimmutable');
const domain = require('../../domain');

module.exports = {
  config: {
    'acceptOrder': null,
    'addOrderEntryToOrder': null,
    'beginExecuteOrder': null,
    'calculateOrderEntryFee': '$mergeCosts',
    'cancelOrder': null,
    'closeOrder': null,
    'confirmOrder': null,
    'endExecuteOrder': null,
    'findOrderById': null,
    'quoteOrder': null,
    'rejectOrder': null,
    'removeOrderEntryFromOrder': null,
    'setOrderConsignee': '$mergeOrder',
    'setOrderConsigner': '$mergeOrder',
    'updateEmailSettings': '$mergeOrder',
    'updateOrderConfig': '$mergeCosts',
    'updateOrderEntryCostItems': '$mergeCosts',
    'updateProductConfigForOrderAndCalculateOrderEntryFee': '$mergeCosts',
    'updateProductConfigForOrderAndUpdateOrderEntryCostItems': '$mergeCosts',
  },
  collConfig: {
    'createOrder': (state, payload) => {
      let response = payload && payload.response;

      return state.unshift(domain.create('Order', response))
        .setMetas('loading', false, 'error', null);
    },
  },
};
