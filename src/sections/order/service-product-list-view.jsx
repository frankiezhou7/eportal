const React = require('react');
const PropTypes = React.PropTypes;
const ServiceProductList = require('./service-product-list');
const StylePropable = require('~/src/mixins/style-propable');
const { connect } = require('react-redux');
const { findMainProducts } = global.api.order;

const ServiceProductListView = React.createClass({
  mixins: [StylePropable],

  propTypes: {
    findMainProducts: PropTypes.func,
    products: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  componentWillMount() {
    let {
      findMainProducts,
      products,
    } = this.props;
    if (!products || products.size <= 0) {
      if (_.isFunction(findMainProducts)) {
        findMainProducts();
      }
    }
  },

  render() {
    return <ServiceProductList {...this.props} />;
  },
});

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      findMainProducts,
      products: state.getIn(['product', 'products']),
    }
  },
)(ServiceProductListView);
