const React = require('react');
const PropTypes = React.PropTypes;
const SegmentOrdersView = require('./segment-orders-view');
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
  getOffLandingArticleTypes,
} = global.api.order;

const {
  fetchMe,
} = global.api.user;

module.exports = connect(
  (state, props) => {
    return {
      account: state.getIn(['session', 'account']),
      allProducts: state.getIn(['product', 'allProducts']),
      chats: state.get('chats'),
      costTypes: state.get('costTypes'),
      orders: state.get('orders'),
      products: state.getIn(['product', 'products']),
      subProducts: state.getIn(['product', 'subProducts']),
      user: state.getIn(['session', 'user']),
      offLandingArticleTypes: state.getIn(['articleType', 'offLandingArticleType']),
      addOrderEntryToOrder,
      createOrder,
      fetchOrderFilesURL,
      findMainProducts,
      findOrderEvents,
      findOrdersByVoyageSegmentId,
      findSubProductsById,
      getCostTypes,
      getProducts,
      getOffLandingArticleTypes,
      updateProductConfigForOrderAndCalculateOrderEntryFee,
      fetchMe,
    };
  }
)(SegmentOrdersView);
