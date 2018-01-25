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
const _ = require('eplodash');
const FIRE_WORK_PERMIT = 'PTFRWKPMT';
const FRESH_WATER_ANALYSIS = 'PTFHWTANAS';
const FW_SUPPLY = 'PTFWSPY';
const MAGNETIC_COMPASS_ADJUST = 'PTMACMADJST';
const MAIN_ENGINE_IMMIBILIZATION = 'PTMEIMBIN';

const PTOMREQForm = React.createClass({
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
    nTextCalibrationyCertificate: PropTypes.string,
    nTextFireWorkPermet: PropTypes.string,
    nTextLaboratoryCertificate: PropTypes.string,
    nTextMagneticCompassModel: PropTypes.string,
    nTextRecordApplication: PropTypes.string,
    nTextSupplyQuantity: PropTypes.string,
    nTextTonnageUnit: PropTypes.string,
    nTextUploadCalibrationyCertificate: PropTypes.string,
    nTextUploadFireWorkPermet: PropTypes.string,
    nTextUploadLaboratoryCertificate: PropTypes.string,
    nTextUploadRecordApplication: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    subProducts: PropTypes.object,
  },

  getDefaultProps() {
    return {
      orderEntry: null,
      productConfig: null,
      subProducts: null,
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
    let padding = 10;
    let theme = this.getTheme();
    let styles = {
      root:{
        paddingTop: padding,
        paddingBottom: padding,
      },
      subProducts: {
        marginBottom: padding,
      },
      flexible: {
        textAlign: 'left',
      },
      noteTitle: {
        marginTop: 15,
      },
      productChild: {
        paddingLeft: padding,
        paddingRight: padding,
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
          let subMessage = {id: config._id, setting:subSetting}
          subMessages.push(subMessage);
      });
      this.setState({subMessages});
    }
  },

  isNotReadyToSave() {
    return (this.refs.permitFiles && this.refs.permitFiles.isDirty()) ||
           (this.refs[FIRE_WORK_PERMIT + 'recordApplicationFiles'] && this.refs[FIRE_WORK_PERMIT+'recordApplicationFiles'].isDirty()) ||
           (this.refs[MAIN_ENGINE_IMMIBILIZATION + 'recordApplicationFiles'] && this.refs[MAIN_ENGINE_IMMIBILIZATION + 'recordApplicationFiles'].isDirty()) ||
           (this.refs.laboratoryCertificateFiles && this.refs.laboratoryCertificateFiles.isDirty()) ||
           (this.refs.calibrationCertificateFiles && this.refs.calibrationCertificateFiles.isDirty()) ||
           this.isFeedbackDirty();
  },

  isFeedbackDirty() {

  },

  getDirtyFiles() {
    let dirtyFiles = [];
    if (this.refs.permitFiles && this.refs.permitFiles.isDirty()) {
      dirtyFiles.push(this.t('nTextFireWorkPermet'));
    }
    if (this.refs[FIRE_WORK_PERMIT + 'recordApplicationFiles'] && this.refs[FIRE_WORK_PERMIT + 'recordApplicationFiles'].isDirty()) {
      dirtyFiles.push(this.t('nTextRecordApplication'));
    }
    if (this.refs[MAIN_ENGINE_IMMIBILIZATION + 'recordApplicationFiles'] && this.refs[MAIN_ENGINE_IMMIBILIZATION + 'recordApplicationFiles'].isDirty()) {
      dirtyFiles.push(this.t('nTextRecordApplication'));
    }
    if (this.refs.laboratoryCertificateFiles && this.refs.laboratoryCertificateFiles.isDirty()) {
      dirtyFiles.push(this.t('nTextLaboratoryCertificate'));
    }
    if (this.refs.calibrationCertificateFiles && this.refs.calibrationCertificateFiles.isDirty()) {
      dirtyFiles.push(this.t('nTextCalibrationyCertificate'));
    }

    return dirtyFiles;
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
    let {
      mode,
      order,
      productConfig,
    } = this.props;

    switch (subProductCode) {
      case FIRE_WORK_PERMIT:
        if(config && config.get('permitFiles') !== undefined) {
          child.push(
            <DragDropFiles
              {...this.props}
              ref='permitFiles'
              key='permitFiles'
              dropzoneStyle={this.style('dropzone')}
              field='permitFiles'
              loadedFiles={config.get('permitFiles').toJS()}
              order={this.props.order}
              orderEntry={this.props.orderEntry}
              product={subProduct}
              productConfig={this.props.productConfig}
              title={this.t('nTextUploadFireWorkPermet')}
            />
          );
        }
        if(config && config.get('recordApplicationFiles') !== undefined) {
          child.push(
            <DragDropFiles
              {...this.props}
              ref={FIRE_WORK_PERMIT + 'recordApplicationFiles'}
              key={FIRE_WORK_PERMIT + 'recordApplicationFiles'}
              dropzoneStyle={this.style('dropzone')}
              field='recordApplicationFiles'
              loadedFiles={config.get('recordApplicationFiles').toJS()}
              order={this.props.order}
              orderEntry={this.props.orderEntry}
              product={subProduct}
              productConfig={this.props.productConfig}
              title={this.t('nTextUploadRecordApplication')}
            />
          );
        }
        break;
      case FW_SUPPLY:
        if(config && config.get('supplyQuantity')!== undefined) {
          const actions = [
            <FlatButton
              label={this.t('nLabelDialogConfirm')}
              primary={true}
              keyboardFocused={true}
              onTouchTap={this._handleDialogClose}
            />,
          ];
          child.push(
            <div>
              <div style = {_.omit(this.style('root'), ['marginLeft'])}>
                <TextFieldUnit
                  ref='supplyQuantity'
                  key='supplyQuantity'
                  defaultValue={config.get('supplyQuantity') ? config.get('supplyQuantity') : ''}
                  floatingLabelText={this.t('nTextSupplyQuantity')}
                  onChange={this._componentChange.bind(this,'supplyQuantity')}
                  unitLabelText={this.t('nTextTonnageUnit')}
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
        break;
      case FRESH_WATER_ANALYSIS:
        if(config && config.get('laboratoryCertificateFiles') !== undefined) {
          child.push(
            <DragDropFiles
              {...this.props}
              ref='laboratoryCertificateFiles'
              key='laboratoryCertificateFiles'
              dropzoneStyle={this.style('dropzone')}
              field='laboratoryCertificateFiles'
              loadedFiles={config.get('laboratoryCertificateFiles').toJS()}
              order={this.props.order}
              orderEntry={this.props.orderEntry}
              product={subProduct}
              productConfig={this.props.productConfig}
              title={this.t('nTextUploadLaboratoryCertificate')}
            />
          );
        }
        break;
      case MAGNETIC_COMPASS_ADJUST:
        if(config && config.get('magneticCompassModel') !== undefined) {
          child.push(
            <TextField
              ref='magneticCompassModel'
              key='magneticCompassModel'
              defaultValue={config.get('magneticCompassModel') ? config.get('magneticCompassModel') : ''}
              floatingLabelText={this.t('nTextMagneticCompassModel')}
              onChange={this._handleChange}
            />
          );
        }
        if(config && config.get('calibrationCertificateFiles') !== undefined) {
          child.push(
            <DragDropFiles
              {...this.props}
              ref='calibrationCertificateFiles'
              key='calibrationCertificateFiles'
              dropzoneStyle={this.style('dropzone')}
              field='calibrationCertificateFiles'
              loadedFiles={config.get('calibrationCertificateFiles').toJS()}
              order={this.props.order}
              orderEntry={this.props.orderEntry}
              product={subProduct}
              productConfig={this.props.productConfig}
              title={this.t('nTextUploadCalibrationyCertificate')}
            />
          );
        }
        break;
      case MAIN_ENGINE_IMMIBILIZATION:
        if(config && config.get('recordApplicationFiles') !== undefined) {
          child.push(
            <DragDropFiles
              {...this.props}
              ref={MAIN_ENGINE_IMMIBILIZATION + 'recordApplicationFiles'}
              key={MAIN_ENGINE_IMMIBILIZATION + 'recordApplicationFiles'}
              dropzoneStyle={this.style('dropzone')}
              field='recordApplicationFiles'
              loadedFiles={config.get('recordApplicationFiles').toJS()}
              order={this.props.order}
              orderEntry={this.props.orderEntry}
              product={subProduct}
              productConfig={this.props.productConfig}
              title={this.t('nTextUploadRecordApplication')}
            />
          );
        }
        break;
      default:
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
    return (
      <div
        key={subProduct.get('name')}
        style={this.style('subProducts')}
      >
        <Flexible
          key={'flex_' + subProduct.get('code')}
          ref={'flex_' + subProduct.get('code')}
          childStyle={this.style('flexible')}
          expandable={true}
          onCheck={this._handleChange}
          select={select}
          title={subProduct.get('name')}
          isUpdate={this.state['flex_' + subProduct.get('code')]}
          onClearUnreadStatus={this._handleClearUnreadStatus.bind(this,subProduct.get('code'))}
        >
          <div style={this.style('productChild')}>
            {this.renderSubProductChild(config, subProduct)}
          </div>
        </Flexible>
      </div>
    );
  },

  renderSubProducts() {
    let subProductsElems = [];
    let productConfig = this.props.productConfig;
    if (productConfig && productConfig.products) {
      productConfig.products.forEach(product => {
        let productDetail = product.get('product');
        let select = product.get('select');
        let config = product.get('config');
        subProductsElems.push(this.renderSubProduct(select, config, productDetail));
      });
    }

    return subProductsElems;
  },

  render() {
    let styles = this.getStyles();
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
        case FW_SUPPLY:
          if (this.refs.supplyQuantity){
            let quantity = this.refs.supplyQuantity.getValue();
            config.supplyQuantity = _.isNaN(quantity) ?0: quantity;
          }
          break;
        case FIRE_WORK_PERMIT:
          if (this.refs.permitFiles)
            config.permitFiles = this.refs.permitFiles.getFiles();
          if (this.refs[FIRE_WORK_PERMIT + 'recordApplicationFiles'])
            config.recordApplicationFiles = this.refs[FIRE_WORK_PERMIT + 'recordApplicationFiles'].getFiles();
          break;
        case FRESH_WATER_ANALYSIS:
          if (this.refs.laboratoryCertificateFiles)
            config.laboratoryCertificateFiles = this.refs.laboratoryCertificateFiles.getFiles();
          break;
        case MAGNETIC_COMPASS_ADJUST:
          if (this.refs.calibrationCertificateFiles)
            config.calibrationCertificateFiles = this.refs.calibrationCertificateFiles.getFiles();
          if (this.refs.magneticCompassModel)
            config.magneticCompassModel = this.refs.magneticCompassModel.getValue();
          break;
        case MAIN_ENGINE_IMMIBILIZATION:
          if (this.refs[MAIN_ENGINE_IMMIBILIZATION + 'recordApplicationFiles'])
            config.recordApplicationFiles = this.refs[MAIN_ENGINE_IMMIBILIZATION + 'recordApplicationFiles'].getFiles();
          break;
        default:
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
        costTypes.push({
          _id: costType.costType._id,
          code: costType.costType.code,
          variables: variables
        });
      });

      return {
        _id: product._id,
        code: product.code,
        costTypes: costTypes,
        name: product.name,
      };
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

  rendeErrorNotification() {
    if(this.state.open) {
      return this.t('nTextTypeError');
    }else if(this.state.error){
      return this.t('nTextPostCodeError');
    }
  },

  _componentChange() {
    global.notifyOrderDetailsChange(true);
    let value = this.refs.supplyQuantity.getValue();
    if(!_.isInteger(Number(value))) {
      this.setState({error:true});
      this.refs.supplyQuantity.clearValue();
    }

  },
});

module.exports = PTOMREQForm;
