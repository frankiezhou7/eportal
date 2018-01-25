const { Map, fromJS } = require('epimmutable');
const {createMultiRemoteActionsReducer} = require('epui-reducer');

const config = {
  'findOrderFeedback': '$setOrderFeedback',
  'replyFeedback': '$replyFeedback',
  'pubFeedback': '$pubFeedback'
};

module.exports = createMultiRemoteActionsReducer('Feedbacks', config, true);
