const React = require('react');
const _ = require('eplodash');
const OrderEntryDetails = require('./order-entry-details');
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const { connect } = require('react-redux');
const { findSubProductsById } = global.api.order;

const OrderEntryDetailsView = React.createClass({
  mixins: [StylePropable],

  propTypes: {
    changed: PropTypes.bool,
    costTypes: PropTypes.object,
    findSubProductsById: PropTypes.func,
    mode: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    page: PropTypes.string,
    product: PropTypes.object,
    params: PropTypes.object,
    segment: PropTypes.object,
    ship: PropTypes.object,
    subProducts: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    let {
      findSubProductsById,
      orderEntry,
      subProducts,
    } = this.props;
    global.currentProductConfig = orderEntry.productConfig;
    let findSubProduct = false;
    if(!subProducts || subProducts.size === 0) {
      findSubProduct =true;
    }else{
      let subProduct = subProducts.get(0);
      if(subProduct.get('parent') && subProduct.get('parent') !==this.props.orderEntry.product._id){
        findSubProduct =true;
      }
    }
    if(findSubProduct && _.isFunction(findSubProductsById)){
      findSubProductsById(this.props.orderEntry.product._id);
    }
  },

  componentWillReceiveProps(nextProps) {
    let {
      findSubProductsById,
      orderEntry,
    } = this.props;

    if(orderEntry._id !== nextProps.orderEntry._id) {
      global.currentProductConfig = orderEntry.productConfig;
      if (_.isFunction(findSubProductsById)) {
        findSubProductsById(nextProps.orderEntry.product._id);
      }
    }
  },

  saveProductConfig() {
    this.refs.orderEntryDetails.saveProductConfig();
  },

  render() {
    let {
      changed,
      costTypes,
      mode,
      order,
      orderEntry,
      page,
      segment,
      ship,
    } = this.props;

    return(
      <OrderEntryDetails
        {...this.props}
        ref='orderEntryDetails'
        changed={changed}
        costTypes={costTypes}
        mode={mode}
        order={order}
        orderEntry={orderEntry}
        page={page}
        segment={segment}
        ship={ship}
      />
    );
  },
});

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      subProducts: state.getIn(['product', 'subProducts']),
      products: state.getIn(['product', 'products']),
      findSubProductsById,
    };
  },
  null,
  null,
  {withRef: true},
)(OrderEntryDetailsView);
