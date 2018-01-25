const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const TextField = require('epui-md/TextField/TextField');
const Flexible = require('epui-md/ep/Flexible');
const CompanyCard = require('../components/company-card-list/company-card');
const CompanyCards = require('../components/company-card-list');
const DragDropFiles = require('../../drag-drop-files');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const BUNKER_QUANTITY_SURVEY = 'PTBKQASV';
const DRAFT_SURVEY = 'PTDRAFTSV';
const ON_HIRE_BUNKERING_AND_CONDITION_SURVEY = 'PTONHBKCDSV';
const OFF_HIRE_BUNKERING_AND_CONDITION_SURVEY = 'PTOFFHBKCDSV';
const ON_HIRE_BUNKER_SURVEY = 'PTONHBKSV';
const OFF_HIRE_BUNKER_SURVEY = 'PTOFFHBKSV';
const ORDER_MODE = require('~/src/shared/constants').ORDER_MODE;
const MAX_PARTIES = 4;

let PTSVConfigForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    mode :PropTypes.string,
    order:PropTypes.object,
    orderEntry: PropTypes.object,
    subProducts: PropTypes.object,
    productConfig: PropTypes.object,
    nTextParty: PropTypes.string,
    nTextPartyName1: PropTypes.string,
    nTextPartyName2: PropTypes.string,
    nTextPartyName3: PropTypes.string,
    nTextPartyName4: PropTypes.string,
    nLabelInspectionCompanyInfos: PropTypes.string,
    nLabelUploadInspectionFiles: PropTypes.string,
    nLabelInspectionFiles: PropTypes.string,
  },

  getDefaultProps() {
    return {
      mode: '',
      order: null,
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
      textField:{
        width: '48%',
        marginLeft : '1%',
        marginRight : '1%',
      },
      companyCards:{
        marginTop: 30,
      },
      uploader:{
        marginTop: 25,
        textAlign: 'center',
      },
      noteTitle: {
        marginTop: 25,
      },
      productChild: {
        paddingLeft: padding,
        paddingRight: padding,
      }
    };
    return styles;
  },

  isNotReadyToSave(){
    let notReadyToSaveFiles =0;
    let productConfig = this.props.productConfig.toJS();
    _.forEach(productConfig.products,product=>{
      let productCode = product.product.code;
      if(this.refs['inspectionFiles'+productCode] && this.refs['inspectionFiles'+productCode].isDirty()){
        notReadyToSaveFiles++;
      }
    });
    return notReadyToSaveFiles>0 || this.isFeedbackDirty();
  },

  isFeedbackDirty(){

  },

  getDirtyFiles(){
    let dirtyFiles = [];
    if(this.isNotReadyToSave()){
      dirtyFiles.push(this.t('nLabelInspectionFiles'));
    }
    return dirtyFiles;
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

  renderSubProductChild(config, subProduct){
    let subProductCode = subProduct.get('code');
    let child = [];
    if((BUNKER_QUANTITY_SURVEY !== subProductCode) && (DRAFT_SURVEY !== subProductCode)){
      let parties = config && config.get('parties') ? config.get('parties').toJS():[];
      for(let i = 1;i <= MAX_PARTIES;i++){
        child.push(
          <TextField
              ref = {subProductCode+'_party_'+i}
              key = {subProductCode+'_party_'+i}
              style = {this.style('textField')}
              defaultValue = {parties[i-1] ? parties[i-1]: ''}
              floatingLabelText={this.t('nTextPartyName'+i)}
              onChange = {this._handleChange}
          />
        );
      }
    }
    if(config && config.get('companyInfos')){
      child.push(
        <DragDropFiles
          key = {'inspectionFiles'+subProductCode}
          ref = {'inspectionFiles'+subProductCode}
          style = {this.style('uploader')}
          titleStyle = {this.style('dropzoneTitleStyle')}
          dropzoneStyle = {this.style('dropzone')}
          title = {this.t('nLabelUploadInspectionFiles')}
          loadedFiles={config.inspectionFiles ? config.inspectionFiles.toJS() : []}
          order ={this.props.order}
          orderEntry ={this.props.orderEntry}
          product = {subProduct}
          productConfig = {this.props.productConfig}
          field ='inspectionFiles'
        />
      );
    }
    if(config && config.get('companyInfos')){
      let push =true;
      if(config.get('companyInfos').size === 0 && this.props.mode === ORDER_MODE.CONSIGNER) push=false;
      if(push){
        child.push(
          <CompanyCards
            ref = {'companyCards_'+subProductCode}
            key = {'companyCards_'+subProductCode}
            title = {this.t('nLabelInspectionCompanyInfos')}
            viewTitle = {this.t('nLabelViewInspectionCompanyInfos')}
            style = {this.style('companyCards')}
            editable = {this.props.mode === ORDER_MODE.CONSIGNEE}
            companyCardInfos = {config.companyInfos? config.companyInfos.toJS() :[] }
          />
        );
      }
    }
    child.push(
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
    return child;
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
          <div>
            {this.renderSubProductChild(config,subProduct)}
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
      let config = product.config;
      let productCode = product.product.code;
      if(this.refs['companyCards_'+productCode]){
        config.companyInfos = this.refs['companyCards_'+productCode].getValue();
      }
      if(this.refs['inspectionFiles'+productCode]){
        config.inspectionFiles = this.refs['inspectionFiles'+productCode].getFiles();
      }
      if(this.refs['note'+productCode]){
        config.remark = this.refs['note'+productCode].getValue();
      }
      if((BUNKER_QUANTITY_SURVEY !== productCode) && (DRAFT_SURVEY !== productCode)){
        let parties = [];
        for(let i = 1;i <= MAX_PARTIES;i++){
          if(this.refs[productCode+'_party_'+i] && this.refs[productCode+'_party_'+i].getValue()){
            parties.push(this.refs[productCode+'_party_'+i].getValue());
          }
        }
        config.parties = parties;
        if(parties.length > 1 && product.priceConfig && product.priceConfig['CTSVCG|PARTY_NUMBER|value']){
          product.priceConfig['CTSVCG|PARTY_NUMBER|value'] = parties.length;
        }
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

module.exports = PTSVConfigForm;
