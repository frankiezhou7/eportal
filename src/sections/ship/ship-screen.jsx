const React = require('react');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const PropTypes = React.PropTypes;
const ShipForm = require('./ship-form');
const { getSubPathComponents } = require('~/src/utils');

const {
  cancelVoyageSegmentById,
  createVoyageSegment,
  findShipById,
  findShipByIdInMode,
  findVoyageSegmentById,
  findVoyageSegmentScheduleHistoryById,
  findVoyageSegmentsByShipId,
  getShipTypes,
  removeVoyageSegment,
  updateScheduleBySegmentId,
  updateShipById,
  updateShipEssentialInfo,
} = global.api.epds;

module.exports = connect(
  (state, props) => {
    const segs = getSubPathComponents(global.location.pathname);
    const shipTypes = state.get('shipTypes');

    return {
      ships: state.getIn(['ships', 'list']),
      shipTypes: shipTypes && shipTypes.get('entries'),
      voyageSegments: state.get('voyageSegments'),
      target: segs[2],
      cancelVoyageSegmentById,
      createVoyageSegment,
      findShipById,
      findShipByIdInMode,
      findVoyageSegmentById,
      findVoyageSegmentScheduleHistoryById,
      findVoyageSegmentsByShipId,
      getShipTypes,
      removeVoyageSegment,
      updateScheduleBySegmentId,
      updateShipById,
      updateShipEssentialInfo,
    };
  }
)(ShipForm);
