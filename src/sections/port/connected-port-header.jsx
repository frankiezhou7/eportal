const React = require('react');
const { connect } = require('react-redux');
const PortHeader = require('./port-header');

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      user: state.getIn(['session', 'user']),
      favorites: state.getIn(['favorites']),
    };
  }
)(PortHeader);
