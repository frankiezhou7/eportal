const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const Flexible = require('epui-md/ep/Flexible');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const TextField = require('epui-md/TextField/TextField');
const PropTypes = React.PropTypes;
const COLLISION = 'PTCLSNEC';
const LEAK_OIL = 'PTLKOILEC';
const ANCHOR_MISSING = 'PTACHMISEC';
const CREW_DROP_INTO_THE_SEA = 'PTCDITSEC';
const CREW_DIE = 'PTCWDIEEC';
const MARINE_COURT_DETAIN_THE_VSL = 'PTMCDTVSLEC';
const ENGINE_LOST_POWER = 'PTMESELPEC';
const STEVEDORE_DAMAGE = 'PTSTDRDGEC';
const CREW_SEE_DOCTOR = 'PTCSDAOSEC';
const OTHERS = 'PTOTHERSEC';

let PTECConfigForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    order: PropTypes.object,
    mode: PropTypes.string,
    orderEntry: PropTypes.object,
    subProducts: PropTypes.object,
    productConfig: PropTypes.object,
  },

  getDefaultProps() {
    return {
      mode: '',
      orderEntry:null,
      subProducts:null,
      productConfig: null,
    };
  },

  getInitialState() {
    return {
      subSettings: [],
      shouldUpdate: true,
    };
  },

  // componentWillMount() {
  //   this.getInitedMessages();
  // },
  //
  // componentWillUpdate(nextProps,nextState) {
  //   let subMessages = nextState.subMessages;
  //   let subSettings = nextState.subSettings;
  //   let productConfig = this.props.productConfig;
  //
  //   let codes = [];
  //   if(this.state.shouldUpdate && subMessages && subMessages.length > 0){
  //     _.forEach(subMessages, message => {
  //       codes.push(message.setting);
  //     });
  //     let updatedCodes = _.uniq(codes);
  //     if (productConfig && productConfig.products) {
  //       productConfig.products.forEach(product => {
  //         let productDetail = product.get('product');
  //         let productCode = productDetail.get('code');
  //         if(updatedCodes.indexOf(productCode) !== -1){
  //           this.setState({['flex_'+productCode]:true});
  //         }else{
  //           this.setState({['flex_'+productCode]:false});
  //         }
  //       });
  //       this.setState({shouldUpdate: false});
  //     }
  //   }
  //
  //   if(subSettings.length > 0 && this.state.subSettings !== subSettings){
  //     _.forEach(subMessages, message => {
  //       let msgSetting = message.setting;
  //       _.forEach(subSettings, setting => {
  //           if(msgSetting === setting){
  //             if(_.isFunction(global.api.message.clearUnreadStatusById)){
  //               global.api.message.clearUnreadStatusById.promise(message.id)
  //               .then((res)=>{
  //                 if(res.status === 'OK'){
  //                   global.updateProductUnreadStatus();
  //                 }
  //               })
  //               .catch((err)=>{
  //                 console.log(this.t('nTextInitedFailed'));
  //               })
  //             }
  //           }
  //       });
  //     });
  //   }
  // },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding =10;
    let theme = this.getTheme();
    let styles = {
      root:{
        paddingTop :padding,
        paddingBottom :padding,
      },
      subProducts:{
        marginBottom: padding,
      },
      flexible:{
        textAlign: 'left',
      },
      noteTitle: {
        marginTop: 10,
      }
    };
    return styles;
  },

  getInitedMessages() {
    if(_.isFunction(global.api.message.getMessages)){
      global.api.message.getMessages.promise(this.props.orderEntry._id, 'config', false)
      .then((res)=>{
        if(res.status === 'OK'){
         this.getSubMessages(res.response.data);
        }
      })
      .catch((err)=>{
        console.log(this.t('nTextInitedFailed'));
      })
    }
  },

  getSubMessages(configs) {
    let subProducts = _.get(this.props.orderEntry.toJS(), ['productConfig', 'products'], []);
    if(subProducts.length > 1){
      let subMessages = [];
      _.forEach(configs, config => {
          let subSetting = _.get(config,['data','subentry'], '');
          let subMessage = {id: config._id, setting: subSetting}
          subMessages.push(subMessage);
      });
      this.setState({subMessages});
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

  getCalculateConfig(){
    let productConfig = this._getProductConfig();
    let selectedSubProductConfigs=_.filter(productConfig.products,product=>{
      return product.select==true;
    });
    return this._generateCalculateConfig(selectedSubProductConfigs);
  },

  renderFeedbackNote(config,subProduct){
    let {mode,order,productConfig}=this.props;
    let subProductCode =subProduct.get('code');
    return (
      <div>
        <TextField
          ref ={'note'+subProductCode}
          key = {'note'+subProductCode}
          floatingLabelText={this.t('nLabelNote')}
          defaultValue = {config && config.remark}
          fullWidth = {true}
          onChange = {this._handleChange}
        />
      </div>
    );
  },

  renderSubProduct(select,config,subProduct){
    return (
      <div
        style={this.style('subProducts')}
        key = {subProduct.get('name')}
      >
        <Flexible
          ref = {'flex_'+subProduct.get('code')}
          title ={subProduct.get('name')}
          select = {select}
          childStyle = {this.style('flexible')}
          expandable ={true}
          onCheck = {this._handleChange}
          isUpdate={this.state['flex_' + subProduct.get('code')]}
          onClearUnreadStatus={this._handleClearUnreadStatus.bind(this,subProduct.get('code'))}
        >
          {this.renderFeedbackNote(config.toJS(),subProduct)}
        </Flexible>
      </div>
    );
  },

  renderSubProducts(){
    let subProductsElems=[];
    let productConfig = this.props.productConfig;
    if(productConfig && productConfig.products){
      productConfig.products.forEach(product=>{
        let productDetail = product.get('product');
        let select = product.get('select');
        let config = product.get('config');
        subProductsElems.push(this.renderSubProduct(select,config,productDetail));
      });
    }
    return subProductsElems;
  },

  render() {
    let styles = this.getStyles();
    return (
      <div style = {this.style('root')}>
        {this.renderSubProducts()}
      </div>
    );
   },

   _handleClearUnreadStatus(code){
     let { subSettings } = this.state;
     subSettings.push(code);
     this.setState({
       ['flex_'+code]: false,
       subSettings: _.uniq(subSettings),
     });
   },

  _getProductConfig(){
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products,product=>{
      if(this.refs['flex_'+product.product.code]){
        product.select = this.refs['flex_'+product.product.code].isSelected();
      }
      let config = product.config;
      let productCode = product.product.code;
      if(this.refs['note'+productCode]){
        let noteValue = this.refs['note'+productCode].getValue();
        product.config.remark=noteValue;
      }

      return product;
    });
    productConfig.products = products;
    return productConfig;
  },

  _generateCalculateConfig(selectedSubProductConfigs){
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

  _handleChange(){
    global.notifyOrderDetailsChange(true);
  },
});

module.exports = PTECConfigForm;
