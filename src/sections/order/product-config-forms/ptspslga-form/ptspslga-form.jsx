const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const DragDropFiles = require('../../drag-drop-files');
const Flexible = require('epui-md/ep/Flexible');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField/TextField');
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Dialog = require('epui-md/ep/Dialog');
const FlatButton = require('epui-md/FlatButton');
const Translatable = require('epui-intl').mixin;
const GABAGE = 'PTGABAGE';
const GABAGE_COST_TYPE = 'CTGGDISAL_ADD';
const SLUDGE = 'PTSLUDGE';
const SPRO = 'PTSPRO';

const PTSPSLGAConfigForm = React.createClass({
  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
    require(`epui-intl/dist/Address/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    mode: PropTypes.string,
    nTextGarbageCerti: PropTypes.string,
    nTextSludge: PropTypes.string,
    nTextSludgeCerti: PropTypes.string,
    nTextSludgeQuantity: PropTypes.string,
    nTextSproAuthLetter: PropTypes.string,
    nTextSproCounterSpro: PropTypes.string,
    nTextSubTitle: PropTypes.string,
    nTextTonnageUnit: PropTypes.string,
    nTextUploadGarbageCerti: PropTypes.string,
    nTextUploadSludge: PropTypes.string,
    nTextUploadSludgeCerti: PropTypes.string,
    nTextUploadSproAuthLetter: PropTypes.string,
    nTextUploadSproCounterSpro: PropTypes.string,
    nTextSludgeQuantityUnit: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    subProducts: PropTypes.object,
  },

  getDefaultProps() {
    return {
      mode: '',
      orderEntry: null,
      subProducts: null,
      productConfig: null
    };
  },

  getInitialState() {
    return {
      error: false,
      open: false,
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
    let padding = 10;
    let theme = this.getTheme();

    let styles = {
      root: {
        paddingTop: padding,
        paddingBottom: padding,
      },
      subProducts: {
        marginBottom: padding,
      },
      dropzoneStyle: {
        height: 100,
      },
      title: {
        display: 'block',
        marginBottom: padding,
      },
      subTitle: {
        display: 'block',
        marginBottom: padding,
        fontWeight: 500,
        fontSize: 15,
      },
      sludgeQuantity: {
        marginTop: -20,
        textAlign: 'left',
      },
      noteTitle: {
        textAlign: 'left',
        marginTop: 20,
      },
      container: {
        marginTop: 20,
      }
    };

    return styles;
  },

  isNotReadyToSave() {
    return (this.refs.counterSproFiles && this.refs.counterSproFiles.isDirty()) ||
           (this.refs.authLetterFiles && this.refs.authLetterFiles.isDirty()) ||
           (this.refs.sludgeFiles && this.refs.sludgeFiles.isDirty()) ||
           (this.refs.sludgeCertificateFiles && this.refs.sludgeCertificateFiles.isDirty()) ||
           (this.refs.garbageCertificateFiles && this.refs.garbageCertificateFiles.isDirty());
            // || this.isFeedbackDirty();
  },

  isFeedbackDirty() {
    // let isDirty = false;
    // let productConfig = this.props.productConfig;
    // if (productConfig && productConfig.products) {
    //   productConfig.products.forEach(product => {
    //     let productCode = product.get('product').get('code');
    //     if (this.refs['feedbackNote' + productCode] && this.refs['feedbackNote' + productCode].isDirty()) {
    //       isDirty = true;
    //     }
    //   });
    // }
    // return isDirty;
  },

  getDirtyFiles() {
    let dirtyFiles = [];
    if (this.refs.counterSproFiles && this.refs.counterSproFiles.isDirty()) {
      dirtyFiles.push(this.t('nTextSproCounterSpro'));
    }
    if (this.refs.authLetterFiles && this.refs.authLetterFiles.isDirty()) {
      dirtyFiles.push(this.t('nTextSproAuthLetter'));
    }
    if (this.refs.sludgeFiles && this.refs.sludgeFiles.isDirty()) {
      dirtyFiles.push(this.t('nTextSludge'));
    }
    if (this.refs.sludgeCertificateFiles && this.refs.sludgeCertificateFiles.isDirty()) {
      dirtyFiles.push(this.t('nTextSludgeCerti'));
    }
    if (this.refs.garbageCertificateFiles && this.refs.garbageCertificateFiles.isDirty()) {
      dirtyFiles.push(this.t('nTextGarbageCerti'));
    }
    // if (this.isFeedbackDirty()) {
    //   dirtyFiles.push(this.t('nLabelFeedBackFiles'));
    // }
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

  renderSubProductChild(config, subProduct) {
    let child = [];
    let subProductCode = subProduct.get('code');

    switch (subProductCode) {
      case SPRO:
        if(config.get('authLetterFiles')) {
          child.push(
            <div style={this.style('container')}>
              <DragDropFiles
                ref='authLetterFiles'
                key='authLetterFiles'
                dropzoneStyle={this.style('dropzone')}
                field='authLetterFiles'
                loadedFiles={config.get('authLetterFiles').toJS()}
                order={this.props.order}
                orderEntry={this.props.orderEntry}
                product={subProduct}
                productConfig={this.props.productConfig}
                title={this.t('nTextUploadSproAuthLetter')}
              />
            </div>
          );
        }
        if(config.get('counterSproFiles')) {
          child.push(
            <div style={this.style('container')}>
              <DragDropFiles
                ref='counterSproFiles'
                key='counterSproFiles'
                dropzoneStyle={this.style('dropzone')}
                field='counterSproFiles'
                loadedFiles={config.get('counterSproFiles').toJS()}
                order={this.props.order}
                orderEntry={this.props.orderEntry}
                product={subProduct}
                productConfig={this.props.productConfig}
                title={this.t('nTextUploadSproCounterSpro')}
              />
            </div>
          );
        }
      break;
      case SLUDGE:
        if(config.get('sludgeQuantity') !== undefined) {
          const actions = [
            <FlatButton
              label={this.t('nLabelDialogConfirm')}
              primary={true}
              keyboardFocused={true}
              onTouchTap={this._handleDialogClose}
            />,
          ];
          child.push(
            <div
              key ='sludgeQuantityContainer'
              style={this.style('sludgeQuantity')}
            >
              <div style = {this.style('root')}>
                <TextFieldUnit
                  ref = 'sludgeQuantity'
                  key = 'sludgeQuantity'
                  style= {this.style('textFieldUnit')}
                  defaultValue={config.get('sludgeQuantity') === 0 ? '' : config.get('sludgeQuantity')}
                  floatingLabelText={this.t('nTextSludgeQuantity') + '(' + this.t('nTextTonnageUnit') + ')'}
                  unitLabelText={this.t('nTextSludgeQuantityUnit')}
                  onBlur={this._handleBlur}
                  onChange={this._componentChange.bind(this,'sludgeQuantity')}
                />
              </div>
              <Dialog
                title={this.t('nTextTypeErrorTitle')}
                actions={actions}
                modal={false}
                open={this.state.open||this.state.error}
              >
                {this.rendeErrorNotification()}
              </Dialog>
            </div>
          );
        }
        if(config.get('sludgeFiles')) {
          child.push(
            <div style={this.style('container')}>
              <DragDropFiles
                ref='sludgeFiles'
                key='sludgeFiles'
                dropzoneStyle={this.style('dropzone')}
                field='sludgeFiles'
                loadedFiles={config.get('sludgeFiles').toJS()}
                order={this.props.order}
                orderEntry={this.props.orderEntry}
                product={subProduct}
                productConfig={this.props.productConfig}
                title={this.t('nTextUploadSludge')}
              />
            </div>
          );
        }
        if(config.get('sludgeCertificateFiles')){
          child.push(
            <div style={this.style('container')}>
              <DragDropFiles
                ref='sludgeCertificateFiles'
                key='sludgeCertificateFiles'
                dropzoneStyle={this.style('dropzone')}
                field='sludgeCertificateFiles'
                loadedFiles={config.get('sludgeCertificateFiles').toJS()}
                order={this.props.order}
                orderEntry={this.props.orderEntry}
                product={subProduct}
                productConfig={this.props.productConfig}
                title={this.t('nTextUploadSludgeCerti')}
              />
            </div>
          );
        }
      break;
      case GABAGE:
      if(config.get('garbageCertificateFiles')) {
        child.push(
          <div style={this.style('container')}>
            <DragDropFiles
              ref='garbageCertificateFiles'
              key='garbageCertificateFiles'
              dropzoneStyle={this.style('dropzone')}
              field='garbageCertificateFiles'
              loadedFiles={config.get('garbageCertificateFiles').toJS()}
              order={this.props.order}
              orderEntry={this.props.orderEntry}
              product={subProduct}
              productConfig={this.props.productConfig}
              title={this.t('nTextUploadGarbageCerti')}
            />
          </div>
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

  renderSubProduct(select, config, subProduct) {
    // const actions = [
    //   <FlatButton
    //     label={this.t('nLabelDialogConfirm')}
    //     primary={true}
    //     keyboardFocused={true}
    //     onTouchTap={this._handleDialogClose}
    //   />,
    // ];
    return (
      <div
        key={subProduct.get('name')}
        style={this.style('subProducts')}
      >
        <Flexible
          key={'flex_' + subProduct.get('code')}
          ref={'flex_' + subProduct.get('code')}
          expandable={true}
          onCheck={this._handleChange}
          select={select}
          title={subProduct.get('name')}
          isUpdate={this.state['flex_' + subProduct.get('code')]}
          onClearUnreadStatus={this._handleClearUnreadStatus.bind(this,subProduct.get('code'))}
        >
          {this.renderSubProductChild(config, subProduct)}
          {/* <Dialog
            title={this.t('nTextTypeErrorTitle')}
            actions={actions}
            modal={false}
            open={this.state.open||this.state.error}
          >
            {this.rendeErrorNotification()}
          </Dialog> */}
        </Flexible>
      </div>
    );
  },

  rendeErrorNotification() {
    if(this.state.open) {
      return this.t('nTextTypeError');
    }else if(this.state.error){
      return this.t('nTextPostCodeError');
    }
  },

  renderSubProducts() {
    let subProductsElems = [];
    let productConfig = this.props.productConfig;
    if (productConfig && productConfig.products) {
      productConfig.products.forEach(product => {
        let productDetail = product.get('product');
        let select = product.get('select');
        let config = product.get('config');
        if (config !== undefined) {
          subProductsElems.push(this.renderSubProduct(select, config, productDetail));
        }
      });
    }
    return subProductsElems;
  },

  render() {
    let styles=this.getStyles();

    return (
      <div style={this.style('root')}>
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

  _getProductConfig() {
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products, product => {
      if (this.refs['flex_' + product.product.code]) {
        product.select = this.refs['flex_' + product.product.code].isSelected();
      }
      let config = product.config;
      let productCode = product.product.code;
      switch (productCode) {
        case SPRO:
          if (config.authLetterFiles && this.refs.authLetterFiles) {
            config.authLetterFiles = this.refs.authLetterFiles.getFiles();
          }
          if (config.counterSproFiles && this.refs.counterSproFiles) {
            config.counterSproFiles = this.refs.counterSproFiles.getFiles();
          }
          break;
        case SLUDGE:
          if (config.sludgeFiles && this.refs.sludgeFiles) {
            config.sludgeFiles = this.refs.sludgeFiles.getFiles();
          }
          if (config.sludgeCertificateFiles && this.refs.sludgeCertificateFiles) {
            config.sludgeCertificateFiles = this.refs.sludgeCertificateFiles.getFiles();
          }
          if (config.sludgeQuantity != undefined && this.refs.sludgeQuantity) {
            config.sludgeQuantity = this.refs.sludgeQuantity.getValue();
          }
          break;
        case GABAGE:
          if (config.garbageCertificateFiles && this.refs.garbageCertificateFiles) {
            config.garbageCertificateFiles = this.refs.garbageCertificateFiles.getFiles();
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

  _generateCalculateConfig(selectedSubProductConfigs) {
    let products = _.map(selectedSubProductConfigs, productConfig => {
      let product = productConfig.product;
      let costTypes = [];
      _.forEach(product.costTypes, costType => {
        let variables = {};
        if (product.code === GABAGE && costType.costType.code === GABAGE_COST_TYPE) {
          variables.GARBAGE_QUANTITY = productConfig.config['variables|CTGGDISAL|GARBAGE_QUANTITY'];
        }
        costTypes.push({_id: costType.costType._id, code: costType.costType.code, variables: variables});
      });
      return {_id: product._id, code: product.code, name: product.name, costTypes: costTypes};
    });
    return products;
  },

  _handleChange() {
    global.notifyOrderDetailsChange(true);
  },

  _handleDialogClose() {
    this.setState({
        open: false,
        error: false,
      });
  },

  _componentChange(name) {
    global.notifyOrderDetailsChange(true);
    let value = this.refs.sludgeQuantity.getValue();
    if(isNaN(value)) {
      this.setState({error:true});
      this.refs.sludgeQuantity.clearValue();
    }
  },
});

module.exports = PTSPSLGAConfigForm;
