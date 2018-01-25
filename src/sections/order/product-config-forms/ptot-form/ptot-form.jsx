const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const TextField = require('epui-md/TextField/TextField');
const FlatButton = require('epui-md/FlatButton');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const OT_CODE = 'PTOT';
let PTOTConfigForm = React.createClass({

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
    nLabelFeedBackFiles:PropTypes.string,
  },

  getDefaultProps() {
    return {
    };
  },

  getInitialState: function() {
    let config = this._getConfig();
    return {
      isAdd: config.details === null || config.details === '' ? false : true,
      editText: config.details && config.details.length > 0 ? false : true,
      detail: '',
      textEmpty : false,
      textHeight: null,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding =2;
    let theme = this.getTheme();
    let { editText, isAdd, textHeight } = this.state;
    let styles = {
      root:{
        padding: padding*12,
        position: 'relative',
      },
      iconStyle:{
        fill : theme.primary1Color,
      },
      title:{
        display: 'block',
        fontSize: 14,
        marginBottom: 10,
      },
      detailContainer:{
        display: isAdd ? 'block' : 'none',
        fontSize: 16,
        padding: 20,
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
        boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
        backgroundColor: '#fff',
      },
      configDetail:{
        display: editText ? 'block' : 'none',
      },
      button:{
        position: 'absolute',
        right: 25,
      },
      textField:{
        height: textHeight && textHeight + 30,
      },
      textAreaRoot:{
        position: 'relative',
        marginBottom: 20,
      },
      textArea:{
        whiteSpace: 'pre-line',
        height: textHeight && textHeight,
      },
      textAreaShadow:{
        whiteSpace: 'pre-line',
        height: textHeight && textHeight,
      },
    };
    return styles;
  },

  getValue() {
    return {
      details: this.state.detail,
    };
  },

  getProductConfig() {
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

  renderConfigDetail(config) {
    let text = '';
    let { detail, textEmpty } = this.state;
    text = detail ? detail : textEmpty ? '' : config.details;
    return (
      <div style={this.style('detailContainer')}
           ref={(ref) => this.text = ref}>
        {text}
      </div>
    );
  },

  renderTextField(config) {
    return (
      <div style = {this.style('configDetail')}>
        <TextField
          ref = 'configDetail'
          key = 'configDetail'
          multiLine = {true}
          defaultValue = {config && config.details}
          fullWidth = {true}
          rowsMax = {30}
          onChange = {this._handleChange}
          textareaRootStyle={this.style('textAreaRoot')}
          textareaStyle = {this.style('textArea')}
          shadowStyle = {this.style('textAreaShadow')}
          style = {this.style('textField')}
        />
      </div>
    );
  },


  render() {
    let config = this._getConfig();
    let { isAdd } = this.state;
    return (
      <div style = {this.style('root')}>
        <span style = {this.style('title')}>{this.t('nTextConfigDetail')}</span>
        {this.renderTextField(config)}
        {this.renderConfigDetail(config)}
        <div style = {this.style('button')}>
          <FlatButton
            key = 'save'
            backgroundColor='rgba(0,0,0,0)'
            label={isAdd ? this.t('nLabelEdit'): this.t('nTextAdd')}
            primary={true}
            onTouchTap={this._handleSubmit} />
        </div>
      </div>
    );
   },

   _getProductConfig(){
     let productConfig = this.props.productConfig.toJS();
     let products = _.map(productConfig.products,product=>{
       let productCode = product.product.code;
       if(OT_CODE===productCode){
         if(this.refs.configDetail && product.config){
           product.config.details = this.refs.configDetail.getValue();
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
     let height = this.refs.configDetail.getHeightValue();
     let detail = this.refs.configDetail.getValue();

     this.setState({
       detail,
       textHeight: height,
     });

     if(detail.length === 0) this.setState({textEmpty:true});
   },

   _handleSubmit() {
     let { editText, isAdd, detail } = this.state;
     this.setState({
       editText:!editText,
       isAdd: !isAdd,
     });

     if(isAdd) this.setState({textHeight:this.text.clientHeight});
     if(!isAdd) global.notifyOrderDetailsChange(true);
   },

});

module.exports = PTOTConfigForm;
