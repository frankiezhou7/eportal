const React = require('react');
const AddButton = require('epui-md/svg-icons/content/add');
const CloseButton = require('epui-md/svg-icons/navigation/close');
const ArticleList = require('../components/article-list');
const AutoStyle = require('epui-auto-style').mixin;
const Dialog = require('epui-md/Dialog');
const DialogChild = require('./dialog-child');
const FlatButton = require('epui-md/FlatButton');
const Paper = require('epui-md/Paper');
const FloatingActionButton = require('epui-md/FloatingActionButton');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;

const PTOLFVSLInnerForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    mode : PropTypes.string,
    style: PropTypes.object,
    open: PropTypes.bool,
    order : PropTypes.object,
    orderId:PropTypes.number,
    orderEntry : PropTypes.object,
    config: PropTypes.object,
    productConfig : PropTypes.object,
    deleteOrder:PropTypes.func,
    shipments: PropTypes.array,
    offLandingArticleTypes : PropTypes.object,
    nTextCancel: PropTypes.string,
    nTextAdd: PropTypes.string,
    nLabelEdit: PropTypes.string,
    nTextAddArticleInfo: PropTypes.string,
    nTextEditArticleInfo: PropTypes.string,
    nLabelSelectArticle : PropTypes.string,
    nLabelSelectArticleDescripton : PropTypes.string,
    nTextAddArticle : PropTypes.string,
    nLabelArticleType: PropTypes.string,
    nLabelShipmentCount:PropTypes.string,
    nLabelShipmentWeight:PropTypes.string,
    nLabelShipmentDescription:PropTypes.string,
    nLabelShipmentAddress:PropTypes.string,
  },

  getDefaultProps() {
    return {
      open: false,
      offLandingArticleTypes: null,
    };
  },

  getInitialState() {
    let { orderId, config } = this.props;
    return{
      open: this.props.open,
      delete: false,
      editShipment : {},
      shipments: config.orders[orderId] ? config.orders[orderId].shipments : [],
      show: true,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 2;
    let theme = this.getTheme();
    let rootStyle = {
      padding: padding * 7,
      marginBottom: padding * 8,
      border: '1px solid #dcdcdc',
      position: 'relative',
      display: this.state.show ? 'block': 'none',
    };
    if(this.props.style) {
      _.merge(rootStyle, this.props.style);
    }
    let styles = {
      root: rootStyle,
      addBtn:{
        minWidth: 180,
        textAlign: 'center',
        margin: 'auto',
      },
      closeBtn:{
        position: 'absolute',
        top: 10,
        right: 10,
        fill:'#dcdcdc',
        cursor: 'pointer',
        width:'',
        height:'',
      },
      addBtnLabel:{
        marginLeft: padding*5,
        fontSize: 16,
        color: '#f5a623',
        verticalAlign: 'middle',
      },
      articleId:{
        display:'none',
      },
      articleChild:{
        width: '28%',
        display: 'inline-block',
        marginBottom: padding * 5,
        marginRight : padding,
      },
      articleChildDescriptionElem:{
        display: 'block',
        marginBottom: padding * 5,
        marginRight : padding,
      },
      articleChildTitle:{
        fontSize: 14,
        fontWeight: 500,
        marginRight: padding * 5,
        display: 'inline-block',
        verticalAlign: 'top',
      },
      articleChildDescription: {
        marginBottom: padding * 5,
      },
      articleChildContent: {
        maxWidth: 620,
        verticalAlign: 'middle',
        wordBreak: 'break-word',
        display: 'inline-block',
        textAlign: 'justify',
      },
      title:{
        fontSize: 18,
        fontWeight: 300,
        display: 'block',
        marginBottom: 15,
      },
      titleDescription:{
        fontSize: 15,
        fontWeight: 300,
        display: 'block',
        marginBottom:20,
      },
      noteContainer: {
        width: 818,
        margin: '0px auto',
      },
      noteTitle: {

      },
      button: {
        width: 18,
        height: 18,
        verticalAlign: 4,
        fill: '#fff',
      },
      circle: {
        width: 18,
        height: 18,
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '50%',
        backgroundColor: '#f5a623',
      }
    };
    return styles;
  },

  isDirty(){

  },

  getDirtyFiles(){

  },

  getValue(){
    let { config, orderId } = this.props;
    return {
      orders:[
        {
          shipments: this.state.shipments,
          note: config.orders[orderId] && config.orders[orderId].note,
          remark: this.refs.note.getValue(),
          feedbackFiles: config.orders[orderId] && config.orders[orderId].feedbackFiles,
        }
      ]
    };
  },

  renderDescription(){
    return(
      <div style={this.style('description')}>
        <span style={this.style('title')}>{this.t('nLabelSelectArticle') + (this.props.orderId + 1)}</span>
        <span style={this.style('titleDescription')}>{this.t('nLabelSelectArticleDescripton')}</span>
      </div>
    );
  },

  renderAddBtn(){
    return(
      <div style = {this.style('addBtn')}>
        <FlatButton
          onTouchTap={this._handleAddTouch}
          backgroundColor={'rgba(0,0,0,0)'}
          >
          <span style={this.style('circle')}>
            <AddButton style={this.style('button')}/>
          </span>
          <span style = {this.style('addBtnLabel')}>{this.t('nTextAddArticle')}</span>
        </FlatButton>
      </div>
    );
  },

  renderDeleteBtn() {
    if(this.props.orderId > 0){
      return(
        <CloseButton
          width={30}
          style={this.style('closeBtn')}
          onClick={this._handleDeleteDialogOpen}
        />
      );
    }
  },

  renderArticleChild(shipment){
    let articleTypes = this.props.offLandingArticleTypes.toJS();
    let articleTypeElem = shipment.articleType > -1 ? (
      <div style = {this.style('articleChild')}>
        <span style = {this.style('articleChildTitle')}>{this.t('nLabelArticleType')+': '}</span>
        <span style = {this.style('articleChildContent')}>{shipment.articleName ? shipment.articleName : articleTypes[shipment.articleType].name}</span>
      </div>
    ):null;
    let countElem = shipment.count ? (
      <div style = {this.style('articleChild')}>
        <span style = {this.style('articleChildTitle')}>{this.t('nLabelShipmentCount')+': '}</span>
        <span style = {this.style('articleChildContent')}>{shipment.count}</span>
      </div>
    ):null;
    let weightElem = shipment.weight ? (
      <div style = {this.style('articleChild')}>
        <span style = {this.style('articleChildTitle')}>{this.t('nLabelShipmentWeight')+': '}</span>
        <span style = {this.style('articleChildContent')}>{shipment.weight}</span>
      </div>
    ):null;
    let descriptionElem = shipment.description ? (
      <div style = {this.style('articleChildDescriptionElem')}>
        <span style = {this.style('articleChildTitle')}>{this.t('nLabelShipmentDescription')+': '}</span>
        <span style = {this.style('articleChildContent')}>{shipment.description}</span>
      </div>
    ):null;
    let addressElem = shipment.address ? (
      <div style = {this.style('articleChildDescriptionElem')}>
        <div style = {this.style('articleChildTitle')}>{this.t('nLabelShipmentAddress')+': '}</div>
        <span style = {this.style('articleChildContent')}>{shipment.address}</span>
      </div>
    ):null;

    return (
      <div key={shipment.id}>
        <div>
          {articleTypeElem}
          {countElem}
          {weightElem}
        </div>
        <div style={{minHeight:'2px'}}></div>
        {descriptionElem}
        {addressElem}
      </div>
    );
  },

  renderArticleList() {
    return(
      <ArticleList
        ref='articleList'
        onEdit={this._handleEditShipment}
        onRemove={this._handleRemoveShipment}
        articles={this.state.shipments}
        renderArticleChild={this.renderArticleChild}
      />
    );
  },

  renderAddDialog(shipment) {
    let isAdd = this._checkIsNewShipment(shipment);
    let articleTypes = this.props.offLandingArticleTypes.toJS();

    let addActions = [
      <FlatButton
        key = 'cancel'
        label={this.t('nTextCancel')}
        secondary={true}
        onTouchTap={this._handleShipmentDialogCancel.bind(this,'open')} />,
      <FlatButton
        key = 'submit'
        label={isAdd ? this.t('nTextSave'): this.t('nLabelEdit')}
        primary={true}
        onTouchTap={this._handleShipmentDialogSubmit} />
    ];

    return(
      <Dialog
        ref='shipmentDialog'
        title={isAdd ? this.t('nTextAddArticleInfo') : this.t('nTextEditArticleInfo')}
        actions={addActions}
        open={this.state.open}
      >
        <DialogChild
          ref='dialogChild'
          articleTypes={articleTypes}
          shipment={shipment}
          style={this.style('dialogChild')}
        />
      </Dialog>
    );
  },

  renderDeleteDialog(){
    let addActions = [
      <FlatButton
        key = 'cancel'
        label={this.t('nTextCancel')}
        secondary={true}
        onTouchTap={this._handleShipmentDialogCancel.bind(this,'delete')} />,
      <FlatButton
        key = 'submit'
        label={this.t('nTextRemove')}
        primary={true}
        onTouchTap={this._handleDeleteDialogSubmit} />
    ];
    return(
      <Dialog
        ref='shipmentDialog'
        actions={addActions}
        open={this.state.delete}
        title={this.t('nTextAlertTitle')}
      >
        {this.t('nTextDeleteConfirm')}
      </Dialog>
    );
  },

  renderNote(){
    let { orderId, config } = this.props;
    return(
      <div style={this.style('noteContainer')}>
        <TextField
          ref = 'note'
          key = 'note'
          floatingLabelText={this.t('nLabelNote')}
          defaultValue = {config.orders[orderId] && config.orders[orderId].remark}
          fullWidth = {true}
          onChange = {this._handleChange}
        />
      </div>
    );
  },

  render() {
    if(!this.props.offLandingArticleTypes) return null;
    return (
      <Paper zDepth={1} style={this.style('root')}>
        {this.renderDescription()}
        {this.renderArticleList()}
        {this.renderAddBtn()}
        {this.renderNote()}
        {this.renderDeleteDialog()}
        {this.renderAddDialog(this.state.editShipment)}
        {this.renderDeleteBtn()}
      </Paper>
    );
   },

   _getArticleNameByCode(code){
     let name='';
     if(this.props.offLandingArticleTypes && this.props.offLandingArticleTypes.size > 0){
       this.props.offLandingArticleTypes.forEach(articleType=>{
         if(code === articleType.get('code')){
           name= articleType.get('name');
         }
       });
     }
     return name;
   },

   _handleAddTouch(){
     let newShipment = { id: Math.random() * 10001 };
     this.setState({
       editShipment: newShipment,
       open: true,
     });
   },

   _handleDeleteDialogOpen() {
     this.setState({delete:true});
   },

   _handleShipmentDialogCancel(name) {
     this.setState({
       [name]: false,
     });
   },

   _handleShipmentDialogSubmit() {
     global.notifyOrderDetailsChange(true);
     let shipmentTemp = this.refs.dialogChild.getValue();
     let shipments = this.state.shipments;
     let isAdd = true;
     shipments=_.map(shipments,shipment => {
       if(shipment.id === shipmentTemp.id) {
         isAdd = false;
         shipment = shipmentTemp;
       }
       return shipment;
     });
     if(isAdd) {
       shipments.push(shipmentTemp);
     }
     this.setState({
       shipments: shipments,
       editShipment: {},
       open: false,
     });
   },

   _handleDeleteDialogSubmit(){
     global.notifyOrderDetailsChange(true);
     let { orderId, deleteOrder } = this.props;
     deleteOrder(orderId);
     this.setState({
       delete: false,
       show: false,
     });
   },

   _checkIsNewShipment(shipmentTemp) {
     let shipments = this.state.shipments;
     let isAdd = true;
     let filtedElem = _.filter(shipments, ['id', shipmentTemp.id]);
     if(filtedElem.length>0) isAdd = false;
     return isAdd;
   },

   _handleEditShipment(id){
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

module.exports = PTOLFVSLInnerForm;
