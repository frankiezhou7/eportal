const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const FeedbackNote = require('../components/feedback-note');
const Paper = require('epui-md/Paper');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const OFF_LAND_CODE = 'PTOLFVSL';

let PTOLFVSLFeedbackForm = React.createClass({

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
      root:{
        padding: padding * 7,
      },
      feedbackNote: {
        padding: padding * 7,
        marginBottom: padding * 13,
        backgroundColor: '#fff',
      },
      title: {
        fontSize: 16,
      }
    };
    return styles;
  },

  isNotReadyToSave() {
    let config = this._getConfig();
    let count = config.ordersCount ? config.ordersCount : 1;
    for(let i = 0; i < count; i++){
      if(this.refs[`form${i}`].isDirty()){
        return true;
      }
    }
    return false;
  },

  getDirtyFiles() {
    let config = this._getConfig();
    let count = config.ordersCount ? config.ordersCount : 1;
    let dirtyFiles = [];
    for(let i = 0; i < count; i++){
      if(this.refs[`form${i}`].isDirty()){
        dirtyFiles.push(this.t('nLabelFeedBackFiles'));
      }
    }
    return dirtyFiles;
  },

  getValue() {
    let config = this._getConfig();
    let count = config.ordersCount ? config.ordersCount : 1;
    let value = [];
    for(let i = 0; i < count; i++){
      let val = this.refs[`form${i}`].getValue()
      value.push(val);
    }
    return {
      orders:value,
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
    let config = this._getConfig();
    let {
      mode,
      order,
      orderEntry,
      productConfig,
    } = this.props;

    let feedbackElems = [];
    for(let i = 1; i < config.ordersCount; i++){
      feedbackElems.push(
        <Paper zDepth={1} style={this.style('feedbackNote')}>
          <span style={this.style('title')}>{this.t('nTextOrder')+`${i+1}`}</span>
          <FeedbackNote
            ref={`form${i}`}
            config={this._getConfig().orders[i]}
            mode={mode}
            order={order}
            orderEntry={orderEntry}
            product={orderEntry.product}
            productConfig={productConfig}
          />
        </Paper>
      );
    }
    return feedbackElems;
  },

  render() {
    let config = this._getConfig();
    let {
      mode,
      order,
      orderEntry,
      productConfig,
    } = this.props;
    return (
      <div style = {this.style('root')}>
        <Paper zDepth={1} style={this.style('feedbackNote')}>
          <span style={this.style('title')}>{this.t('nTextOrder')+'1'}</span>
          <FeedbackNote
            ref={`form${0}`}
            config={this._getConfig().orders[0]}
            mode={mode}
            order={order}
            orderEntry={orderEntry}
            product={orderEntry.product}
            productConfig={productConfig}
          />
        </Paper>
        {this.renderFeedbackNote()}
      </div>
    );
   },

  _getProductConfig(){
    let productConfig = this.props.productConfig.toJS();
    let config = this._getConfig();
    let products = _.map(productConfig.products,product=>{
      let config = product.config;
      let productCode = product.product.code;
      let count = config.ordersCount ? config.ordersCount : 1;
      if(OFF_LAND_CODE===productCode){
        for(let i = 0; i < count; i++){
          if(this.refs[`form${i}`]){
            let feedbackNoteValue = this.refs[`form${i}`].getValue();
            product.config.orders[i].note = feedbackNoteValue.note;
            product.config.orders[i].feedbackFiles =feedbackNoteValue.feedbackFiles;
          }
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

module.exports = PTOLFVSLFeedbackForm;
