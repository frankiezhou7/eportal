const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const TextField = require('epui-md/TextField/TextField');
const Flexible = require('epui-md/ep/Flexible');
const FormContainer = require('./form-container');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const OnSigner = require('./on-signer');
const OffSigner = require('./off-signer');
const PropTypes = React.PropTypes;
const ON_SIGNER = 'PTCCONS';
const OFF_SIGNER = 'PTCCOFFS';


let PTCCConfigForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    mode : PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    seaManClasses:  PropTypes.object,
    invitationLetterTypes: PropTypes.object,
    issuingAuthorities:  PropTypes.object,
  },

  getDefaultProps() {
    return {
      mode : '',
      order: null,
      orderEntry:null,
      productConfig: null,
      seaManClasses: null,
      invitationLetterTypes: null,
      issuingAuthorities:  null,
    };
  },

  getInitialState() {
    return {
      subSettings: [],
      shouldUpdate: true,
    }
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
  //   //update unread message
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
  //   // clear unread message status
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
        paddingBottom :padding,
      },
      subProducts:{
        marginBottom: padding,
      },
      flexible:{
        textAlign: 'left',
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

  isNotReadyToSave(){
    return (this.refs.onSigner && this.refs.onSigner.isNotReadyToSave()) ||
           (this.refs.offSigner && this.refs.offSigner.isNotReadyToSave());
  },

  getDirtyFiles(){
    let dirtyFiles =[];
    if(this.refs.onSigner){
      _.map(this.refs.onSigner.getDirtyFiles(), function(name){
        return dirtyFiles.push(name);
      });
    }
    if(this.refs.offSigner){
      _.map(this.refs.offSigner.getDirtyFiles(), function(name){
        return dirtyFiles.push(name);
      });
    }
    return _.uniq(dirtyFiles);
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

  renderSubProduct(select,config,subProduct){
    let {seaManClasses,invitationLetterTypes, issuingAuthorities,order,orderEntry,productConfig} =this.props;
    let child = null;
    let subProductCode = subProduct.get('code');
    switch (subProductCode) {
      case ON_SIGNER:
        child=(
          <OnSigner
            ref = 'onSigner'
            mode= {this.props.mode}
            order={order}
            orderEntry ={orderEntry}
            product={subProduct}
            productConfigImmu = {productConfig}
            productConfig={config.toJS()}
            seaManClasses={seaManClasses}
            invitationLetterTypes={invitationLetterTypes}
            issuingAuthorities={issuingAuthorities}
          />
        );
        break;
      case OFF_SIGNER:
        child=(
          <OffSigner
            ref = 'offSigner'
            mode= {this.props.mode}
            order={order}
            orderEntry ={orderEntry}
            product={subProduct}
            productConfigImmu = {productConfig}
            productConfig={config.toJS()}
            seaManClasses={seaManClasses}
            invitationLetterTypes={invitationLetterTypes}
            issuingAuthorities={issuingAuthorities}
          />
        );
        break;
    }
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
          <div>
            {child}
          </div>
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
      let productCode = product.product.code;
      if(productCode === ON_SIGNER && this.refs.onSigner){
        product.config=this.refs.onSigner.getProductConfig();
      }else if(productCode === OFF_SIGNER && this.refs.offSigner){
        product.config=this.refs.offSigner.getProductConfig();
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

module.exports = PTCCConfigForm;
