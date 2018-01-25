const React = require('react');
const { connect } = require('react-redux');
const RightNav = require('./right-nav');

module.exports = connect(
  (state, props) => {
    const right = state.getIn(['client', 'navigation', 'right']);
    const user = state.getIn(['session', 'user']);
    const account = state.getIn(['session', 'account']);
    return {
      ...props,
      user: user,
      account: account,
      mode: right.get('mode'),
      open: right.get('open'),
    };
  }
)(RightNav);
