const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Checkbox = require('epui-md/Checkbox');
const CompanyForm = require('../components/company-form');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const TextField = require('epui-md/TextField/TextField');

const CPD_CODE = 'PTCPD'

const PTCPDConfigForm = React.createClass({

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
    nLabelNote:PropTypes.string,
    nLabelHasLumpsum:PropTypes.string,
    nLabelRentAgencyInfos:PropTypes.string,
    nLabelAdviseAmount:PropTypes.string,
    nLabelAdviseAmountUnit:PropTypes.string,
    viewPriceEst: PropTypes.bool,
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
    let config = this._getConfig();
    return {
      hasLumpsum: config.hasLumpsum,
      hasChecked: false,
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
      checkbox:{
        width: 24,
        padding: padding,
        display: this.props.viewPriceEst ? 'inline-block' : 'none',
        verticalAlign: 'middle',
      },
      iconStyle:{
        fill : theme.primary1Color,
      },
      hasLumpsum:{
        marginTop : padding*12,
      },
      LumpsumLabel:{
        verticalAlign: 'middle',
        fontSize : 15,
        fontWeight: 500,
      },
      textField:{
        display: 'block',
      },
      noteContainer: {
        width: 818,
        margin: '0px auto',
      },
      noteTitle: {
        fontSize: 15,
      },
    };
    return styles;
  },

  getValue(){
    return {
      hasChecked: this.state.hasChecked,
      remark: this.note.getValue(),
    }
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

  componentDidMount(){
    let config = this._getConfig();
    if(config && config.hasLumpsum){
      this.refs.checkbox.setChecked(true);
    }
  },

  renderLumpsum(config){
    let adviseAmount = this.state.hasLumpsum?
      (
        <TextFieldUnit
          ref = 'adviseAmount'
          key= 'adviseAmount'
          style= {this.style('textField')}
          defaultValue = {config.adviseAmount ? config.adviseAmount : ''}
          floatingLabelText={this.t('nLabelAdviseAmount')}
          unitLabelText = {this.t('nLabelAdviseAmountUnit')}
          onChange = {this._handleChange}
        />
      ):null;
    return (
      <div style ={this.style('hasLumpsum')}>
        <Checkbox
          ref = 'checkbox'
          iconStyle = {this.style('iconStyle')}
          style ={this.style('checkbox')}
          onCheck = {this._handleCheck}
          enableTransition = {true}
        />
        <span
          style = {this.style('LumpsumLabel')}
          onClick = {this._hanldeInviLetterTitleClick}
        >
          {this.t('nLabelHasLumpsum')}
        </span>
        {adviseAmount}
      </div>
    );
  },

  renderCompanyForm(config,companyConfig){
    return (
      <CompanyForm
        ref ='companyForm'
        companyInfos = {config.companyInfos}
        syncCompanyInfos = {companyConfig.companyInfos}
        onSaveChecked = {this._handleSaveCheck}
        hasChecked={config.hasChecked}
        title = {this.t('nLabelRentAgencyInfos')}
        showSync={true}
       />
    );
  },

  renderNote(config){
    return(
      <div style={this.style('noteContainer')}>
        <TextField
          ref = {(ref) => this.note = ref}
          key = 'note'
          floatingLabelText={this.t('nLabelNote')}
          defaultValue = {config && config.remark}
          fullWidth = {true}
          onChange = {this._handleChange}
        />
      </div>
    );
  },

  render() {
    let styles = this.getStyles();
    let config = this._getConfig();
    let companyConfig = this._getCompanyConfig();

    return (
      <div style = {this.style('root')}>
        {this.renderCompanyForm(config,companyConfig)}
        {this.renderLumpsum(config)}
        {this.renderNote(config)}
      </div>
    );
   },

   _getProductConfig(){
     let productConfig = this.props.productConfig.toJS();
     let products = _.map(productConfig.products,product=>{
       let productCode = product.product.code;
       if(CPD_CODE===productCode){
         product.config.companyInfos = this.refs.companyForm.getValue();
         product.config.hasLumpsum =this.state.hasLumpsum;
         product.config.hasChecked =this.state.hasChecked;
         if(this.refs.adviseAmount) product.config.adviseAmount =this.refs.adviseAmount.getValue();
         if(this.note) product.config.remark =this.note.getValue();

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

   _getCompanyConfig(){
     let config = {};
     let orderEntry = _.reject(this.props.order.toJS().orderEntries, entry => {
       return entry.product.code !=='PTSR';
     });
     if(_.has(orderEntry[0],['productConfig','products'])){
       config = orderEntry[0].productConfig.products[0].config;
     }
     return config;
   },


   _handleCheck(e, checked){
     if(global.isOrderDetailsChanged()){
       this.setState({
         hasLumpsum: checked
       });
     }else{
       global.notifyOrderDetailsChange(true,()=>{
         this.setState({
           hasLumpsum: checked
         });
       });
     }
   },

   _handleSaveCheck(checked){
     this.setState({
       hasChecked: checked
     });
   },

   _handleChange(){
    global.notifyOrderDetailsChange(true);
   },

});

module.exports = PTCPDConfigForm;
