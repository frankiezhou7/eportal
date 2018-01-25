const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('eplodash');
const AssAccountDialog = require('./assign-account-dialog');
const AutoStyle = require('epui-auto-style').mixin;
const DialogConfirm = require('./dialog-confirm');
const IconClear = require('epui-md/svg-icons/content/clear');
const IconSend = require('epui-md/svg-icons/content/send');
const CustomerService = require('epui-md/svg-icons/ep/message');
const Message = require('epui-md/svg-icons/notification/message');
const TextField = require('epui-md/TextField');
const OrderEntryList = require('./order-entry-list');
const OrderHeader = require('./order-header');
const OrderMixin = require('./mixins/order');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const RaisedButton = require('epui-md/RaisedButton');
const SettingsDialog = require('./settings-dialog/');
const Translatable = require('epui-intl').mixin;
const Messenger = require('epui-md/ep/Messenger');
const meta = require('~/src/store/models/mixins/metaHelper');
const moment = require('moment');
const { searchSettings } = global.api.epds;

const ORDER_STATUS = require('~/src/shared/constants').ORDER_STATUS;
const ORDER_ENTRY_STATUS = require('~/src/shared/constants').ORDER_ENTRY_STATUS;

const BODY_PADDING_TOP = 12;
const BODY_PADDING_LEFT = 24;
const ORDER_MODE = require('~/src/shared/constants').ORDER_MODE;
const ACCOUNT_TYPE = require('~/src/shared/constants').ACCOUNT_TYPE;

const JOBS = {
  CHOOSING_CONSIGNEE: 'CHOOSING_CONSIGNEE',
  CHOOSING_CONSIGNER: 'CHOOSING_CONSIGNER',
  SENDING_EMAIL: 'SENDING_EMAIL',
};

