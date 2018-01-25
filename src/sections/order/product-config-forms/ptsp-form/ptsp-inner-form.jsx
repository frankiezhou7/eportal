const React = require('react');
const AddButton = require('epui-md/svg-icons/content/add');
const CloseButton = require('epui-md/svg-icons/navigation/close');
const ArticleList = require('../components/article-list');
const AutoStyle = require('epui-auto-style').mixin;
const Dialog = require('epui-md/Dialog');
const DivButton = require('../components/div-button');
const DragDropFiles = require('../../drag-drop-files');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const FloatingActionButton = require('epui-md/FloatingActionButton');
const FlatButton = require('epui-md/FlatButton');
const MenuItem = require('epui-md/MenuItem');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField/TextField');
const Paper = require('epui-md/Paper');
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Translatable = require('epui-intl').mixin;
const SPARE_PART_CODE = 'PTSP';
const OPEN_FILES_SHIPMENTS_FILES = 'shipmentsFiles';
const OPEN_FILES_INVOICES_FILES = 'invoicesFiles';
const OPEN_FILES_GOODS_FILES = 'goodsFiles';

const PTSPInnerForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    mode: PropTypes.string,
    open: PropTypes.bool,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    orderId:PropTypes.number,
    config:PropTypes.object,
    subProducts: PropTypes.object,
    productConfig: PropTypes.object,
    shipments: PropTypes.array,
    type: PropTypes.string,
    deleteOrder:PropTypes.func,
    nLabelSimpleConfig : PropTypes.string,
    nLabelDetailConfig : PropTypes.string,
    nLabelUploadShipments : PropTypes.string,
    nLabelUploadInvoices : PropTypes.string,
    nLabelUploadGoods : PropTypes.string,
    nLabelShipments : PropTypes.string,
    nLabelInvoices : PropTypes.string,
    nLabelGoods : PropTypes.string,
    nLabelFileTitle : PropTypes.string,
    nLabelSparePartTitle: PropTypes.string,
    nLabelSparePartSubTitle: PropTypes.string,
    nTextAddSparePart: PropTypes.string,
    nLabelDeliveryCompany: PropTypes.string,
    nLabelShipmentNumber: PropTypes.string,
    nLabelCount: PropTypes.string,
    nLabelWeight: PropTypes.string,
    nLabelFrom: PropTypes.string,
    nLabelShipmentsInfos: PropTypes.string,
    nTextCancel: PropTypes.string,
    nTextAdd: PropTypes.string,
    nLabelEdit: PropTypes.string,
    nTextAddShipmentInfo: PropTypes.string,
    nTextEditShipmentInfo: PropTypes.string,
    nLabelCountUnit: PropTypes.string,
    nLabelTextProductWeightUnit: PropTypes.string,
    nLabelFeedBackFiles:PropTypes.string,
  },

  getDefaultProps() {
    return {
      orderEntry:null,
      subProducts:null,
      productConfig: null,
    };
  },

  getInitialState: function() {
    let { orderId, config, type } = this.props;

    return {
      editShipment : {},
      fileOpened: OPEN_FILES_SHIPMENTS_FILES,
      open: false,
      delete: false,
      simpleMode: false,
      shipments: config.orders[`orders${type}`] ? config.orders[`orders${type}`][orderId] ? config.orders[`orders${type}`][orderId].shipments : [] : {},
      show: true,
      shipmentsDisable: false,
    };
  },

  componentDidMount() {
    this.setState({
      shipmentsDisable: this.refs.shipmentsFiles ? this.refs.shipmentsFiles.getFilesCount() >= 1 : false,
    });
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },


  getStyles() {
    let padding =2;
    let theme = this.getTheme();
    let fileTitle = {
      display: 'inline-block',
      paddingLeft: padding*3,
      paddingRight: padding*3,
      cursor: 'pointer',
    };
    let shipmentsFilesTitle = _.merge({
      color: this.state.fileOpened === OPEN_FILES_SHIPMENTS_FILES ? theme.primary1Color : 'initial',
    },fileTitle);
    let invoicesFilesTitle = _.merge({
      color: this.state.fileOpened === OPEN_FILES_INVOICES_FILES ? theme.primary1Color : 'initial',
    },fileTitle);
    let goodsFilesTitle = _.merge({
      color: this.state.fileOpened === OPEN_FILES_GOODS_FILES ? theme.primary1Color : 'initial',
    },fileTitle);
    let styles = {
      root:{
        paddingBottom :padding*10,
        marginBottom: padding*10,
        border: '1px solid #dcdcdc',
        position: 'relative',
        display: this.state.show ? 'block': 'none',
      },
      dropzoneStyle:{
        height: 100,
      },
      header:{
        marginBottom: padding,
      },
      spanSubTitle:{
        fontWeight:300,
        fontSize: 12,
        display: 'block',
      },
      actions:{
        marginBottom: padding*5,
      },
      uploader:{
        margin: this.state.simpleMode ?'auto' : padding*5,
        padding: padding*7,
        textAlign: 'center',
        //border: this.state.simpleMode ? 'none' : '1px solid #E2E2E2',
      },
      fileHeader:{
        textAlign: 'left',
      },
      fileHeaderTitle:{
        display: 'inline-block',
        marginRight: padding*3,
        marginBottom: padding*5,
        fontSize: 16,
      },
      shipmentsFilesTitle:shipmentsFilesTitle,
      invoicesFilesTitle:invoicesFilesTitle,
      goodsFilesTitle:goodsFilesTitle,
      shipmentsFilesUpload:{
        display: (this.state.fileOpened === '' || this.state.fileOpened === OPEN_FILES_SHIPMENTS_FILES) ? 'block': 'none',
      },
      invoicesFilesUpload:{
        display: (this.state.fileOpened === '' || this.state.fileOpened === OPEN_FILES_INVOICES_FILES) ? 'block': 'none',
      },
      goodsFilesUpload:{
        display: (this.state.fileOpened === '' || this.state.fileOpened === OPEN_FILES_GOODS_FILES) ? 'block': 'none',
      },
      addBtn:{
        width: 60,
        textAlign: 'center',
        margin: 'auto',
      },
      closeBtn:{
        position: 'absolute',
        top: 15,
        right: 20,
        fill:'#dcdcdc',
        cursor: 'pointer',
        width:'',
        height:'',
      },
      addBtnLabel:{
        display: 'block',
        marginTop: padding*2,
      },
      shipmentListTitle:{
        fontSize: 15,
        fontWeight: 300,
        display: 'block',
        marginBottom: padding*3,
      },
      shipmentsInfos:{
        padding :padding*7,
      },
      shipmentChild:{
        width: '40%',
        display: 'inline-block',
        marginBottom: padding*5,
        marginRight : padding,
      },
      shipmentChildTitle:{
        fontSize: 14,
        fontWeight: 500,
        marginRight: padding*5,
      },
      shipmentChildDescription:{
        display: 'inline-block'
      },
      dialogShipment:{
        marginRight: padding*5,
        display: 'inline-block',
        width: '40%',
        verticalAlign: 'bottom',
      },
      dialogShipmentUnit:{
        marginRight: padding*5,
        display: 'inline-block',
        width: '40%',
        height: 55,
        verticalAlign: 'bottom',
      },
      dialogShipmentUnderLineUnit:{
        marginBottom : 1,
      },
      dialogDescription:{
        marginRight: padding*5,
        display: 'inline-block',
        width: '100%',
        verticalAlign: 'middle',
      },
      noteContainer: {
        width: 815,
        margin: '0px auto',
      },
      noteTitle: {

      },
    };
    return styles;
  },

  isNotReadyToSave(){
    return  this.refs.shipmentsFiles.isDirty()||
            this.refs.invoicesFiles.isDirty()||
            this.refs.goodsFiles.isDirty();
  },

  getDirtyFiles(){
    let dirtyFiles = [];
    if(this.refs.shipmentsFiles && this.refs.shipmentsFiles.isDirty()){
      dirtyFiles.push(this.t('nLabelShipments'));
    }
    if(this.refs.invoicesFiles && this.refs.invoicesFiles.isDirty()){
      dirtyFiles.push(this.t('nLabelInvoices'));
    }
    if(this.refs.goodsFiles && this.refs.goodsFiles.isDirty()){
      dirtyFiles.push(this.t('nLabelGoods'));
    }
    return dirtyFiles;
  },

  getValue(){
    return {
      orderId: this.props.orderId,
      shipmentsFiles:this.refs.shipmentsFiles.getFiles(),
      invoicesFiles:this.refs.invoicesFiles.getFiles(),
      goodsFiles:this.refs.goodsFiles.getFiles(),
      remark: this.refs.note.getValue(),
    };
  },

  getProductConfig(){
    const { orderId, type } = this.props;
    let productConfig = this._getProductConfig(orderId, type);
    let products = _.map(productConfig.products,product => {
      product.product = product.product._id;
      if(product.costTypes){
        delete product.costTypes;
      }
      return product;
    });
    productConfig.products = products;
    return productConfig;
  },

  getCalculateConfig() {
    const { orderId, type } = this.props;
    let productConfig = this._getProductConfig(orderId, type);
    let selectedSubProductConfigs=_.filter(productConfig.products,product => {
      return product.select==true;
    });
    return this._generateCalculateConfig(selectedSubProductConfigs);
  },

  renderHeader() {
    let menuItems = [
      <MenuItem key={0} value={0} primaryText={this.t('nLabelSimpleConfig')} />,
      <MenuItem key={1} value={1} primaryText={this.t('nLabelDetailConfig')} />,
    ];
    return(
      <div style ={this.style('header')}>
        <div style = {this.style('actions')}>
          <DropDownMenu
            ref='actions'
            key='actions'
            onChange={this._handleActionChange}
            style={this.style('menu')}
            value={this.state.simpleMode ? 0 : 1}
            defaultValue={0}
          >
            {menuItems}
          </DropDownMenu>
        </div>
      </div>
    );
  },

  renderFiles() {
    const  { orderId, config, type } = this.props;
    let theme = this.getTheme();
    let fileContainer =[];
    let fileHeader =null;
    let range = '';
    switch (type) {
      case 'FT':
        range = ' (< 50kg)';
        break;
      case 'OH':
        range = ' (51-100kg)';
        break;
      case 'TH':
        range = ' (101-200kg)';
        break;
      case 'FH':
        range = ' (201-500kg)';
        break;
      case 'OF':
        range = ' (> 500kg)';
        break;
      default:
    }
    if(!this.state.simpleMode){
      fileHeader =[];
      fileHeader.push(
        <div style = {this.style('fileHeader')}>
          <span style = {this.style('fileHeaderTitle')}>
            {this.t('nTextOrder')+`${orderId+1}`+ range}
          </span>
          <DivButton
            style ={this.style('shipmentsFilesTitle')}
            onClick = {this._handleFilesTitleClick.bind(this,OPEN_FILES_SHIPMENTS_FILES)}
            labelButton ={this.t('nLabelShipments')}
            hoverColor= {theme.primary1Color}
          />
          <DivButton
            style ={this.style('invoicesFilesTitle')}
            onClick = {this._handleFilesTitleClick.bind(this,OPEN_FILES_INVOICES_FILES)}
            labelButton ={this.t('nLabelInvoices')}
            hoverColor= {theme.primary1Color}
          />
          <DivButton
            style ={this.style('goodsFilesTitle')}
            onClick = {this._handleFilesTitleClick.bind(this,OPEN_FILES_GOODS_FILES)}
            labelButton ={this.t('nLabelGoods')}
            hoverColor= {theme.primary1Color}
          />
        </div>
      );
    }
    let files = [];
    files.push(
      <DragDropFiles
        key = 'shipmentsFiles'
        ref = 'shipmentsFiles'
        style = {this.style('shipmentsFilesUpload')}
        dropzoneStyle = {this.style('dropzone')}
        title = {this.t('nLabelUploadShipments')}
        loadedFiles={config.orders[`orders${type}`] && config.orders[`orders${type}`][orderId] && config.orders[`orders${type}`][orderId].shipmentsFiles}
        order ={this.props.order}
        orderEntry ={this.props.orderEntry}
        product = {this.props.orderEntry.product}
        productConfig = {this.props.productConfig}
        field ='shipmentsFiles'
        multiple = {false}
        disableClick={this.state.shipmentsDisable}
        onFilesChange={this._handleFilesChange.bind(this,'shipmentsDisable')}
        onRemoveFiles={this._handleFilesChange.bind(this,'shipmentsDisable')}
      />
    );

    files.push(<DragDropFiles
        key = 'invoicesFiles'
        ref = 'invoicesFiles'
        style = {this.style('invoicesFilesUpload')}
        dropzoneStyle = {this.style('dropzone')}
        title = {this.t('nLabelUploadInvoices')}
        loadedFiles={config.orders[`orders${type}`] && config.orders[`orders${type}`][orderId] && config.orders[`orders${type}`][orderId].invoicesFiles}
        order ={this.props.order}
        orderEntry ={this.props.orderEntry}
        product = {this.props.orderEntry.product}
        productConfig = {this.props.productConfig}
        field ='invoicesFiles'
        multiple = {true}
      />);

    files.push(<DragDropFiles
      key = 'goodsFiles'
      ref = 'goodsFiles'
      style = {this.style('goodsFilesUpload')}
      dropzoneStyle = {this.style('dropzone')}
      title = {this.t('nLabelUploadGoods')}
      loadedFiles={config.orders[`orders${type}`] && config.orders[`orders${type}`][orderId] && config.orders[`orders${type}`][orderId].goodsFiles}
      order ={this.props.order}
      orderEntry ={this.props.orderEntry}
      product = {this.props.orderEntry.product}
      productConfig = {this.props.productConfig}
      field ='goodsFiles'
      multiple = {true}
    />);

    fileContainer.push(fileHeader);
    fileContainer.push(files);
    return(
      <div style = {this.style('uploader')}>
        {fileContainer}
      </div>
    );
  },

  // renderAddBtn() {
  //   return(
  //     <div style = {this.style('addBtn')}>
  //       <FloatingActionButton
  //         mini={true}
  //         onTouchTap={this._handleAddTouch}
  //       >
  //         <AddButton />
  //       </FloatingActionButton>
  //       <span style = {this.style('addBtnLabel')}>{this.t('nTextAddSparePart')}</span>
  //     </div>
  //   );
  // },

  // renderDeleteBtn() {
  //   return(
  //     <CloseButton
  //       width={30}
  //       style={this.style('closeBtn')}
  //       onClick={this._handleDeleteDialogOpen}
  //     />
  //   );
  // },

  renderShipmentChild(shipment) {
    return (
      <div>
        <div style = {this.style('shipmentChild')}>
          <span style = {this.style('shipmentChildTitle')}>{this.t('nLabelDeliveryCompany')+': '}</span>
          <span>{shipment.deliveryCompany}</span>
        </div>
        <div style = {this.style('shipmentChild')}>
          <span style = {this.style('shipmentChildTitle')}>{this.t('nLabelShipmentNumber')+': '}</span>
          <span>{shipment.number}</span>
        </div>
        <div style = {this.style('shipmentChild')}>
          <span style = {this.style('shipmentChildTitle')}>{this.t('nLabelCount')+': '}</span>
          <span>{shipment.count}</span>
        </div>
        <div style = {this.style('shipmentChild')}>
          <span style = {this.style('shipmentChildTitle')}>{this.t('nLabelWeight')+': '}</span>
          <span>{shipment.weight}</span>
        </div>
        <div >
          <span style = {this.style('shipmentChildTitle')}>{this.t('nLabelFrom')+': '}</span>
          <div style = {this.style('shipmentChildDescription')}>{shipment.from}</div>
        </div>
      </div>
    );
  },

  renderShipmentListTitle() {
    return (
      <span style ={this.style('personListTitle')}>
        {this.t('nLabelShipmentsInfos')}
      </span>
    );
  },

  renderShipmentList() {
    return(
      <ArticleList
        ref = 'shipmentList'
        onEdit={this._handleEditShipment}
        onRemove={this._handleRemoveShipment}
        articles = {this.state.shipments}
        renderArticleChild = {this.renderShipmentChild}
      />
    );
  },

  renderShipmentsInfos() {
    if(this.state.simpleMode) return null;
    return (
      <div style={this.style('shipmentsInfos')}>
        {this.renderShipmentListTitle()}
        {this.renderShipmentList()}
        {this.renderAddBtn()}
      </div>
    );
  },

  // renderDeleteDialog(){
  //   let addActions = [
  //     <FlatButton
  //       key = 'cancel'
  //       label={this.t('nTextCancel')}
  //       secondary={true}
  //       onTouchTap={this._handleShipmentDialogCancel.bind(this,'delete')} />,
  //     <FlatButton
  //       key = 'submit'
  //       label={this.t('nTextRemove')}
  //       primary={true}
  //       onTouchTap={this._handleDeleteDialogSubmit} />
  //   ];
  //   return(
  //     <Dialog
  //       ref='shipmentDialog'
  //       actions={addActions}
  //       open={this.state.delete}
  //       title={this.t('nTextTypeErrorTitle')}
  //     >
  //       {this.t('nTextDeleteConfirm')}
  //     </Dialog>
  //   );
  // },

  renderAddDialog(shipment) {
    let isAdd = true;
    let shipments = this.state.shipments;
    _.forEach(shipments, sp=>{
      if(sp.id === shipment.id){
        isAdd =false;
      }
    });
    let deliveryCompany = shipment ? shipment.deliveryCompany : '';
    let number = shipment ? shipment.number : '';
    let count = shipment ? shipment.count : '';
    let weight = shipment ? shipment.weight : '';
    let from = shipment ? shipment.from : '';
    let addActions = [
      <FlatButton
        key = 'cancel'
        label={this.t('nTextCancel')}
        secondary={true}
        onTouchTap={this._handleShipmentDialogCancel.bind(this,'open')} />,
      <FlatButton
        key = 'submit'
        label={isAdd ? this.t('nTextAdd'): this.t('nLabelEdit')}
        primary={true}
        onTouchTap={this._handleShipmentDialogSubmit} />
    ];
    return(
      <Dialog
        ref='shipmentDialog'
        actions={addActions}
        open={this.state.open}
        title={isAdd ? this.t('nTextAddShipmentInfo') : this.t('nTextEditShipmentInfo')}
      >
        <TextField
          ref = 'deliveryCompany'
          key= 'deliveryCompany'
          style= {this.style('dialogShipment')}
          defaultValue={deliveryCompany}
          floatingLabelText={this.t('nLabelDeliveryCompany')}
        />
        <TextField
          ref = 'shipmentNumber'
          key= 'shipmentNumber'
          style= {this.style('dialogShipment')}
          defaultValue ={number}
          floatingLabelText={this.t('nLabelShipmentNumber')}
        />
        <TextFieldUnit
          ref = 'shipmentCount'
          key= 'shipmentCount'
          style= {this.style('dialogShipmentUnit')}
          underlineStyle = {this.style('dialogShipmentUnderLineUnit')}
          defaultValue={count}
          floatingLabelText={this.t('nLabelCount')}
          unitLabelText={this.t('nLabelCountUnit')}
        />
        <TextFieldUnit
          ref = 'shipmentWeight'
          key= 'shipmentWeight'
          style= {this.style('dialogShipmentUnit')}
          underlineStyle = {this.style('dialogShipmentUnderLineUnit')}
          defaultValue ={weight}
          floatingLabelText={this.t('nLabelWeight')}
          unitLabelText={this.t('nLabelTextProductWeightUnit')}
        />
        <TextField
          ref = 'shipmentFrom'
          key= 'shipmentFrom'
          style= {this.style('dialogDescription')}
          defaultValue = {from}
          floatingLabelText={this.t('nLabelFrom')}
        />
      </Dialog>
    );
  },

  renderNote(){
    let { orderId, config, type } = this.props;
    return(
      <div style={this.style('noteContainer')}>
        <TextField
          ref = 'note'
          key = 'note'
          floatingLabelText={this.t('nLabelNote')}
          defaultValue = {config.orders[`orders${type}`] && config.orders[`orders${type}`][orderId] && config.orders[`orders${type}`][orderId].remark}
          fullWidth = {true}
          onChange = {this._handleChange}
        />
      </div>
    );
  },

  render() {
    return (
      <Paper zDepth={1} style = {this.style('root')}>
        {this.renderFiles()}
        {this.renderNote()}
        {this.renderAddDialog(this.state.editShipment)}
      </Paper>
    );
  },

  _getProductConfig(orderId, type){
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products,product=>{
      let config = product.config;
      let priceConfig = product.priceConfig;
      let productCode = product.product.code;
      if(SPARE_PART_CODE===productCode){
        if(this.props.orderId) config.orders[`orders${type}`][orderId].orderId = this.props.orderId;
        if(config.orders[`orders${type}`][orderId].shipmentsFiles && this.refs.shipmentsFiles){
          config.orders[`orders${type}`][orderId].shipmentsFiles = this.refs.shipmentsFiles.getFiles();
        }
        if(config.orders[`orders${type}`][orderId].invoicesFiles && this.refs.invoicesFiles){
          config.orders[`orders${type}`][orderId].invoicesFiles = this.refs.invoicesFiles.getFiles();
        }
        if(config.orders[`orders${type}`][orderId].goodsFiles && this.refs.goodsFiles){
          config.orders[`orders${type}`][orderId].goodsFiles = this.refs.goodsFiles.getFiles();
        }
        if(config.orders[`orders${type}`][orderId].shipments){
          config.orders[`orders${type}`][orderId].shipments = this.state.shipments;
          if(priceConfig && priceConfig['CTCMCECG|WEIGHT|value']!==undefined){
            let weights = _.map(product.config.orders[`orders${type}`][orderId].shipments,(shipment)=>{
              return parseFloat(shipment.weight) ? parseFloat(shipment.weight) : 0;
            });
            priceConfig['CTCMCECG|WEIGHT|value'] = weights;
          }
        }
        if(this.refs.note){
          config.orders[`orders${type}`][orderId].remark = this.refs.note.getValue();
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

  _handleActionChange(event, selectedIndex, value){
    let simpleMode = value === 0;
    if(this.state.simpleMode !== simpleMode){
      this.setState({
        simpleMode: simpleMode,
        fileOpened: simpleMode ? '' : OPEN_FILES_SHIPMENTS_FILES,
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

  _handleFilesTitleClick(fileOpened){
    if(this.state.fileOpened !== fileOpened) this.setState({fileOpened: fileOpened});
  },

  _handleAddTouch(){
    let newShipment = {
      id: Math.random() * 10001,
    };
    this.setState({
      editShipment: newShipment,
      open: true,
    });
  },

  // _handleDeleteDialogOpen() {
  //   this.setState({delete:true});
  // },

  _handleShipmentDialogCancel(name) {
    this.setState({
      [name]: false,
    });
  },

  _handleFilesChange(name){
    this.setState({
      [name]: !this.state[name],
    });
  },

  _getShipmentFromDialog(){
    let editShipment = this.state.editShipment;
    if(this.refs.deliveryCompany){
      editShipment.deliveryCompany = this.refs.deliveryCompany.getValue();
    }
    if(this.refs.shipmentNumber){
      editShipment.number = this.refs.shipmentNumber.getValue();
    }
    if(this.refs.shipmentCount){
      editShipment.count = this.refs.shipmentCount.getValue();
    }
    if(this.refs.shipmentWeight){
      editShipment.weight = this.refs.shipmentWeight.getValue();
    }
    if(this.refs.shipmentFrom){
      editShipment.from = this.refs.shipmentFrom.getValue();
    }
    return editShipment;
  },

  _handleShipmentDialogSubmit(){
    global.notifyOrderDetailsChange(true);
    let editShipment =this._getShipmentFromDialog();
    let shipments = this.state.shipments;
    let isAdd = true;
    shipments=_.map(shipments,shipment=>{
      if(shipment.id === editShipment.id){
        isAdd=false;
        shipment=editShipment;
      }
      return shipment;
    });
    if(isAdd){
      shipments.push(editShipment);
    }
    this.setState({
      editShipment: {},
      shipments: shipments,
      open: false,
    });
  },

  // _handleDeleteDialogSubmit(){
  //   global.notifyOrderDetailsChange(true);
  //   let { orderId, deleteOrder } = this.props;
  //   deleteOrder(orderId);
  //   this.setState({
  //     delete: false,
  //     show: false,
  //   });
  // },

  _handleEditShipment(id) {
    let editShipment = null;
    let shipments = this.state.shipments;
    _.forEach(shipments, shipment => {
      if(shipment.id === id) {
        editShipment = shipment;
      }
    });

    this.setState({
      editShipment: editShipment,
      open: true,
    });
  },

  _handleRemoveShipment(id) {
    let shipments = this.state.shipments;
    shipments = _.reject(shipments, ['id', id]);

    this.setState({
      shipments: shipments,
    });
  },

  _handleChange() {
    global.notifyOrderDetailsChange(true);
  },
});

module.exports = PTSPInnerForm;
