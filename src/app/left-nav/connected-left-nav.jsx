const React = require('react');
const { connect } = require('react-redux');
const LeftNav = require('./left-nav');

module.exports = connect(
  (state, props) => {
    const left = state.getIn(['client', 'navigation', 'left']);
    return {
      ...props,
      user: state.getIn(['session', 'user']),
      mode: left.get('mode'),
      open: left.get('open'),
      searchQuery: left.get('searchQuery'),
    };
  }
)(LeftNav);
