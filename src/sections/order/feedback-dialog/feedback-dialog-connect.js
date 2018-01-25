const React = require('react');
const PropTypes = React.PropTypes;
const FeedbackDialog = require('./feedback-dialog');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const {
  findOrderFeedback,
  replyFeedback,
  pubFeedback,
} = global.api.order;

module.exports = connect(
  (state, props) => {
    return {
      user: state.getIn(['session', 'user']),
      feedbacks: state.get('feedbacks'),
      findOrderFeedback,
      replyFeedback,
      pubFeedback,
    };
  }
)(FeedbackDialog);
