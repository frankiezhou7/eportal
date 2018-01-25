const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const ResetPassword = require('./resetPassword');
const { connect } = require('react-redux');

const ResetPasswordForm = React.createClass({
  mixins: [AutoStyle],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    return <ResetPassword {...this.props} ref="reset" />;
  },
});

const {
  resetPassword,
  verifyLostPasswordToken,
} = global.api.user;

module.exports = connect(
  (state, props) => {
    return{
      ...props,
      resetPassword,
      verifyLostPasswordToken,
    };
  },
)(ResetPasswordForm);
