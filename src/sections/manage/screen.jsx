const React = require('react');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const PropTypes = React.PropTypes;
const ManagementView = require('./view');
const { getSubPathComponents } = require('~/src/utils');

module.exports = connect(
  (state, props) => {
    const segs = getSubPathComponents(global.location.pathname);
    return {
      target: segs[1]
    };
  }
)(ManagementView);
