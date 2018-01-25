const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const FeedbackNote = require('../components/feedback-note');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const OT_CODE = 'PTOT';

let PTOTFeedbackForm = React.createClass({

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
      root:{},
      feedbackNote: {
        paddingLeft: padding * 7,
        paddingRight: padding * 7,
      },
    };
    return styles;
  },

  isNotReadyToSave() {
    return this.feedbackNote.isDirty();
  },

  getDirtyFiles() {
    let dirtyFiles = [];
    if (this.feedbackNote.isDirty()) {
      dirtyFiles.push(this.t('nLabelFeedBackFiles'));
    }
    return dirtyFiles;
  },

  getValue() {
    return {
      feedbackFiles: this.feedbackNote.getValue().feedbackFiles,
      note: this.feedbackNote.getValue().note,
    };
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

  renderFeedbackNote() {
    let {
      mode,
      order,
      orderEntry,
      productConfig,
    } = this.props;

    return (
      <div style={this.style('feedbackNote')}>
        <FeedbackNote
          ref={(ref) => this.feedbackNote = ref}
          config={this._getConfig()}
          mode={mode}
          order={order}
          orderEntry={orderEntry}
          product={orderEntry.product}
          productConfig={productConfig}
        />
      </div>
    );
  },

  render() {
    return (
      <div style = {this.style('root')}>
        {this.renderFeedbackNote()}
      </div>
    );
   },

  _getProductConfig(){
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products,product=>{
      let config = product.config;
      let productCode = product.product.code;
      if(OT_CODE===productCode){
        if(this.feedbackNote){
          let feedbackNoteValue = this.feedbackNote.getValue();
          product.config.note = feedbackNoteValue.note;
          product.config.feedbackFiles =feedbackNoteValue.feedbackFiles;
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

module.exports = PTOTFeedbackForm;
