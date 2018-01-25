const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const FeedbackNote = require('../components/feedback-note');
const Paper = require('epui-md/Paper');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;

let PTSPSLGAFeedbackForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
    require(`epui-intl/dist/ServiceProducts/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    mode: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    subProducts: PropTypes.object,
  },

  getDefaultProps() {
    return {
      orderEntry:null,
      subProducts:null,
      productConfig: null,
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
        padding: padding * 4,
      },
      container:{
        padding: padding * 7,
        marginBottom: padding * 5,
        backgroundColor: '#fff',
      },
      title: {
        fontSize: 16,
      }
    };
    return styles;
  },

  isNotReadyToSave() {
    return this.isFeedbackDirty();
  },

  getDirtyFiles() {
    let dirtyFiles = [];
    if (this.isFeedbackDirty()) {
      dirtyFiles.push(this.t('nLabelFeedBackFiles'));
    }
    return dirtyFiles;
  },

  isFeedbackDirty() {
    let isDirty = false;
    let productConfig = this.props.productConfig;
    if (productConfig && productConfig.products) {
      productConfig.products.forEach(product => {
        let productCode = product.get('product').get('code');
        if (this.refs['feedbackNote' + productCode] && this.refs['feedbackNote' + productCode].isDirty()) {
          isDirty = true;
        }
      });
    }
    return isDirty;
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

  renderFeedbackNote(config,subProduct) {
    let {
      mode,
      order,
      orderEntry,
      productConfig,
    } = this.props;

    let subProductCode = subProduct.get('code');
    let child = null;
    child = (
      <FeedbackNote
        ref ={'feedbackNote'+subProductCode}
        key = {'feedbackNote'+subProductCode}
        mode={mode}
        order={order}
        orderEntry ={orderEntry}
        product={subProduct}
        productConfig={productConfig}
        config={config.toJS()}
      />);

    return (
      <div style={this.style('root')}>
        <Paper zDepth={1} style={this.style('container')}>
          <span style={this.style('title')}>{this.t(`nLabelProductName${subProductCode}`)}</span>
          {child}
        </Paper>
      </div>
    );
  },

  renderSubProducts(){
    let subProductsElems=[];
    let productConfig = this.props.productConfig;
    if(productConfig && productConfig.products){
      productConfig.products.forEach(product=>{
        let productDetail = product.get('product');
        let config = product.get('config');
        subProductsElems.push(this.renderFeedbackNote(config,productDetail));
      });
    }
    return subProductsElems;
  },

  render() {
    return (
      <div style = {this.style('root')}>
        {this.renderSubProducts()}
      </div>
    );
   },

  _getProductConfig(){
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products,product=>{
      let config = product.config;
      let productCode = product.product.code;
      if(this.refs['feedbackNote'+productCode]){
        let feedbackNoteValue = this.refs['feedbackNote'+productCode].getValue();
        if(config.note!=undefined ) {
          config.note=feedbackNoteValue.note;
        }
        if(config.feedbackFiles) {
          config.feedbackFiles = feedbackNoteValue.feedbackFiles;
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
});

module.exports = PTSPSLGAFeedbackForm;
