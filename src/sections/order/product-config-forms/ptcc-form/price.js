const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Dialog = require('epui-md/ep/Dialog');
const FlatButton = require('epui-md/FlatButton');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const CC_CODE = 'PTCC';
const ON_SIGNER = 'PTCCONS';
const OFF_SIGNER = 'PTCCOFFS';

let PTCTMPriceConfigForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
    require(`epui-intl/dist/PriceConfig/${__LOCALE__}`),
    require(`epui-intl/dist/Address/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    orderEntry: PropTypes.object,
    subProducts: PropTypes.object,
    productConfig: PropTypes.object,
    isEditable:PropTypes.bool,
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

  getInitialState() {
    return {
      open: false,
      error: false,
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

  renderOnSignerForm(priceConfig){
    const defaultValue = priceConfig ? priceConfig['CTINLRCG|COUNT|value'] === 0 ? '' : priceConfig['CTINLRCG|COUNT|value'] : '';
    const actions = [
      <FlatButton
        label={this.t('nLabelDialogConfirm')}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this._handleDialogClose}
      />,
    ];
    return (
      <div style={this.style('root')}>
        <div style = {this.style('root')}>
          <TextFieldUnit
            ref = 'invitationLetter'
            key = 'invitationLetter'
            style= {this.style('textFieldUnit')}
            defaultValue= {defaultValue}
            floatingLabelText= {this.t('nTextInvitationLetter')}
            unitLabelText={this.t('nTextInvitationLetterUnit')}
            disabled = {!this.props.isEditable}
            onBlur = {this._handleBlur}
            onChange = {this._handleChange.bind(this,'invitationLetter')}
          />
        </div>
        <Dialog
          title={this.t('nTextTypeErrorTitle')}
          actions={actions}
          modal={false}
          open={this.state.open||this.state.error}
        >
          {this.rendeErrorNotification()}
        </Dialog>
      </div>
    );
  },

  rendeErrorNotification() {
    if(this.state.open) {
      return this.t('nTextTypeError');
    }else if(this.state.error){
      return this.t('nTextPostCodeError');
    }
  },

  render() {
    let priceConfig = this._getPriceConfig();
    return (
      <div style = {this.style('root')}>
        {this.renderOnSignerForm(priceConfig)}
      </div>
    );
   },

  _getProductConfig(){
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products,product=>{
      let productCode = product.product.code;
      if(ON_SIGNER===productCode && this.refs.invitationLetter){
        product.priceConfig['CTINLRCG|COUNT|value'] = parseInt(this.refs.invitationLetter.getValue());
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
      if(ON_SIGNER===product.product.code){
        priceConfig = product.priceConfig;
      }
    });
    return priceConfig;
  },

  _handleDialogClose() {
    this.setState({
        open: false,
        error: false,
      });
  },

  _handleBlur(){
    this.getProductConfig();
  },

  _handleChange(name) {
    global.notifyOrderDetailsChange(true);
    let value = this.refs.invitationLetter.getValue();
    if(!_.isInteger(Number(value))) {
      this.setState({error:true});
      this.refs.invitationLetter.clearValue();
    }
  },


});

module.exports = PTCTMPriceConfigForm;
