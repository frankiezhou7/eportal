const React = require('react');
const { connect } = require('react-redux');
const Navigation = require('./navigation');

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      user: state.getIn(['session', 'user']),
    };
  }
)(Navigation);
