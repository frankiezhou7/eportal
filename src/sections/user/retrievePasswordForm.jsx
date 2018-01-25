const React = require('react');
const PropTypes = React.PropTypes;
const RetrievePassword = require('./retrievePassword');
const { connect } = require('react-redux');
const { register } = global.api.user;

module.exports = connect(
  (state, props) => {
    return {
      retrieve: state.get('retrievePassword'),
      sendLostPasswordToken,
    };
  }
)(RetrievePassword);
