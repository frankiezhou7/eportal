const React = require('react');
const PropTypes = React.PropTypes;
const CreateVoyage = require('./create-voyage-form');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const {
  findVoyageSegmentsByShipId
} = global.api.epds;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      voyageSegments: state.get('voyageSegments'),
      findVoyageSegmentsByShipId,
    };
  }
)(CreateVoyage);
