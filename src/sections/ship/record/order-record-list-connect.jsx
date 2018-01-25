const React = require('react');
const PropTypes = React.PropTypes;
const OrderRecordList = require('./order-record-list');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const { findOrdersByVoyageSegmentId } = global.api.order;

module.exports = connect(
  (state, props) => {
    return {
      orders: state.get('orders'),
      user: state.getIn(['session', 'user']),
      findOrdersByVoyageSegmentId
    };
  }
)(OrderRecordList);
