const _ = require('eplodash');
const React = require('react');
const ChangePassword = require('./changePassword');
const PropTypes = React.PropTypes;
const { connect } = require('react-redux');

const ChangePasswordForm = React.createClass({
  contextTypes: {
    muiTheme: PropTypes.object,
  },

  getInitialState() {
    return {};
  },

  render() {
    return (
      <ChangePassword {...this.props} />
    );
  },
});

const {
  changePassword,
  logout,
} = global.api.user;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      changePassword,
      logout,
    };
  },
  null,
  null,
  {withRef: true}
)(ChangePasswordForm);
