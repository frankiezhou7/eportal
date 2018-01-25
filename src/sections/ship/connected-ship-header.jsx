const React = require('react');
const ShipHeader = require('./ship-header');
const { connect } = require('react-redux');
const { getShipTypes } = global.api.epds;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      favorites: state.getIn(['favorites']),
      shipTypes: state.get('shipTypes'),
      user: state.getIn(['session', 'user']),
      getShipTypes,
    };
  }
)(ShipHeader);
