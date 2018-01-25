const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DragDropFiles = require('../../drag-drop-files');
const Flexible = require('epui-md/ep/Flexible');
const PersonList = require('../components/person-list');
const TextField = require('epui-md/TextField/TextField');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const SHIP_SANITATION_CERTIFICATE = 'PTSSCEC';
const HEALTH_CERTIFICATE = 'PTHLTHCC';
const YELLOW_CERTIFICATE = 'PTYLLOWCC';
const RENEW_SHIP_CERTIFICATE = 'PTRSCAC';

let PTRSCCConfigForm = React.createClass({

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
    nTextShipSanitation:PropTypes.string,
    nTextHealthCertificate:PropTypes.string,
    nTextYellowCertificate:PropTypes.string,
    nTextUploadShipSanitation:PropTypes.string,
    nTextUploadHealthCertificate:PropTypes.string,
    nTextUploadYellowCertificate:PropTypes.string,
    nLabelPersonName:PropTypes.string,
    nLabelPersonPhone:PropTypes.string,
  },

  getDefaultProps() {
    return {
      orderEntry:null,
      subProducts:null,
      productConfig: null,
    };
  },

  getInitialState: function() {
    let healthCertifiPersons =[];
    let yellowCertifiPersons =[];
    let productConfig = this.props.productConfig.toJS();
    if(productConfig && productConfig.products){
      _.forEach(productConfig.products,product=>{
        let productCode = product.product.code;
        let config = product.config;
        if(config && _.isArray(config.persons)){
          if(productCode === HEALTH_CERTIFICATE){
            healthCertifiPersons = config.persons;
          }else if(productCode ===  YELLOW_CERTIFICATE){
            yellowCertifiPersons = config.persons;
          }
        }
      });
    }
    return {
      healthCertifiPersons:healthCertifiPersons,
      yellowCertifiPersons:yellowCertifiPersons,
      editPerson:null,
      subSettings: [],
      shouldUpdate: true,
    };
  },

  // componentWillMount() {
  //   this.getInitedMessages();
  // },

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
      dropzoneStyle:{
        height: 100,
      },
      title:{
        display: 'block',
        marginBottom: padding,
      },
      subTitle:{
        display: 'block',
        marginBottom: padding,
        fontWeight: 500,
        fontSize: 15,
      },
      personList:{
        textAlign: 'left',
        marginBottom: padding*3,
      },
      person:{
        marginRight: padding*3,
      },
      dialogChild:{
        textAlign: 'left',
      },
      noteTitle: {
        textAlign: 'left',
        marginTop: 15,
      }
    };
    return styles;
  },

  isNotReadyToSave(){
    return (this.refs.shipCertificate && this.refs.shipCertificate.isDirty())||
           (this.refs.oldYellowCertificate && this.refs.oldYellowCertificate.isDirty())||
           (this.refs.oldHealthCertificate && this.refs.oldHealthCertificate.isDirty());
  },


  isFeedbackDirty(){

  },

  getDirtyFiles(){
    let dirtyFiles = [];
    if(this.refs.shipCertificate && this.refs.shipCertificate.isDirty()){
      dirtyFiles.push(this.t('nTextShipSanitation'));
    }
    if(this.refs.oldYellowCertificate && this.refs.oldYellowCertificate.isDirty()){
      dirtyFiles.push(this.t('nTextYellowCertificate'));
    }
    if(this.refs.oldHealthCertificate && this.refs.oldHealthCertificate.isDirty()){
      dirtyFiles.push(this.t('nTextHealthCertificate'));
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

  renderDialogChild(){
    return(
      <div style ={this.style('dialogChild')} >
        <TextField
          ref = 'personName'
          key= 'personName'
          style= {this.style('person')}
          floatingLabelText={this.t('nLabelPersonName')}
          defaultValue = {this.state.editPerson ? this.state.editPerson.name: ''}
        />
        <TextField
          ref = 'personPhone'
          key= 'personPhone'
          style= {this.style('person')}
          floatingLabelText={this.t('nLabelPersonPhone')}
          defaultValue = {this.state.editPerson ? this.state.editPerson.phone: ''}
        />
      </div>
    );
  },

  renderSubProductChild(config, subProduct){
    let subProductCode = subProduct.get('code');
    let {mode,order,productConfig}=this.props;
    let child = [];
    switch (subProductCode) {
      case SHIP_SANITATION_CERTIFICATE:
        if(config.get('shipCertificate')){
          child.push(
            <DragDropFiles
              key = 'shipCertificate'
              ref = 'shipCertificate'
              dropzoneStyle = {this.style('dropzone')}
              title = {this.t('nTextUploadShipSanitation')}
              loadedFiles={config.get('shipCertificate').toJS()}
              order ={this.props.order}
              orderEntry ={this.props.orderEntry}
              product = {subProduct}
              productConfig = {this.props.productConfig}
              field ='shipCertificate'
            />
          );
        }
      break;
      case HEALTH_CERTIFICATE:
        if(config.get('persons')){
          child.push(
            <div
              key = {HEALTH_CERTIFICATE+'.persons'}
              style = {this.style('personList')}
            >
              <PersonList
                title = {this.state.editPerson ? this.t('nTextEditPerson') :this.t('nTextAddPersonInfo')}
                confirmedLabel ={this.state.editPerson ? this.t('nTextEditPerson'):this.t('nLabelButton')}
                persons = {this.state.healthCertifiPersons}
                dialogChild = {this.renderDialogChild()}
                onRemove ={this._handleRemoveHealthCertifiPerson}
                onPersonModify={this._handleModifyPerson}
                onAddPerson = {this._handleAddPerson}
                onDialogSubmit = {this._handleAddHealthCertifiPersonSubmit}
              />
            </div>
          );
        }
        if(config.get('oldHealthCertificate')){
          child.push(
            <DragDropFiles
              key = 'oldHealthCertificate'
              ref = 'oldHealthCertificate'
              dropzoneStyle = {this.style('dropzone')}
              title = {this.t('nTextUploadHealthCertificate')}
              loadedFiles={config.get('oldHealthCertificate').toJS()}
              order ={this.props.order}
              orderEntry ={this.props.orderEntry}
              product = {subProduct}
              productConfig = {this.props.productConfig}
              field ='oldHealthCertificate'
            />
          );
        }
      break;
      case YELLOW_CERTIFICATE:
        if(config.get('persons')){
          child.push(
            <div
              key = {YELLOW_CERTIFICATE+'.persons'}
              style = {this.style('personList')}
            >
              <PersonList
                title = {this.state.editPerson ? this.t('nTextEditPerson') :this.t('nTextAddPersonInfo')}
                confirmedLabel ={this.state.editPerson ? this.t('nTextEditPerson'):this.t('nLabelButton')}
                persons = {this.state.yellowCertifiPersons}
                dialogChild = {this.renderDialogChild()}
                onRemove ={this._handleRemoveYellowCertifiPerson}
                onPersonModify={this._handleModifyPerson}
                onAddPerson = {this._handleAddPerson}
                onDialogSubmit = {this._handleAddYellowCertifiPersonSubmit}
              />
            </div>
          );
        }
        if(config.get('oldYellowCertificate')){
          child.push(
            <DragDropFiles
              key = 'oldYellowCertificate'
              ref = 'oldYellowCertificate'
              dropzoneStyle = {this.style('dropzone')}
              title = {this.t('nTextUploadYellowCertificate')}
              loadedFiles={config.get('oldYellowCertificate').toJS()}
              order ={this.props.order}
              orderEntry ={this.props.orderEntry}
              product = {subProduct}
              productConfig = {this.props.productConfig}
              field ='oldYellowCertificate'
            />
          );
        }
      break;
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
          expandable ={true}
          onCheck = {this._handleChange}
          isUpdate={this.state['flex_' + subProduct.get('code')]}
          onClearUnreadStatus={this._handleClearUnreadStatus.bind(this,subProduct.get('code'))}
        >
          {this.renderSubProductChild(config,subProduct)}
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
        if(config!==undefined){
          subProductsElems.push(this.renderSubProduct(select,config,productDetail));
        }
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
      switch (productCode) {
        case SHIP_SANITATION_CERTIFICATE:
          if(config.shipCertificate && this.refs.shipCertificate){
            config.shipCertificate = this.refs.shipCertificate.getFiles();
          }
          break;
        case HEALTH_CERTIFICATE:
          if(config.oldHealthCertificate && this.refs.oldHealthCertificate){
            config.oldHealthCertificate = this.refs.oldHealthCertificate.getFiles();
          }
          if(config.persons){
            config.persons = this.state.healthCertifiPersons;
          }
          break;
        case YELLOW_CERTIFICATE:
          if(config.oldYellowCertificate && this.refs.oldYellowCertificate){
            config.oldYellowCertificate = this.refs.oldYellowCertificate.getFiles();
          }
          if(config.persons){
            config.persons = this.state.yellowCertifiPersons;
          }
          break;
      }
      if(this.refs['note'+productCode]){
        let noteValue = this.refs['note'+productCode].getValue();
        config.remark=noteValue;
      }
      return product;
    });
    productConfig.products = products;
    return productConfig;
  },

  _handlePersons(persons,editPerson){
    let name = this.refs.personName.getValue();
    let phone = this.refs.personPhone.getValue();
    if(editPerson){
      _.forEach(persons,(person)=>{
        if(person.id === editPerson.id){
          person.name=name;
          person.phone=phone;
        }
      });
    }else{
      let person = {
        id: Math.random()*1001,
        name: name,
        phone:phone
      };
      persons.push(person);
    }
    return persons;
  },

  _handleAddYellowCertifiPersonSubmit(){
    let persons = this._handlePersons(this.state.yellowCertifiPersons,this.state.editPerson);
    this.setState({yellowCertifiPersons:persons,editPerson:null});
  },

  _handleRemoveYellowCertifiPerson(id){
    let persons = this.state.yellowCertifiPersons;
    persons = _.reject(persons,person=>{
      return person.id == id;
    });
    this.setState({
      yellowCertifiPersons: persons,
    });
  },

  _handleAddHealthCertifiPersonSubmit(){
    let persons = this._handlePersons(this.state.healthCertifiPersons,this.state.editPerson);
    this.setState({healthCertifiPersons:persons,editPerson:null});
  },

  _handleRemoveHealthCertifiPerson(id){
    let persons = this.state.healthCertifiPersons;
    persons = _.reject(persons,person=>{
      return person.id == id;
    });
    this.setState({
      healthCertifiPersons: persons,
    });
  },

  _handleModifyPerson(id,fn){
    this.setState({editPerson: id},()=>{fn();});
  },

  _handleAddPerson(showDialog){
    if(this.state.editPerson){
      this.setState({editPerson: null},()=>{showDialog()});
    }else{
      showDialog();
    }
  },

  _handleChange(){
    global.notifyOrderDetailsChange(true);
  },
});

module.exports = PTRSCCConfigForm;
