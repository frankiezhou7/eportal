const React = require('react');
const PropTypes = React.PropTypes;
const CreateOrderForm = require('./create-order-form');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const {
  addOrderEntryToOrder,
  createOrder,
  fetchOrderFilesURL,
  findMainProducts,
  findOrderEvents,
  findOrdersByVoyageSegmentId,
  findSubProductsById,
  getCostTypes,
  getProducts,
  updateProductConfigForOrderAndCalculateOrderEntryFee,
} = global.api.order;

const {
  findVoyageSegmentsByShipId,
  findShipById,
} = global.api.epds;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      account: state.getIn(['session', 'account']),
      allProducts: state.getIn(['product', 'allProducts']),
      costTypes: state.get('costTypes'),
      orders: state.get('orders'),
      products: state.getIn(['product', 'products']),
      subProducts: state.getIn(['product', 'subProducts']),
      user: state.getIn(['session', 'user']),
      voyageSegments: state.get('voyageSegments'),
      findShipById,
      addOrderEntryToOrder,
      createOrder,
      fetchOrderFilesURL,
      findMainProducts,
      findOrderEvents,
      findOrdersByVoyageSegmentId,
      findSubProductsById,
      getCostTypes,
      getProducts,
      updateProductConfigForOrderAndCalculateOrderEntryFee,
      findVoyageSegmentsByShipId,
    };
  }
)(CreateOrderForm);
