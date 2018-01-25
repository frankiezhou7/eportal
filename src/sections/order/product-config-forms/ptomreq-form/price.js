const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const FIRE_WORK_PERMIT = 'PTFRWKPMT';
const MAIN_ENGINE_IMMIBILIZATION = 'PTMEIMBIN';
const FW_SUPPLY = 'PTFWSPY';
const MAGNETIC_COMPASS_ADJUST = 'PTMACMADJST';
const FRESH_WATER_ANALYSIS = 'PTFHWTANAS';

let PTOMREQPriceConfigForm = React.createClass({
  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/PriceConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    isEditable: PropTypes.bool,
    orderEntry: PropTypes.object,
    subProducts: PropTypes.object,
    productConfig: PropTypes.object,
    style: PropTypes.object,
    nTextHandlingCharge: PropTypes.string,
    nTextHandlingChargeUnit: PropTypes.string,
    nTextAdjustCharge:  PropTypes.string,
    nTextTimeUnit: PropTypes.string,
    nTextAnalysisCharge: PropTypes.string,
    nTextAnalysisChargeUnit: PropTypes.string,
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
      title:{
        fontSize: 15,
        display:'block',
        marginBottom: padding*5,
      },
      form:{
        margin: '10px 20px 10px 0px',
        display: 'inline-block',
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

  renderForms(productConfig){
    let forms =[];
    _.forEach(productConfig.products,product=>{
      if(product.select){
        let productCode = product.product.code;
        let productName = product.product.name;
        let priceConfig = this._getPriceConfig(productCode);
        let ref,key,floatingText,unitText;
        switch (productCode) {
          case FIRE_WORK_PERMIT:
            ref='handlingCharge_'+productCode;
            key='CTHGCG|COUNT|value';
            floatingText='nTextHandlingCharge';
            unitText='nTextTimeUnit';
            break;
          case MAIN_ENGINE_IMMIBILIZATION:
            ref='handlingCharge_'+productCode;
            key='CTHGCG|COUNT|value';
            floatingText='nTextHandlingCharge';
            unitText='nTextTimeUnit';
            break;
          case MAGNETIC_COMPASS_ADJUST:
            ref='adjustCharge';
            key='CTADTCG|COUNT|value';
            floatingText='nTextAdjustCharge';
            unitText='nTextAnalysisChargeUnit';
            break;
          case FRESH_WATER_ANALYSIS:
            ref='analysisCharge';
            key='CTAYSCG|COUNT|value';
            floatingText='nTextAnalysisCharge';
            unitText='nTextTimeUnit';
            break;
          default:
        }
        if(ref && key && floatingText && unitText){
          forms.push(
            <div style = {this.style('form')}>
              <span style = {this.style('title')}>{productName}</span>
              <TextFieldUnit
                ref = {ref}
                key = {ref}
                style= {this.style('textFieldUnit')}
                defaultValue= {priceConfig ? priceConfig[key]: ''}
                floatingLabelText= {this.t(floatingText)}
                unitLabelText={this.t(unitText)}
                onBlur = {this._handleBlur}
                disabled = {!this.props.isEditable}
                onChange = {this._handleChange}
              />
            </div>
          );
        }
      }
    });
    return forms;
  },

  render() {
    let productConfig = this.props.productConfig.toJS();
    return (
      <div style = {this.style('root')}>
        {this.renderForms(productConfig)}
      </div>
    );
   },

  _getProductConfig(){
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products,product=>{
      let productCode = product.product.code;
      if((FIRE_WORK_PERMIT===productCode || MAIN_ENGINE_IMMIBILIZATION===productCode)&& this.refs['handlingCharge_'+productCode]){
        product.priceConfig['CTHGCG|COUNT|value'] = parseInt(this.refs['handlingCharge_'+productCode].getValue());
      }
      if(MAGNETIC_COMPASS_ADJUST===productCode && this.refs.adjustCharge){
        product.priceConfig['CTADTCG|COUNT|value'] = parseInt(this.refs.adjustCharge.getValue());
      }
      if(FRESH_WATER_ANALYSIS===productCode && this.refs.analysisCharge){
        product.priceConfig['CTAYSCG|COUNT|value'] = parseInt(this.refs.analysisCharge.getValue());
      }
      return product;
    });
    productConfig.products = products;
    return productConfig;
  },

  _getPriceConfig(productCode){
    let priceConfig ={};
    let productConfig = this.props.productConfig.toJS();
    _.forEach(productConfig.products,product=>{
      if(productCode===product.product.code){
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

module.exports = PTOMREQPriceConfigForm;
