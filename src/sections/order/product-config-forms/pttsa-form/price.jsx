const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const OrderEntryMixin = require('~/src/mixins/order-entry');
const Dialog = require('epui-md/ep/Dialog');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Translatable = require('epui-intl').mixin;
const TSA_CODE = 'PTTSA';

const PTCTMPriceConfigForm = React.createClass({
  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/PriceConfig/${__LOCALE__}`),
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
    require(`epui-intl/dist/Address/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    isEditable: PropTypes.bool,
    nTextInvitationLetter: PropTypes.string,
    nTextInvitationLetterUnit: PropTypes.string,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    style: PropTypes.object,
    subProducts: PropTypes.object,
  },

  getInitialState() {
    return {
      open: false,
      error: false,
    };
  },

  getDefaultProps() {
    return {
      orderEntry: null,
      subProducts: null,
      productConfig: null,
      isEditable: true,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 2;
    let theme = this.getTheme();
    let rootStyle = {};

    if (this.props.style) {
      _.merge(rootStyle, this.props.style);
    }

    let styles = {
      root: rootStyle,
      textFieldUnit: {},
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
    let priceConfig = this._getPriceConfig();
    const actions = [
      <FlatButton
        label={this.t('nLabelDialogConfirm')}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this._handleDialogClose}
      />,
    ];
    return (
      <div style = {this.style('root')}>
        <div style = {this.style('root')}>
          <TextFieldUnit
            ref='invitationLetter'
            key='invitationLetter'
            style={this.style('textFieldUnit')}
            defaultValue={priceConfig ? priceConfig['CTINLRCG|COUNT|value'] === 0 ? '' : priceConfig['CTINLRCG|COUNT|value'] : ''}
            floatingLabelText={this.t('nTextInvitationLetter')}
            unitLabelText={this.t('nTextInvitationLetterUnit')}
            onBlur={this._handleBlur}
            disabled={!this.props.isEditable}
            onChange={this._handleChange.bind(this,'invitationLetter')}
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

   _handleDialogClose() {
     this.setState({
         open: false,
         error: false,
       });
   },

  _getProductConfig() {
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products, product => {
      let productCode = product.product.code;
      if (TSA_CODE === productCode && this.refs.invitationLetter) {
        product.priceConfig['CTINLRCG|COUNT|value'] = parseInt(this.refs.invitationLetter.getValue());
      }

      return product;
    });

    productConfig.products = products;

    return productConfig;
  },

  _getPriceConfig() {
    let priceConfig = {};
    let productConfig = this.props.productConfig.toJS();

    _.forEach(productConfig.products, product => {
      if (TSA_CODE === product.product.code) {
        priceConfig = product.priceConfig;
      }
    });

    return priceConfig;
  },

  _handleBlur() {
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
