const React = require('react');
const AutoStyle = require('epui/lib/mixins/auto-style');
const Translatable = require('epintl');
const OrderEntryMixin = require('../../mixins/order-entry');
const FeedbackNote = require('../components/feedback-note');
const PropTypes = React.PropTypes;
const OL_CODE = 'PTOL'
let PTOLConfigForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epintl/dist/ProductConfig/${__LOCALE__}`),
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
    nLabelRentAgencyInfos:PropTypes.string,
    nLabelFeedBackFiles:PropTypes.string,
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
      checkbox:{
        width: 24,
        padding: padding,
        display: 'inline-block',
        verticalAlign: 'middle',
      },
      iconStyle:{
        fill : theme.primary1Color,
      },
      textField:{
        display: 'block',
      },
    };
    return styles;
  },

  isNotReadyToSave(){
    return this.refs.feedbackNote.isDirty();
  },

  getDirtyFiles(){
    let dirtyFiles = [];
    if(this.isNotReadyToSave()){
      dirtyFiles.push(this.t('nLabelFeedBackFiles'));
    }
    return dirtyFiles;
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

  renderFeedbackNote(config){
    let {mode,order,orderEntry,productConfig}=this.props;
    return (
      <FeedbackNote
        ref ='feedbackNote'
        mode={mode}
        order={order}
        orderEntry ={orderEntry}
        product= {orderEntry.product}
        productConfig={productConfig}
        config={config}
      />
    );
  },

  render() {
    let styles = this.getStyles();
    let config = this._getConfig();
    return (
      <div style = {this.style('root')}>
        {this.renderFeedbackNote(config)}
      </div>
    );
   },

   _getProductConfig(){
     let productConfig = this.props.productConfig.toJS();
     let products = _.map(productConfig.products,product=>{
       let productCode = product.product.code;
       if(OL_CODE===productCode){
         if(this.refs.feedbackNote){
           let feedbackNoteValue = this.refs.feedbackNote.getValue();
           product.config.note = feedbackNoteValue.note;
           if(this.refs.feedbackFiles)product.config.feedbackFiles =feedbackNoteValue.feedbackFiles;
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

module.exports = PTOLConfigForm;
