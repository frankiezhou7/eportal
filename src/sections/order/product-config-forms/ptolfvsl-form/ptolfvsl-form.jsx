const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PTOLFVSLInnerConnect = require('./ptolfvsl-inner-connect');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const OFF_LAND_CODE = 'PTOLFVSL';

const PTOLFVSLForm = React.createClass({
  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    mode: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
  },

  getDefaultProps() {
    return {
      orderEntry: null,
      productConfig: null,
      subProducts: null,
    };
  },

  getInitialState() {
    return {};
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 2;
    let theme = this.getTheme();
    let styles = {
      root: {
        padding: 20,
      },
    };
    return styles;
  },

  getProductConfig() {
    let productConfig = this._getProductConfig();
    let products = _.map(productConfig.products, product => {
      product.product = product.product._id;
      if (product.costTypes) {
        delete product.costTypes;
      }
      return product;
    });
    productConfig.products = products;

    return productConfig;
  },

  render() {
    let shipments = [];
    let {
      order,
      mode,
      orderEntry,
      productConfig
    } = this.props;

    return (
      <PTOLFVSLInnerConnect
        ref='connect'
        config={this._getConfig()}
        mode={mode}
        order={order}
        orderEntry = {orderEntry}
        productConfig = {productConfig}
        style={this.style('root')}
      />
    );
   },

  _getProductConfig() {
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products,product => {
      let productCode = product.product.code;
      if(OFF_LAND_CODE === productCode) {
        product.config = this.refs.connect.getWrappedInstance().getValue();
      }

      return product;
    });
    productConfig.products = products;

    return productConfig;
  },

  _getConfig() {
    let config = {};
    if (this.props.productConfig) {
      let productConfig = this.props.productConfig.toJS();
      _.forEach(productConfig.products, product => {
        if (product.product._id === this.props.orderEntry.product._id) {
          config = product.config;
        }
      });
    }
    return config;
  },
});

module.exports = PTOLFVSLForm;