const Order = React.createClass({
  mixins: [AutoStyle, Translatable, PureRenderMixin],

  translations: [
    require(`epui-intl/dist/Order/${__LOCALE__}`),
    require(`epui-intl/dist/OrderType/${__LOCALE__}`),
    require(`epui-intl/dist/Global/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
    setOnTop: PropTypes.func,
  },

  childContextTypes: {
    storeFile: PropTypes.func,
    chatApi: PropTypes.object,
    orderId: PropTypes.string,
    onClose: PropTypes.func,
  },

  propTypes: {
    addOrderEntryToOrder: PropTypes.func,
    allProducts: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object,
    changed: PropTypes.bool,
    costTypes: PropTypes.any,
    findMainProducts: PropTypes.func,
    findSubProductsById: PropTypes.func,
    fold: PropTypes.bool,
    fullHeight: PropTypes.number,
    mode: PropTypes.oneOf(_.values(ORDER_MODE)),
    nButtonOkToSendEmail: PropTypes.string,
    nButtonOrderGoToSettings: PropTypes.string,
    nButtonPreviewEmail: PropTypes.string,
    nButtonSendEmail: PropTypes.string,
    nLabelAssignConsignee: PropTypes.string,
    nLabelAssignConsigner: PropTypes.string,
    nLabelCCEmailAddress: PropTypes.string,
    nLabelConfirmOrderActionCancel: PropTypes.string,
    nLabelCancelOrderReason: PropTypes.string,
    nLabelMaxLength: PropTypes.string,
    nLabelConsignee: PropTypes.string,
    nLabelConsigner: PropTypes.string,
    nLabelCostEst: PropTypes.string,
    nLabelOrderActCost: PropTypes.string,
    nLabelOrderActionAcceptAll: PropTypes.string,
    nLabelOrderActionCancel: PropTypes.string,
    nLabelOrderActionCheckEstPriceAll: PropTypes.string,
    nLabelOrderActionCheckNewOrderEntry: PropTypes.string,
    nLabelOrderActionCompletedAll: PropTypes.string,
    nLabelOrderActionExecutedAll: PropTypes.string,
    nLabelOrderActionExecutingAll: PropTypes.string,
    nLabelOrderActionOpen: PropTypes.string,
    nLabelOrderActionQuotedAll: PropTypes.string,
    nLabelOrderActionQuotingAll: PropTypes.string,
    nLabelOrderActionRefresh: PropTypes.string,
    nLabelOrderActionRejectAll: PropTypes.string,
    nLabelOrderActionRemove: PropTypes.string,
    nLabelOrderActionSendBill: PropTypes.string,
    nLabelOrderActionSendDailyReport: PropTypes.string,
    nLabelOrderActionSendFinalPDA: PropTypes.string,
    nLabelOrderActionSendFirstResponse: PropTypes.string,
    nLabelOrderActionSendQuotation: PropTypes.string,
    nLabelOrderActionSendSailingReport: PropTypes.string,
    nLabelOrderActionViewNewOrderEntryPrice: PropTypes.string,
    nLabelOrderEstCost: PropTypes.string,
    nLabelOrderSettings: PropTypes.string,
    nLabelRecvEmailAddress: PropTypes.string,
    nTextEmailIsSending: PropTypes.string,
    nTextOnQuoting: PropTypes.string,
    nTextOrderEmailSettingsIsNotSet: PropTypes.string,
    nTextOrderIsCanceled: PropTypes.string,
    nTextOrderIsCompleted: PropTypes.string,
    nTitleAgentOrder: PropTypes.string,
    nTitleConfirmSendEmail: PropTypes.string,
    nTitlePreviewSendEmail: PropTypes.string,
    nTitleSomethingWrong: PropTypes.string,
    nButtonSave: PropTypes.string,
    onFold: PropTypes.func,
    order: PropTypes.object,
    segment: PropTypes.object,
    ship: PropTypes.object,
    style: PropTypes.object,
    onFeedbackDialogOpen: PropTypes.func,
    id: PropTypes.string,
    activeOrderId: PropTypes.string,
    user: PropTypes.object,
    chats: PropTypes.object,
    onTop: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      jobs: [],
      isUpdate: false,
      feedbacks: [],
      productIds: [],
      messengerOpen: false,
    };
  },

  getChildContext() {
    return {
      storeFile: global.api.epds.storeShipFile,
      chatApi: global.api.chatting,
      orderId: this.props.id,
      onClose: this._handleMessengerClose,
    };
  },

  componentWillMount() {
    let status = _.get(this.props.order.toJS(), 'status');
    if(status === 999 || status === 1000 || status === 0) return;
    let entries = this._getVisibleOrderEntries();
    let ids = this._getMatrixIds(entries);
    this.getProductsUpdateStatus(ids);
    this.setState({productIds:ids});
    global.updateProductUnreadStatus = this.getProductsUpdateStatus;
  },

  componentWillUpdate(nextProps,nextState) {
    let status = _.get(this.props.order.toJS(), 'status');
    if(status === 999 || status === 1000 || status === 0) return;
    let entries = this._getVisibleOrderEntries();
    let ids = this._getMatrixIds(entries);
    if(parseInt(this.props.fullHeight) - parseInt(nextProps.fullHeight) === 50){
      this.getProductsUpdateStatus(ids);
      this.setState({productIds:ids});
    }
  },

  componentDidMount() {
    let { order, mode, params } = this.props;
    if(params.orderEntryId  && params.orderEntryId === 'VIEW_MESSAGE' &&  order && order._id === params.orderId){
      //this.props.onFeedbackDialogOpen();
      //this.clearUnreadStatus()
    }
    // if(!order.consignee) {
    //   if (_.isFunction(searchSettings)) {
    //     searchSettings
    //       .promise({
    //         query: 'defaultConsignee',
    //         size: 1,
    //       })
    //       .then(res => {
    //         let val = _.head(res.response.entries).value;
    //         if(val){
    //           let id = val.value;
    //           order.setConsignee(id);
    //         }
    //       })
    //       .catch(err => {
    //         alert(this.t('nTextSetDefaultConsigneeFailed'));
    //       });
    //   }
    // }
    debug(`订单(${order._id}): 已加载，模式=${mode}，类型=${order.type.code}`);
  },

  componentDidUpdate(prevProps, prevState) {
    let { order } = this.props;
    debug(`订单(${order._id}): 已更新`);
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.fold !== nextProps.fold && nextProps.id === nextProps.activeOrderId) {
      // this.fold();
    }
    let order = nextProps.order;
    if(this._hasJob(JOBS.SENDING_EMAIL)) {
      if(!nextProps.order.email.getMeta('loading')) {
        this.refs.confirm.dismiss();
        this._doneJob(JOBS.SENDING_EMAIL);
        global.dismissInfo();
      }
    }
  },

  componentWillUnmount() {
    debug(`订单(${this.props.order._id}): 已卸载`);
  },

  fold(flag) {
    if(this.refs.entries) {
      this.refs.entries.fold(flag);
    }
  },

  getStyles() {
    let { style, order, mode } = this.props;
    let palette = this.context.muiTheme.palette;

    let styles = {
      root: {
        marginBottom: BODY_PADDING_TOP,
      },
      header: {},
      body: {},
      brief: {
        minHeight: 80,
        paddingBottom: 16,
        position: 'relative',
      },
      org: {
        wrapper: {
          marginLeft: 20
        },
        label: {
          fontSize: 12,
          padding: '4px 0',
          display: 'inline-block',
        },
        name: {},
        service: {
          width: 32,
          height: 32,
          fill: '#F5A623',
          marginLeft: 10,
          verticalAlign: 'middle',
          cursor: 'pointer',
        },
      },
      sum: {
        position: 'absolute',
        top: 4,
        right: 24,
        textAlign: 'right',
      },
      costSum: {
        label: {
          fontSize: 12,
        },
        amount: {
          display: 'block',
          fontSize: 16,
          fontWeight: 'bold',
          color: palette.accent1Color,
          textAlign: 'right',
        },
        bill: {
          fontSize: 13,
          color: order.withinClosed() ? '#d0d0d0' : '#004588',
          marginLeft: 5,
          cursor: 'pointer',
          textDecoration: 'underline',
          display: 'inline-block',
        }
      },
      estSum: {
        label: {
          fontSize: 12,
        },
        amount: {
          display: 'block',
          fontSize: 16,
          fontWeight: 'bold',
          color: palette.accent1Color,
          textAlign: 'right',
        },
        bill: {
          fontSize: 13,
          color: this.getBillLinkColor(),
          marginLeft: 5,
          cursor: 'pointer',
          textDecoration: 'underline',
          display: 'inline-block',
        }
      },
      entries: {},
      footer: {
        wrapper:{
          minHeight: '48px',
          position: 'relative',
        },
        button: {
          position: 'absolute',
          right: '20px',
        },
      },
      bodyInfo: {
        root: {
          textAlign: 'center',
          padding: '5px 0',
        },
        info: {
          color: palette.primary1Color,
          backgroundColor: palette.primary3Color,
        },
        warning: {
          color: palette.textColor,
          backgroundColor: palette.warningColor,
        }
      },
      textarea: {
        tapHighlightColor: 'rgba(0,0,0,0)',
        padding: 0,
        position: 'relative',
        width: '100%',
        height: '100%',
        fontSize: '14px',
        boxSizing: 'border-box',
      },
      cancel: {
        color: '#d0d0d0',
      },
      btnText: {
        color: '#fff',
      },
      message:{
        width: 17,
        height: 17,
        fill: '#e44d3c',
        position: 'absolute',
        right: 20,
        bottom: 20,
        cursor: 'pointer',
      }
    };

    return styles;
  },

  openNotificationSettings() {
    let dialog = this.refs.settings;
    if(!dialog) { return; }
    dialog.show();
  },

  openOrderConfiguration(){
    let order = this.props.order.toJS();
    let props = {
      title: this.t('nLabelOrderConfiguration'),
      open: true,
      modal: false,
    };
    let cargoQuantityEle = {
      name : 'CargoQuantityDialog',
      props:{order: order}
    };
    let globalDialog = global.register.dialog;
    if (globalDialog) { globalDialog.generate(props, cargoQuantityEle); }

  },

  renderCost() {
    let { order, mode } = this.props;
    if(order.isCancelled()) { return null; }
    let { cost, est } = order.getCost();

    let elActCost = (
      <div>
        <span style={this.style('costSum.label')}>{this.t('nLabelOrderActCost')}</span>
        <span style={this.style('costSum.amount')}>
          {order.renderPrice(cost)}
          <span style={this.style('costSum.bill')} onClick={ !order.withinClosed() ? this._viewActCost : null}>
            {this.t('nTextBillName')}
          </span>
        </span>
      </div>
    );

    let elEstCost = (
      <div>
        <span style={this.style('estSum.label')}>{this.t('nLabelOrderEstCost')}</span>
        <span style={this.style('estSum.amount')}>
          {this._showEstPrice() ?
          order.renderPrice(est) :
          this.t('nTextOnQuoting')}
          <span style={this.style('estSum.bill')} onClick={this.getBillDisplay()}>
            {this.t('nTextBillName')}
          </span>
        </span>
      </div>
    );

    return (
      <div style={this.style('sum')}>
        {elActCost}
        {elEstCost}
      </div>
    );
  },

  renderOrg() {
    let { order, mode, user } = this.props;
    let isCreateOrder = _.get(user.getOrderPermission(),'createOrder', true);
    let consigner = order.consigner && order.consigner.name || (
      <RaisedButton
        disabled={this.props.order.isCancelled() || meta(order).isDoing('setConsigner')}
        label={this.t('nLabelAssignConsigner')}
        onTouchTap={this._handleAssignConsigner}
        primary={false}
        secondary={false}
        backgroundColor={this.props.order.isCancelled() ? '#d0d0d0' : '#f5a623'}
        labelStyle={this.style('btnText')}
      />
    );

    let consignee = !isCreateOrder ? _.get(order, ['consignee','name'], null) : order.consignee && order.consignee.name || (
      <RaisedButton
        disabled={this.props.order.isCancelled() || meta(order).isDoing('setConsignee')}
        label={this.t('nLabelAssignConsignee')}
        onTouchTap={this._handleAssignConsignee}
        primary={false}
        secondary={false}
        backgroundColor={this.props.order.isCancelled() ? '#d0d0d0' : '#f5a623'}
        labelStyle={this.style('btnText')}
      />
    );
    let elConsignee = (
      <div style={this.style('org.wrapper')}>
        <div style={this.style('org.label')}>{this.t('nLabelConsignee')}
        </div>
        <div style={this.style('org.name')}>{consignee}</div>
      </div>
    );

    let elConsigner = (
      <div style={this.style('org.wrapper')}>
        <div style={this.style('org.label')}>{this.t('nLabelConsigner')}
        </div>
        <div style={this.style('org.name')}>{consigner}</div>
      </div>
    );

    return mode === ORDER_MODE.CONSIGNER ? elConsignee :
      mode === ORDER_MODE.CONSIGNEE ? elConsigner : null;
  },

  renderInfo() {
    let info = this._getInfoText();
    let warn = this._getWarningText();

    let type = warn ? 'bodyInfo.warning' :
      info ? 'bodyInfo.info' : null;

    if(!type) { return; }

    return (
      <div style={this.style('bodyInfo.root', type)}>
        {warn || info}
      </div>
    );
  },

  getBillDisplay(){
    let { order, mode } = this.props;
    let statuses = order.getOrderEntryStatuses();
    let lowest = _.min(statuses);
    if(lowest >= ORDER_ENTRY_STATUS.QUOTED) {
      return this._viewEstCost.bind(this,this._showRejctConfirm);
    }
  },

  getBillLinkColor(){
    let { order, mode } = this.props;
    let statuses = order.getOrderEntryStatuses();
    let lowest = _.min(statuses);
    if(lowest >= ORDER_ENTRY_STATUS.QUOTED){
      return '#004588';
    }else {
      return '#d0d0d0';
    }
  },

  renderMessage(update){
    let el = update ? <Message style={this.style('message')} onClick={this._viewMessage}/> : null;
    return el;
  },

  render() {
    let {
      addOrderEntryToOrder,
      changed,
      costTypes,
      findMainProducts,
      findSubProductsById,
      fullHeight,
      mode,
      nLabelConsignee,
      nLabelConsigner,
      order,
      segment,
      ship,
      params,
      location,
      user,
      chats,
      ...other,
    } = this.props;
    let { isUpdate, productsUpdate, productIds } = this.state;
    let isCreateOrder = _.get(user.getOrderPermission(),'createOrder', true);
    let type = order.type && order.type.code;
    let flag = order.type && order.type.flag;
    let assType = mode === ORDER_MODE.CONSIGNER
      ? ACCOUNT_TYPE.CONSIGNEE
      : mode === ORDER_MODE.CONSIGNEE
        ? ACCOUNT_TYPE.CONSIGNER
        : null;
    let elAssDialog = null;
    if(assType) {
      elAssDialog = (
        <AssAccountDialog
          ref='assAccDialog'
          type={assType}
          onOK={this._handleChooseAcc}
          onDismiss={this._handleChooseAccDismiss}
        />
      );
    }
    let date = `EPCODE${flag}${order.toJS().dateCreate.replace(/\D+/g,'').substring(0,15)}`;

    let orderNumber = _.get(order,'orderNumber') || date;
    return (
      <Paper ref='root' style={this.style('root')}>
        <OrderHeader
          {...this._getOrderActions()}
          user={user}
          ref='header'
          style={this.style('header')}
          title={this.t('nTitleAgentOrder')}
          infoText={this._getInfoText()}
          warningText={this._getWarningText()}
          subtitle={this.t(`nLabelOrderType${type}`)}
          subtitleStyle={this._handleSubtitle()}
          flag = {flag}
          order={order}
          orderNumber = {orderNumber}
          onAction={this._handleOrderAction}
          dateCreate={order.toJS().dateCreate}
          verifyStatus = { ship.verifyStatus }
        />
        <div ref='body' style={this.style('body')}>
          <div ref='brief' style={this.style('brief')}>
            {this.renderOrg()}
            {this.renderCost()}
          </div>
          <OrderEntryList
            ref='entries'
            params = {params}
            location = {location}
            addOrderEntryToOrder={addOrderEntryToOrder}
            onFeedbackDialogOpen = {this.props.onFeedbackDialogOpen}
            clearUnreadStatus = {this.clearUnreadStatus}
            changed={changed}
            costTypes={costTypes}
            disabled={this.props.order.isCancelled()}
            findMainProducts={findMainProducts}
            findSubProductsById={findSubProductsById}
            fullHeight={fullHeight}
            mode={mode}
            onFold={this._handleFold}
            order={order}
            segment={segment}
            ship={ship}
            style={this.style('entries')}
            productsUpdate={productsUpdate}
            productIds={productIds}
            user={user}
          />
          <div ref='footer' style={this.style('footer.wrapper')}>
            {this.renderChatButton()}
          </div>
        </div>
        {elAssDialog}
        <SettingsDialog
          ref='settings'
          order={order}
          mode={mode}
          open={false}
        />
        <DialogConfirm ref='confirm' />
        {this.renderMessenger(orderNumber, type, chats, user)}
      </Paper>
    );
  },

  renderChatButton(){
    let { order, user } = this.props;
    let status = _.get(this.props.order.toJS(), 'status');
    let isChat = _.get(user.getOrderPermission(),'chat');
    let inActive = status === 0;
    let hasConsignee = !!_.get(this.props.order.toJS(), 'consignee');
    let show = isChat && !inActive && hasConsignee;
    return (
      <div
        title={this.t('nLabelMessage')}
        style={_.assign({},this.style('footer.button'),{display: show ? 'block' : 'none'})}
        onClick={this._handleMessengerOpen}
      >
        <CustomerService style={this.style('org.service')}/>
      </div>
    );
  },

  renderMessenger(orderNumber, type) {
    let { onTop, id, chats, user } = this.props;
    return this.state.messengerOpen && onTop === id && (
      <Messenger
        ref="messenger"
        orderType={this.t(`nLabelOrderType${type}`)}
        orderNumber={orderNumber}
        onTop={this.state.onTop}
        messages={chats}
        user={user}
      />
    );
  },

  _viewMessage(){
    let entrylist = this.refs.entries;
    if(!entrylist) return;
    entrylist.refs.matrix.switchToFirst();
    this.props.onFeedbackDialogOpen();
    this.clearUnreadStatus();
  },

  getProductsUpdateStatus(ids) {
    if(ids.length === 0) return;
    if(_.isFunction(global.api.message.getProductsUpdateStatus)){
      global.api.message.getProductsUpdateStatus.promise(ids)
      .then((res)=>{
        if(res.status === 'OK'){
          this.setState({productsUpdate:res.response.update.products});
        }
      })
      .catch((err)=>{
        console.log(err);
        console.log(this.t('nTextInitedFailed'));
      })
    }
  },

  clearUnreadStatus(){
    let { feedbacks } = this.state;

    if(_.isFunction(global.api.message.clearUnreadStatusByIds)){
      global.api.message.clearUnreadStatusByIds.promise(feedbacks)
      .then((res)=>{
        if(res.status === 'OK'){
          this.setState({isUpdate: false});
        }
      })
      .catch((err)=>{
        console.log(this.t('nTextInitedFailed'));
      })
    }
  },

  setOnTop(zIndex){
    this.setState({onTop:zIndex});
  },

  _getVisibleOrderEntries() {
    let {
      mode,
      order,
    } = this.props;

    if(order.orderEntries) {
      return order.orderEntries.filter((e) => {
        if(mode === ORDER_MODE.CONSIGNER) { return e.visible; }
        if(mode === ORDER_MODE.CONSIGNEE) { return !e.isInitial(); }
      });
    }
    return null;
  },

  _getMatrixIds(entries) {
    if(!entries) { return []; }
    let ids = [];
    entries.forEach((e) => {
      let entry = {};
      entry.id = e._id;
      entry.config = true;
      if(e.product.code === 'PTSOF' || e.product.code === 'PTOL' || e.product.code === 'PTAGT'){
        entry.config = false;
      }
      ids.push(entry);
    });
    return ids;
  },

  _handleMessengerOpen(){
    this.setState({messengerOpen: true}, () => {
      this.context.setOnTop(this.props.id);
    });
  },

  _handleMessengerClose(){
    this.setState({messengerOpen: false});
  },

  _handleSubtitle() {
      let { order } = this.props;
    if(!this.props.order.isCancelled()) return true;
  },

  _handleOrderAction(action) {
    let key = action.key;
    let state = action.state;
    if(!key) { return; }

    let fn = this[`_${key}`];
    if(_.isFunction(fn)) {
      fn(state);
    }
  },

  _handleFold(fold) {
    let target = this.refs.entries;
    if(!target) return;
    let fn = this.props.onFold;
    let offsetTop = ReactDOM.findDOMNode(target).offsetTop; // eslint-disable-line react/no-find-dom-node
    if(_.isFunction(fn)) {
      fn(this.props.order._id, fold, offsetTop);
    }
  },

  _handleChangeTextarea(event, actionName) {
    const value = event.target.value;

    let disabled;
    if(!value || value.length === 0 || value.length > 300){
      disabled = true;
    }else {
      disabled = false;
    }
    if(disabled !== this.refs.confirm.state.conformDisabled){
      this.refs.confirm.setState({
        conformDisabled: disabled,
      });
    };
    if(actionName === 'cancel'){
      this.setState({
        cancelReason:value
      });
    }else if(actionName === 'reject') {
      this.setState({
        rejectReason:value
      });
    }

  },

  _handleChooseAcc(org) {
    if(this._hasJob(JOBS.CHOOSING_CONSIGNEE)) {
      this._doneJob(JOBS.CHOOSING_CONSIGNEE);
      this.props.order.setConsignee(org._id);
    } else if (this._hasJob(JOBS.CHOOSING_CONSIGNER)) {
      this._doneJob(JOBS.CHOOSING_CONSIGNER);
      this.props.order.setConsigner(org._id);
    }
  },

  _handleChooseAccDismiss() {
    this._doneJob(JOBS.CHOOSING_CONSIGNEE);
    this._doneJob(JOBS.CHOOSING_CONSIGNER);
  },

  _handleAssignConsigner() {
    this._addJob(JOBS.CHOOSING_CONSIGNER);
    this.refs.assAccDialog.show();
  },

  _handleAssignConsignee() {
    this._addJob(JOBS.CHOOSING_CONSIGNEE);
    this.refs.assAccDialog.show();
  },

  _addJob(job) {
    if(!job || this._hasJob(job)) { return; }
    let jobs = this.state.jobs;
    jobs.push(job);
    this.setState({
      jobs: jobs
    });
  },

  _doneJob(job) {
    let jobs = this.state.jobs;
    this.setState({
      jobs: _.pull(jobs, job),
    });
  },

  _hasJob(job) {
    let jobs = this.state.jobs;
    return _.includes(jobs, job);
  },

  _getOrderActions() {
    let { order, mode, user } = this.props;

    let primaryAction = null;
    let secondaryAction = null;
    let secondaryActionIcon = null;

    let orderActions = [];
    let costActions = [];
    let emailActions = [];
    let mainActions = [];

    let statuses = order.getOrderEntryStatuses();

    let lowest = _.head(statuses);
    let more = statuses.length > 1;
    let more2 = _.filter(statuses, s=>s !== ORDER_ENTRY_STATUS.INITIAL).length > 1;

    if(DEBUG) {
      let name = _.findKey(ORDER_ENTRY_STATUS, s=>s===lowest);
      let names = _.map(status, (s) => { return _.findKey(ORDER_ENTRY_STATUS, (t) => { return t === s; }); });

      debug(`订单(${order._id}): 状态: 最低=${name}, 其他=${names.join(', ')}`);
    }

    let permission = user && user.getOrderPermission();
    let isCreateOrder = _.get(permission,'createOrder', true);
    let isCheckQuote = _.get(permission,'checkQuote', true);
    let isStartOperation = _.get(permission,'startOperation', true);
    let isCompleteOperation = _.get(permission,'completeOperation', true);
    let isCompleteOrder = _.get(permission,'completeOrder', true);
    let isQuotation = _.get(permission,'quotation', true);
    let isAddService = _.get(permission,'addService', true);

    const CONSIGNER_ACTIONS = {};
    CONSIGNER_ACTIONS[ORDER_ENTRY_STATUS.INITIAL] = [{
      key: 'confirmOrder',
      primaryText: !more ? this.t('nLabelOrderActionConfirmOrder') : this.t('nLabelOrderActionConfirmNewOrderEntry'),
      state: !more ? 'ConfirmOrder' : 'ConfirmNewOrderEntry'
    }];
    if((!isAddService && more) || !isCreateOrder) { CONSIGNER_ACTIONS[ORDER_ENTRY_STATUS.INITIAL] = null; }
    // CONSIGNER_ACTIONS[ORDER_ENTRY_STATUS.QUOTED] = [{
    //   key: 'acceptOrder',
    //   primaryText: !more ? this.t('nLabelOrderActionAcceptAll') : this.t('nLabelOrderActionAcceptNewOrderEntry')
    // }, {
    //   key: 'rejectOrder',
    //   primaryText: !more ? this.t('nLabelOrderActionRejectAll') : this.t('nLabelOrderActionRejectNewOrderEntry')
    // }];

    CONSIGNER_ACTIONS[ORDER_ENTRY_STATUS.QUOTED] = isCheckQuote && [{
      key: 'acceptNewOrderEntry',
      primaryText: !more ? this.t('nLabelOrderActionCheckEstPriceAll') : this.t('nLabelOrderActionCheckNewOrderEntry'),
      state:!more ? 'CheckEstPriceAll' : 'CheckNewOrderEntry'
    }];

    const CONSIGNEE_ACTIONS = {};
    CONSIGNEE_ACTIONS[ORDER_ENTRY_STATUS.QUOTING] = isQuotation && [{
      key: 'quoteOrder',
      primaryText: !more2 ? this.t('nLabelOrderActionQuotedAll') : this.t('nLabelOrderActionQuotedNewOrderEntry'),
      state: !more2 ? 'QuotedAll' : 'QuotedNewOrderEntry'
    }];
    CONSIGNEE_ACTIONS[ORDER_ENTRY_STATUS.REJECTED] = isQuotation && [{
      key: 'quoteOrder',
      primaryText: !more2 ? this.t('nLabelOrderActionQuotedAll') : this.t('nLabelOrderActionQuotedNewOrderEntry'),
      state:!more2 ? 'QuotedAll' : 'QuotedNewOrderEntry'
    }];
    CONSIGNEE_ACTIONS[ORDER_ENTRY_STATUS.ACCEPTED] = isStartOperation && [{
      key: 'beginExecuteOrder',
      primaryText: !more2 ? this.t('nLabelOrderActionExecutingAll') : this.t('nLabelOrderActionExecutingNewOrderEntry'),
      state:!more2 ? 'ExecutingAll' : 'ExecutingNewOrderEntry'
    }];
    CONSIGNEE_ACTIONS[ORDER_ENTRY_STATUS.EXECUTING] = isCompleteOperation && [{
      key: 'endExecuteOrder',
      primaryText: !more2 ? this.t('nLabelOrderActionExecutedAll') : this.t('nLabelOrderActionExecutedNewOrderEntry'),
      state: !more2 ? 'ExecutedAll' : 'ExecutedNewOrderEntry'
    }];
    CONSIGNEE_ACTIONS[ORDER_ENTRY_STATUS.EXECUTED] =  isCompleteOrder && [{
      key: 'closeOrder',
      primaryText: this.t('nLabelOrderActionCompletedAll'),
      state: 'CompletedAll'
    }];

    // A 订单项状态操作
    //
    if(mode === ORDER_MODE.CONSIGNER && order.consignee) {
      for(let status of statuses) {
        let o = CONSIGNER_ACTIONS[status];
        if(o) { orderActions = orderActions.concat(o); }
      }
      let p = CONSIGNER_ACTIONS[lowest];
      if(p) {
        primaryAction = p[0].key;
        if(p[1]) {
          secondaryAction = p[1].key;
          secondaryActionIcon = p[1].icon;
        }
      }
    }

    if(mode === ORDER_MODE.CONSIGNEE && order.consigner) {
      // 新添加的初始状态的订单项要为代理排除掉
      if(lowest === ORDER_ENTRY_STATUS.INITIAL) { lowest = statuses[1]; }

      for(let status of statuses) {
        let o = CONSIGNEE_ACTIONS[status];
        if(o) { orderActions = orderActions.concat(o); }
      }
      let p = CONSIGNEE_ACTIONS[lowest];
      if(p) {
        primaryAction = p[0].key;
        if(p[1]) {
          secondaryAction = p[1].key;
          secondaryActionIcon = p[1].icon;
        }
      }
    }

    // B 费用及账单
    //

    // if(order.hasAnyBeyond(ORDER_ENTRY_STATUS.QUOTED) && !order.hasAnyBeyond(ORDER_ENTRY_STATUS.QUOTING)) {
    //   costActions.push({key: 'viewEstCost', primaryText: this.t('nButtonViewOrderEstCost')});
    // }
    //
    // if(lowest === ORDER_ENTRY_STATUS.ACCEPTED) {
    //   costActions.push({key: 'viewEstCost', primaryText: this.t('nButtonViewOrderEstCost')});
    // }
    //
    // if(lowest === ORDER_ENTRY_STATUS.EXECUTING) {
    //   costActions.push({key: 'viewEstCost', primaryText: this.t('nButtonViewOrderEstCost')});
    // }
    //
    // if(lowest === ORDER_ENTRY_STATUS.EXECUTED) {
    //   costActions.push({key: 'viewEstCost', primaryText: this.t('nButtonViewOrderEstCost')});
    // }
    //
    // if(lowest === ORDER_ENTRY_STATUS.COMPLETED) {
    //   costActions.push({key: 'viewActCost', primaryText: this.t('nButtonViewOrderActCost')});
    // }


    // B 邮件发送按钮的设置
    //
    // 根据最先进订单项的状态，设置可发送的当前邮件种类
    // (any) INITIAL/QUOTING => First Response
    // (any) QUOTED          => Quotation
    // (any) Executing       => Daily Report
    // (all) Executed        => Sailing Report和Final PDA
    // (all) COMPLETED       => Bill
    // if(order.hasAnyInitial() || order.hasAnyQuoting()) {
    //   emailActions.push({key: 'sendFirstResponse', primaryText: this.t('nLabelOrderActionSendFirstResponse')});
    //   secondaryAction = 'sendFirstResponse';
    // }
    // if(order.hasAnyQuoted()) {
    //   emailActions.push({key: 'sendQuotation', primaryText: this.t('nLabelOrderActionSendQuotation')});
    //   secondaryAction = 'sendQuotation';
    // }
    // if(order.hasAnyExecuting()) {
    //   emailActions.push({key: 'sendDailyReport', primaryText: this.t('nLabelOrderActionSendDailyReport')});
    //   secondaryAction = 'sendDailyReport';
    // }
    // if(order.hasAllExecuted()) {
    //   emailActions.push({key: 'sendSailingReport', primaryText: this.t('nLabelOrderActionSendSailingReport')});
    //   emailActions.push({key: 'sendFinalPDA', primaryText: this.t('nLabelOrderActionSendFinalPDA')});
    //   secondaryAction = 'sendSailingReport';
    // }
    // if(order.hasAllCompleted()) {
    //   emailActions.push({key: 'sendBill', primaryText: this.t('nLabelOrderActionSendBill')});
    //   secondaryAction = 'sendBill';
    // }
    // if(emailActions.length > 0) {
    //   emailActions.push('divider');
    // }

    // C 订单设置与订单级别状态改变
    //
    let isNoticeSetting = _.get(this.props.user.getOrderPermission(),'noticeSetting');
    let isCancelOrder = _.get(this.props.user.getOrderPermission(),'cancelOrder');
    if(isNoticeSetting) {
      mainActions.push({key: 'notification', disabled: (order.withinClosed() ? false : true), primaryText: this.t('nLabelOrderNotificationSettings')});
      mainActions.push('divider');
    }
    if(order.type.code === 'OTPCD' || order.type.code === 'OTCD' || order.type.code === 'OTPCL' || order.type.code === 'OTCL') {
      mainActions.push({key: 'configuration', disabled: (order.withinClosed() ? false : true), primaryText: this.t('nLabelOrderConfiguration')});
    }
    if(isCancelOrder) {
      mainActions.push({key: 'cancelOrder', disabled: (order.beyondClosed() ||
          (mode === ORDER_MODE.CONSIGNER && order.hasAnyBeyond(ORDER_ENTRY_STATUS.PENDING) ||
          (mode === ORDER_MODE.CONSIGNEE && order.hasAllBeyond(ORDER_ENTRY_STATUS.EXECUTING)))), primaryText: this.t('nLabelOrderActionCancel')});
    }
    mainActions.push({key:'refreshOrder',disabled: (order.withinClosed() ? false : true),primaryText: this.t('nLabelOrderActionRefresh')});
    if(lowest === ORDER_ENTRY_STATUS.REJECTED){
      mainActions.push({key:'rejectReason',primaryText: this.t('nLabelRejctOrderReason')});
    }
    let actions = orderActions;

    if(actions.length > 0 && costActions.length > 0) {
      actions.push('divider');
    }
    actions = actions.concat(costActions);
    if(actions.length > 0 && mainActions.length > 0) {
      actions.push('divider');
    }
    actions = actions.concat(mainActions);
    if(order.isCancelled()) {
      actions = [{
        key: 'cancelReason',
        primaryText: this.t('nLabelOrderActionCancelReason')
      }];
    }

    return {
      primaryAction: primaryAction,
      secondaryAction: secondaryAction,
      secondaryActionIcon: secondaryActionIcon,
      actions: actions,
    };
  },

  _getWarningText() {
    if(this.props.order.isCancelled()) {
      return (
        <span style={this.style('cancel')}>{this.t('nTextOrderIsCanceled')}</span>
      )
    }
  },

  _getInfoText() {
    let { order, mode, user } = this.props;

    let permission = user && user.getOrderPermission();
    let isCreateOrder = _.get(permission,'createOrder', true);

    let statuses = order.getOrderEntryStatuses();
    let lowest = _.head(statuses);
    let more = statuses.length > 1;

    if(mode === ORDER_MODE.CONSIGNER) {
      if(!order.consignee && isCreateOrder) { return this.t('nTextShouldAssignConsignee'); }

      return order.isInitial() && isCreateOrder ? this.t('nTextPleaseAddServiceNeeded') :
      lowest === ORDER_ENTRY_STATUS.QUOTING ? this.t('nTextConsigneeIsQuoting') :
      lowest === ORDER_ENTRY_STATUS.REJECTED ? this.t('nTextConsigneeIsQuotingAfterReject') :
      lowest === ORDER_ENTRY_STATUS.ACCEPTED ? this.t('nTextOrderWaitForExecute') :
      lowest === ORDER_ENTRY_STATUS.EXECUTING ? this.t('nTextConsigneeIsExecuting') :
      lowest === ORDER_ENTRY_STATUS.EXECUTED ? this.t('nTextConsigneeHasExecuted') :
      order.isClosed() ? this.t('nTextOrderIsCompleted') :
      null;
    } else if(mode === ORDER_MODE.CONSIGNEE) {
      if(lowest === ORDER_ENTRY_STATUS.INITIAL) {
        lowest = statuses[1];
      }

      if(!order.consigner) { return this.t('nTextShouldAssignConsigner') }

      return lowest === ORDER_ENTRY_STATUS.QUOTED && !more ? this.t('nTextOrderWaitForAccept') :
      lowest === ORDER_ENTRY_STATUS.QUOTED && more ? this.t('nTextOrderWaitForAcceptNewOrderEntry') :
      lowest === ORDER_ENTRY_STATUS.REJECTED && !more ? this.t('nTextOrderIsRejected') :
      lowest === ORDER_ENTRY_STATUS.REJECTED && more ? this.t('nTextOrderIsRejectedNewOrderEntry') :

      // lowest === ORDER_ENTRY_STATUS.REJECTED ? this.t('nTextConsigneeIsQuoting') :
      // lowest === ORDER_ENTRY_STATUS.ACCEPTED ? this.t('nTextOrderWaitForExecute') :
      // lowest === ORDER_ENTRY_STATUS.EXECUTING ? this.t('nTextConsigneeIsExecuting') :
      // lowest === ORDER_ENTRY_STATUS.EXECUTED ? this.t('nTextConsigneeHasExecuted') :
      order.hasAllRejected() ? this.t('nTextSomeOrderEntryIsRejected') :
      order.isClosed() ? this.t('nTextOrderIsCompleted') :
      null;
    }
  },

  _confirmOrder(state) {
    this.props.order.confirm(null,state);
  },

  _quoteOrder() {
    this._viewEstCost();
    //this.props.order.quote();
  },

  _acceptOrder() {
    this._viewEstCost();
    //this.props.order.accept();
  },

  _acceptNewOrderEntry(){
    this._viewEstCost(this._showRejctConfirm);
  },

  _rejectOrder() {
    this._viewEstCost();
    //this.props.order.reject();
  },

  _beginExecuteOrder(state) {
    this.props.order.beginExecute(null,state);
  },

  _endExecuteOrder(state) {
    this._showConfirm({
      title: this.t('nTitleConfirmEndExecution'),
      content: this.t('nButtonOkEndExecution'),
      modal: true,
      autoDismiss: true,
      buttonConfirmLabel: this.t('nLabelOrderActionExecutedAll'),
      onTouchTapConfirm: () => {
        this.props.order.endExecute(null,state);
      }
    });
  },

  _closeOrder() {
    this._viewActCost(true);
    // this._showConfirm({
    //   title: this.t('nTitleConfirmCloseOrder'),
    //   content: this.t('nButtonOkCloseOrder'),
    //   modal: true,
    //   autoDismiss: true,
    //   buttonConfirmLabel: this.t('nLabelOrderActionCompletedAll'),
    //   onTouchTapConfirm: () => {
    //     this.props.order.close();
    //   }
    // });
  },

  _chechShip() {
    let { order, mode, ship } = this.props;
    return !ship.nationality || !ship.getGRT() || !ship.getNRT();
  },

  _cancelOrder() {
    const content = (
      <div>
        <TextField
          rowsMax={5}
          fullWidth={true}
          multiLine={true}
          floatingLabelText={this.t('nLabelOrderActionCancelReason')}
          hintText={this.t('nLabelMaxLength')}
          onChange={event => {this._handleChangeTextarea(event,'cancel')}}
        />
    </div>
    )

    this._showConfirm({
      conformDisabled: true,
      title: this.t('nLabelOrderActionCancel'),
      content: content,
      modal: true,
      autoDismiss: true,
      buttonConfirmLabel: this.t('nButtonSave'),
      onTouchTapConfirm: () => {
        this.props.order.cancel(_.isString(this.state.cancelReason) ? this.state.cancelReason : this.state.cancelReason.toString(),'Cancel');
      }
    });
  },

  _showRejctConfirm(state) {
    const content = (
      <div>
        <TextField
          rowsMax={5}
          fullWidth={true}
          multiLine={true}
          floatingLabelText={this.t('nLabelRejctOrderReason')}
          hintText={this.t('nLabelMaxLength')}
          onChange={event => {this._handleChangeTextarea(event,'reject')}}
        />
    </div>
    )

    this._showConfirm({
      conformDisabled: true,
      title: this.t('nLabelOrderActionRejectAll'),
      content: content,
      modal: true,
      autoDismiss: true,
      buttonConfirmLabel: this.t('nButtonSave'),
      onTouchTapConfirm: () => {
        this.props.order.reject(null, _.isString(this.state.rejectReason) ? this.state.rejectReason : this.state.rejectReason.toString(),state);
      }
    });
  },

  _cancelReason() {
    const {order} = this.props;
    const reason = order.cancelReason;
    alert(reason, this.t('nLabelCancelOrderReason'));
  },

  _rejectReason() {
    const {order} = this.props;
    const reason = order.rejectReason;
    alert(reason, this.t('nLabelRejctOrderReason'));
  },

  _refreshOrder(){
    this.props.order.refresh();
  },

  _viewEstCost(fn) {
    this._viewPrice(true,null,fn);
  },

  _viewActCost(isCloseOrder) {
    this._viewPrice(false,isCloseOrder);
  },

  _viewPrice(isEstimated,isCloseOrder, fn){
    let{
      ship,
      order,
      segment,
      costTypes,
      allProducts,
      mode,
    } = this.props;
    let props = {
      title: isEstimated ? this.t('nLabelCostEst'): (isCloseOrder ? this.t('nTitleConfirmCloseOrder'): this.t('nLabelCostAct')),
      open: true,
    };
    let component = {
      name: 'CostEstViewDialog',
      props: {
        ship: ship,
        order: order,
        isEstimated: isEstimated,
        segment: segment,
        costTypes: costTypes,
        allProducts: allProducts,
        mode: mode,
        autoDetectWindowHeight: true,
        autoScrollBodyContent: true,
      },
    };
    if(fn && _.isFunction(fn)) {
      component.props.showRejctConfirm = fn;
    }
    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  _showConfirm(opt) {
    this.refs.confirm.show(opt);
  },

  _checkEmailSettings() {
    let order = this.props.order;
    let settings = order && order.settings.toJS();
    let emailing = settings && settings.emailing;
    let set1 = emailing && emailing.order;
    let set2 = emailing && emailing.event;
    let recv1 = set1 && set1.receiver;
    let recv2 = set2 && set2.receiver;

    let valid = !!(order && settings && emailing && set1 && set2 && recv1 && recv2);

    if(valid) { return true; }

    this._showConfirm({
      title: this.t('nTitleSomethingWrong'),
      content: this.t('nTextOrderEmailSettingsIsNotSet'),
      modal: true,
      autoDismiss: true,
      buttonConfirmLabel: this.t('nButtonOrderGoToSettings'),
      onTouchTapConfirm: this.openNotificationSettings,
    });

    return false;
  },

  _openOrder() {
    this.props.order.setNormal();
  },

  _notification() {
    this.openNotificationSettings();
  },

  _configuration() {
    this.openOrderConfiguration();
  },

  _removeOrder() {
    this.props.order.remove();
  },

  _showEstPrice() {
    let showPriceTable = true;
    let {order, mode} = this.props;
    let statuses = order.getOrderEntryStatuses();
    let lowest = _.head(statuses);
    if (mode === ORDER_MODE.CONSIGNER && lowest < ORDER_ENTRY_STATUS.QUOTED) {
      showPriceTable = false;
    }
    return showPriceTable;
  },
});

module.exports = Order;
