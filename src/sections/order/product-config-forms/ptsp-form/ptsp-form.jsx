const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PTSPInnerConnect = require('./ptsp-inner-connect');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const SPARE_PART_CODE = 'PTSP';

const PTSPConfigForm = React.createClass({
  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

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
      orderEntry:null,
      subProducts:null,
      productConfig: null,
    };
  },

  getInitialState() {
    return {
      orderId: 0,
      newOrderId: 0,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 2;
    let theme = this.getTheme();
    let styles = {
      root:{
        padding: '10px 12px 10px 10px',
      },
    };
    return styles;
  },

  isNotReadyToSave() {
    return this.refs.connect.getWrappedInstance().isNotReadyToSave();
  },

  getDirtyFiles() {
    return this.refs.connect.getWrappedInstance().getDirtyFiles();
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
    let {
      order,
      mode,
      orderEntry,
      productConfig,
      ...others
    } = this.props;

    return (
      <PTSPInnerConnect
        ref='connect'
        mode={mode}
        order={order}
        orderEntry={orderEntry}
        productConfig={productConfig}
        config={this._getConfig()}
        style={this.style('root')}
        {...others}
      />
    );
   },

   _getProductConfig() {
     let productConfig = this.props.productConfig.toJS();
     let products = _.map(productConfig.products,product => {
       let productCode = product.product.code;
       if(SPARE_PART_CODE === productCode) {
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

module.exports = PTSPConfigForm;
