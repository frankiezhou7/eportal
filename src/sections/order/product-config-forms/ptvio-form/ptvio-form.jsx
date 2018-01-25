const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const TextField = require('epui-md/TextField/TextField');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const VIO_CODE = 'PTVIO'
let PTVIOConfigForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    mode: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    subProducts: PropTypes.object,
    productConfig: PropTypes.object,
  },

  getDefaultProps() {
    return {
      order:null,
      orderEntry:null,
      subProducts:null,
      productConfig: null,
    };
  },

  getInitialState: function() {
    return {

    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding =2;
    let theme = this.getTheme();
    let styles = {
      root:{
        padding: padding*12,
      },
      iconStyle:{
        fill : theme.primary1Color,
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
    let config = this._getConfig();
    let {mode,order,orderEntry,productConfig}=this.props;
    return (
      <div style = {this.style('root')}>
        <TextField
          ref = 'note'
          key = 'note'
          floatingLabelText={this.t('nLabelNote')}
          defaultValue = {config && config.remark}
          fullWidth = {true}
          onChange = {this._handleChange}
        />
      </div>
    );
   },

   _getProductConfig(){
     let productConfig = this.props.productConfig.toJS();
     let products = _.map(productConfig.products,product=>{
       let productCode = product.product.code;
       if(VIO_CODE===productCode){
         if(this.refs.note){
           let noteValue = this.refs.note.getValue();
           product.config.remark = noteValue;
         }
       }
       return product;
     });
     productConfig.products = products;
     return productConfig;
   },

   _getConfig(){
     let config ={};
     if(this.props.productConfig){
       let productConfig = this.props.productConfig.toJS();
       _.forEach(productConfig.products,product=>{
         if(product.product._id === this.props.orderEntry.product._id){
           config =product.config;
         }
       });
     }
     return config;
   },

   _handleChange(){
    global.notifyOrderDetailsChange(true);
   },

});

module.exports = PTVIOConfigForm;
