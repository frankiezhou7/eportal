const React = require('react');
const PropTypes = React.PropTypes;
const EditSegmentDialog = require('./edit-segment-dialog');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const {
  updateVoyageSegmentById
} = global.api.epds;

module.exports = connect(
  (state, props) => {
    return {
      updateVoyageSegmentById,
    };
  }
)(EditSegmentDialog);
