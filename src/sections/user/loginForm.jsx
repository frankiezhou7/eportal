const React = require('react');
const Login = require('./login');
const PropTypes = React.PropTypes;
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const {
  fetchMe,
  login,
  logout,
} = global.api.user;
const { findAccountById } = global.api.order;
const { initialize } = global.cli.initial;
const { reset } = global.cli.user;

module.exports = connect(
  (state, props) => {
    return {
      user: state.getIn(['session', 'user']),
      account: state.getIn(['session', 'account']),
      local: state.get('lastLogin'),
      initialized: !!state.getIn(['session', 'initialized']),
      loggingOut: state.getIn(['session', 'loggingOut']),
      fetchMe,
      findAccountById,
      initialize,
      login,
      logout,
      reset,
    };
  },
)(Login);
