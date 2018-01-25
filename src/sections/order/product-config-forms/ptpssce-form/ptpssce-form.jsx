const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const DetailModeViewer = require('./detail-mode-connect');
const DragDropFiles = require('../../drag-drop-files');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const Flexible = require('epui-md/ep/Flexible');
const MenuItem = require('epui-md/MenuItem');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const SimpleMode = require('./simple-mode');
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;
const PURCHASE_CODE = 'PTPSSCE';

const PTPSSCEForm = React.createClass({
  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    mode: PropTypes.string,
    nLabelDetailConfig: PropTypes.string,
    nLabelSimpleConfig: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    subProducts: PropTypes.object,
    value: PropTypes.number,
  },

  getDefaultProps() {
    return {
      orderEntry: null,
      productConfig: null,
      subProducts: null,
      value: 0,
    };
  },

  getInitialState() {
    return {
      simpleMode: false,
      value: this.props.value,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 2;
    let theme = this.getTheme();
    let styles = {
      root: {
        marginLeft: padding * 5,
        paddingTop: padding * 5,
        paddingBottom: padding * 5,
        marginRight: padding * 6,
      },
      dropzoneStyle: {
        height: 100,
      },
      header:{
        marginBottom: padding,
      },
      spanSubTitle: {
        fontWeight: 300,
        fontSize: 12,
        display: 'block',
      },
      actions: {
        marginBottom: padding * 5,
      },
      simpleMode: {
        display: 'block',
      },
      detailMode: {
        display: this.state.simpleMode ? 'none' : 'block',
      },
    };

    return styles;
  },

  isNotReadyToSave() {
    return this.refs.simpleMode.isDirty();
  },

  getDirtyFiles() {
    return this.refs.simpleMode.getDirtyFiles();
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

  getCalculateConfig() {
    let productConfig = this._getProductConfig();
    let selectedSubProductConfigs = _.filter(productConfig.products, product => {
      return product.select == true;
    });
    return this._generateCalculateConfig(selectedSubProductConfigs);
  },

  renderHeader() {
    return(
      <div style={this.style('header')}>
        <div style={this.style('actions')}>
          <DropDownMenu
            ref='actions'
            key='actions'
            style={this.style('menu')}
            onChange={this._handleActionChange}
            value={this.state.value}
            defaultValue={0}
          >
            <MenuItem
              value={0}
              primaryText={this.t('nLabelSimpleConfig')}
            />
            <MenuItem
              value={1}
              primaryText={this.t('nLabelDetailConfig')}
            />
          </DropDownMenu>
        </div>
      </div>
    );
  },

  renderContent(){
    if(!this.props.productConfig) {
      return null;
    }
    let config = this._getConfig();
    let content = [];
    content.push(
      <DetailModeViewer
        ref='detailModeViewer'
        key='detailMode'
        config={config}
        style={this.style('detailMode')}
      />
    );
    content.push(
      <SimpleMode
        ref='simpleMode'
        key='simpleMode'
        config={config}
        mode={this.props.mode}
        order={this.props.order}
        orderEntry={this.props.orderEntry}
        productConfig={this.props.productConfig}
        style={this.style('simpleMode')}
      />
    );

    return content;
  },

  render() {
    let styles = this.getStyles();
    return (
      <div style = {this.style('root')}>
        {this.renderContent()}
      </div>
    );
   },

  _getProductConfig(){
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products,product=>{
      let config = product.config;
      let productCode = product.product.code;
      if(PURCHASE_CODE===productCode){
        if(config['files'] && this.refs.simpleMode){
          config['files'] = this.refs.simpleMode.getValue().files;
        }
        if(config['priceFiles'] && this.refs.simpleMode){
          config['priceFiles'] = this.refs.simpleMode.getValue().priceFiles;
        }
        if(config['feedbackFiles'] && this.refs.simpleMode){
          config['feedbackFiles'] = this.refs.simpleMode.getValue().feedbackFiles;
        }
        if(config['note']!=undefined && this.refs.simpleMode){
          config['note'] = this.refs.simpleMode.getValue().note;
        }
        if(config['articles'] && this.refs.detailModeViewer && this.refs.detailModeViewer.getWrappedInstance()){
          config['articles'] = this.refs.detailModeViewer.getWrappedInstance().getValue();
        }
        if(this.refs.simpleMode){
          config['remark'] = this.refs.simpleMode.getValue().remark;
        }
      }
      return product;
    });
    productConfig.products = products;
    return productConfig;
  },

  _generateCalculateConfig(selectedSubProductConfigs){
    this._enSureCostTypesExistForSubProducts(selectedSubProductConfigs);
    let products = _.map(selectedSubProductConfigs,productConfig=>{
      let product = productConfig.product;
      let costTypes = [];
      _.forEach(product.costTypes,costType=>{
        let variables = {};
        costTypes.push({
          _id: costType.costType._id,
          code: costType.costType.code,
          variables: variables,
        });
      });
      return {
        _id: product._id,
        code: product.code,
        name: product.name,
        costTypes: costTypes
      };
    });
    return products;
  },

  _enSureCostTypesExistForSubProducts(products){
    let subProducts = this.props.subProducts.toJS().entries;
    return _.map(products,product=>{
      if(!product.product.costTypes){
        _.forEach(subProducts,subProduct=>{
            if(subProduct._id === product.product._id){
              product.product.costTypes = subProduct.costTypes;
            }
        });
      }
      return product;
    });
  },

  _handleActionChange(event, index, value){
    let simpleMode = value === 0;
    if(this.state.simpleMode !== simpleMode){
      this.setState({
        simpleMode: simpleMode,
        value: value,
      });
    }
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

module.exports = PTPSSCEForm;
