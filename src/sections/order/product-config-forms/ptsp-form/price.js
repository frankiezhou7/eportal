const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');

const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const SP_CODE = 'PTSP';

let PTCTMPriceConfigForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/PriceConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    isEditable :PropTypes.bool,
    orderEntry: PropTypes.object,
    subProducts: PropTypes.object,
    productConfig: PropTypes.object,
    style: PropTypes.object,
    nTextDeliveryCharge: PropTypes.string,
    nTextDeliveryChargeUnit: PropTypes.string,
  },

  getDefaultProps() {
    return {
      orderEntry:null,
      subProducts:null,
      productConfig: null,
      isEditable:true,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding =2;
    let theme = this.getTheme();
    let rootStyle = {};
    if(this.props.style){
      _.merge(rootStyle, this.props.style);
    }
    let styles = {
      root:rootStyle,
      textFieldUnit:{

      },
    };
    return styles;
  },

  getProductConfig(){
    let productConfig = this._getProductConfig();
    let products = _.map(productConfig.products,product=>{
      product.product = product.product._id;
      if(product.costTypes){
        delete product.costTypes;
      }
      return product;
    });
    productConfig.products = products;
    return productConfig;
  },

  render() {
    let priceConfig = this._getPriceConfig();
    return (
      <div style = {this.style('root')}>
        <TextFieldUnit
          ref = 'deliveryCharge'
          key = 'deliveryCharge'
          style= {this.style('textFieldUnit')}
          defaultValue= {priceConfig ? priceConfig['CTDYCG|COUNT|value']: ''}
          floatingLabelText= {this.t('nTextDeliveryCharge')}
          unitLabelText={this.t('nTextDeliveryChargeUnit')}
          onBlur = {this._handleBlur}
          disabled = {!this.props.isEditable}
          onChange = {this._handleChange}
        />
      </div>
    );
   },

  _getProductConfig(){
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products,product=>{
      let productCode = product.product.code;
      if(SP_CODE===productCode && this.refs.deliveryCharge){
        product.priceConfig['CTDYCG|COUNT|value'] = parseInt(this.refs.deliveryCharge.getValue());
      }
      return product;
    });
    productConfig.products = products;
    return productConfig;
  },

  _getPriceConfig(){
    let priceConfig ={};
    let productConfig = this.props.productConfig.toJS();
    _.forEach(productConfig.products,product=>{
      if(SP_CODE===product.product.code){
        priceConfig = product.priceConfig;
      }
    });
    return priceConfig;
  },

  _handleBlur(){
    this.getProductConfig();
  },

  _handleChange(){
    global.notifyOrderDetailsChange(true);
  },

});

module.exports = PTCTMPriceConfigForm;
