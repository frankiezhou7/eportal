const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Avatar = require('epui-md/Avatar');
const CircularProgress = require('epui-md/ep/CircularProgress');
const Dialog = require('epui-md/ep/Dialog/Dialog');
const DialogConfirm = require('./dialog-confirm');
const DivButton = require('./product-config-forms/components/div-button');
const FlatButton = require('epui-md/FlatButton');
const IconAdd = require('epui-md/svg-icons/content/add');
const IconClear = require('epui-md/svg-icons/content/clear');
const IconSave = require('epui-md/svg-icons/content/save');
const MatrixList = require('epui-md/ep/MatrixList');
const OrderEntryDetailsView = require('./order-entry-details-view');
const OrderMixin = require('./mixins/order');
const ProductIcons = require('./product-icons');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const ServiceProductListView = require('./service-product-list-view');
const StylePropable = require('~/src/mixins/style-propable');
const Tab = require('epui-md/Tabs/Tab');
const Tabs = require('epui-md/Tabs/Tabs');
const Translatable = require('epui-intl').mixin;

const ORDER_MODE = require('~/src/shared/constants').ORDER_MODE;
const ORDER_ENTRY_STATUS = require('~/src/shared/constants').ORDER_ENTRY_STATUS
const ICON_OUTER_SIZE = 48;
const ICON_INNER_SIZE = 32;
const PROGRESS_STROKE_WIDTH = 4;
const PROGRESS_INNER_SPACE = 4;
const PROGRESS_SIZE = ICON_OUTER_SIZE + 2 * (PROGRESS_STROKE_WIDTH + PROGRESS_INNER_SPACE);
const EVENT_PAGE = 'EVENT_PAGE';
const CONFIG_PAGE = 'CONFIG_PAGE';
const PRICE_PAGE = 'PRICE_PAGE';
const FILE_PAGE = 'FILE_PAGE';
const PORT_AGENCY_CODE = 'PTAGT';
const PORT_CAPTION_OUTLAY_CODE = 'PTOL';
const SCHEDULE_REPORT_CODE = 'PTSR';
const SOF_CODE = 'PTSOF';
const VIEW_MESSAGE = 'VIEW_MESSAGE';
const OrderEntryList = React.createClass({
  mixins: [StylePropable, Translatable, OrderMixin, PureRenderMixin],

  translations: [
    require(`epui-intl/dist/ServiceProducts/${__LOCALE__}`),
    require(`epui-intl/dist/OrderEntryList/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    addOrderEntryToOrder: PropTypes.func,
    calculateOrderEntryFee: PropTypes.func,
    changed: PropTypes.bool,
    costTypes: PropTypes.any,
    disabled: PropTypes.bool,
    findMainProducts: PropTypes.func,
    findSubProductsById: PropTypes.func,
    fullHeight: PropTypes.number,
    mode: PropTypes.oneOf(_.values(ORDER_MODE)),
    nButtonAddServiceProduct: PropTypes.string,
    nButtonCancel: PropTypes.string,
    nButtonDisposeChange: PropTypes.string,
    nLabelConfirmRemoveProduct: PropTypes.string,
    nLabelProductConfig: PropTypes.string,
    nLabelProductEvent: PropTypes.string,
    nLabelProductPrice: PropTypes.string,
    nLabelRemoveProduct: PropTypes.string,
    nTextChangeConfirmation: PropTypes.string,
    nLabelRemove: PropTypes.string,
    nTextSaveChange: PropTypes.string,
    nTipFoldOff: PropTypes.string,
    nTipRefresh: PropTypes.string,
    nTipRemove: PropTypes.string,
    nTipSavePriceConfig: PropTypes.string,
    nTipSaveProductConfig: PropTypes.string,
    nTitleChangeConfirmation: PropTypes.string,
    onFold: PropTypes.func,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    products: PropTypes.object,
    segment: PropTypes.object,
    ship: PropTypes.object,
    style: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object,
    updateOrderEntry: PropTypes.func,
    onFeedbackDialogOpen: PropTypes.func,
    clearUnreadStatus : PropTypes.func,
    productsUpdate: PropTypes.array,
    productIds: PropTypes.array,
    user: PropTypes.object,
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  getInitialState() {
    return {
      isAdding: false,
      foldingUp: false,
      openConfirm: false,
      page: CONFIG_PAGE,
      switchingTo: null,
      activeOrderEntryId: '',
      subProductsLength: null,
      activeProductCode: '',
    };
  },

  componentWillMount() {

  },

  isDirty() {
    let entry = this.refs.orderEntryDetailsView && this.refs.orderEntryDetailsView.getWrappedInstance();
    if(!entry) { return false; }
    return entry.refs.container.refs.orderEntryDetails.isDirty();
  },

  fold(flag, force) {
    if(this.refs.matrix) {
      this.refs.matrix.fold(flag, force);
    }
  },

  switchTo(idx) {
    let matrix = this.refs.matrix;
    if(!matrix) { return; }
    matrix.switchTo(idx, true);
  },

  switchToPage(idx,page) {
    if(!_.isEmpty(page) && page!= VIEW_MESSAGE){
      this.setState({page:page},()=>{
        this.switchTo(idx);
        this.fold(false);
      });
    }else{
      this.switchTo(idx);
      this.fold(false);
    }
  },

  getStyles() {
    let progressMargin = -(PROGRESS_SIZE - ICON_INNER_SIZE) / 2;
    return {
      avatar: {
        fill: '#FFF',
        width: ICON_INNER_SIZE,
        height: ICON_INNER_SIZE,
        border: 'none',
      },
      icon: {
        fill: '#FFF',
        width: ICON_INNER_SIZE,
        height: ICON_INNER_SIZE,
      },
      progress: {
        display: 'inline-block',
        position: 'absolute',
        top: progressMargin,
        left: progressMargin
      },
      tab: {
        height: 'inherit',
        minWidth: 48,
        paddingLeft: 10,
        paddingRight: 10,
        width: 150,
      },
      tabs:{

      },
      tabItemContainer:{
        backgroundColor: this.context.muiTheme.palette.primary1Color,
      },
      price:{
        fontSize: 14,
        lineHeight: '48px',
        color: '#FFF',
        paddingLeft: 10,
      },
      inkBar:{
        backgroundColor:'#fff',
      }
    };
  },

  componentDidMount(){
    let order = this.props.order.toJS();
    let orderId = this.props.params.orderId;
    let orderEntryId = this.props.params.orderEntryId;
    let page = this.props.params.page;
    let isActive = orderId == order._id;
    //open active orderEntry
    if(isActive){
      global.currentOrder = order;
      let matrix = this.refs.matrix;
      let to = _.findIndex(order.orderEntries, orderEntry => orderEntry._id == orderEntryId );
      if (to<0) to =0;
      //can't figure out why matrixlist doesn't trigge componentWillUpdate method when calling setState method
      //using settimeout method to fixer this bug
      setTimeout(()=>{
        this.switchToPage(to,page);
      },1);
    }
  },

  componentWillReceiveProps(nextProps) {
    let order = nextProps.order;
    let matrix = this.refs.matrix;
    let preOrder = this.props.order;
    if (preOrder && order && matrix) {
      let shouldOrderFold = (preOrder.status !== preOrder.STATUS.CANCELLED && preOrder.status !== preOrder.STATUS.CLOSED) &&
        (order.status == order.STATUS.CANCELLED || order.status == order.STATUS.CLOSED);
      if (shouldOrderFold && !matrix.isFold()) {
        matrix.fold(true);
      }
    }
  },

  componentWillUpdate(nextProps, nextState) {
    let entries = this._getVisibleOrderEntries();
    let selected = entries && entries.get(this.state.selectedIndex);
    let nextselected = entries && entries.get(nextState.selectedIndex);
    let status = _.get(this.props.order.toJS(), 'status');
    let newPage, page = this.state.page;
    let { productIds } = this.props;
    let { activeOrderEntryId, subProductsLength } = nextState;
    let updateConfigTimes = 0;

    if(nextselected){
      switch (nextselected.product.code) {
        case PORT_AGENCY_CODE:
          newPage = (page == CONFIG_PAGE || page == FILE_PAGE) ? PRICE_PAGE : page;
          break;
        case PORT_CAPTION_OUTLAY_CODE:
          newPage = (page == CONFIG_PAGE || page == FILE_PAGE) ? PRICE_PAGE : page;
          break;
        case SCHEDULE_REPORT_CODE:
          newPage = (page == PRICE_PAGE || page == FILE_PAGE) ? CONFIG_PAGE : page;
          break;
        case SOF_CODE:
          newPage = (page == CONFIG_PAGE || page == PRICE_PAGE) ? FILE_PAGE : page;
          break;
        default:
          newPage = page;
      }
      if(page != newPage) this.setState({ page: newPage });

      if(status === 999 || status === 1000 || status === 0) return;
      if(activeOrderEntryId.length > 0){
        if(nextState.page === EVENT_PAGE && this.state.page !== nextState.page){
          if(_.isFunction(global.api.message.clearUnreadStatusByOrderEntryId)){
            global.api.message.clearUnreadStatusByOrderEntryId.promise(activeOrderEntryId, 'Event')
            .then((res)=>{
              if(res.status === 'OK'){
                this.setState({EVENT_PAGE_UPDATE:false});
              }
            })
            .catch((err)=>{
              console.log(this.t('nTextInitedFailed'));
            })
          }
          if(_.isFunction(global.api.message.getUpdateStatus)){
            global.api.message.getUpdateStatus.promise(activeOrderEntryId, 'config')
            .then((res)=>{
              if(res.status === 'OK'){
                this.setState({CONFIG_PAGE_UPDATE:res.response.update});
              }
            })
            .catch((err)=>{
              console.log(this.t('nTextInitedFailed'));
            })
          }
        }

        if(nextState.page === CONFIG_PAGE && this.state.page !== nextState.page){
          // ++updateConfigTimes;
          if(_.isFunction(global.api.message.clearUnreadStatusByOrderEntryId)){
            global.api.message.clearUnreadStatusByOrderEntryId.promise(activeOrderEntryId, 'Change')
            .then((res)=>{
              if(res.status === 'OK'){
                this.setState({CONFIG_PAGE_UPDATE:false});
              }
            })
            .catch((err)=>{
              console.log(this.t('nTextInitedFailed'));
            })
          }else {
            if(_.isFunction(global.api.message.getUpdateStatus)){
              global.api.message.getUpdateStatus.promise(activeOrderEntryId, 'config')
              .then((res)=>{
                if(res.status === 'OK'){
                  this.setState({CONFIG_PAGE_UPDATE:res.response.update});
                }
              })
              .catch((err)=>{
                console.log(this.t('nTextInitedFailed'));
              })
            }
          }
        }
      }
    }
  },

  componentDidUpdate(prevProps,prevState){
    let status = _.get(this.props.order.toJS(), 'status');
    if(status === 999 || status === 1000 || status === 0) return;
    if(prevState.EVENT_PAGE_UPDATE === true && this.state.EVENT_PAGE_UPDATE === false){
      global.updateProductUnreadStatus(this.props.productIds);
    }

    if(prevState.CONFIG_PAGE_UPDATE === undefined && this.state.CONFIG_PAGE_UPDATE === false){
      global.updateProductUnreadStatus(this.props.productIds);
    }

    if(prevState.CONFIG_PAGE_UPDATE === true && this.state.CONFIG_PAGE_UPDATE === false){
      global.updateProductUnreadStatus(this.props.productIds);
    }
  },

  renderOrderEntryIcon(entry) {
    let theme = this.context.muiTheme;
    let styles = this.getStyles();
    let productCode = entry.product.code;
    let IconClass = ProductIcons[productCode] || ProductIcons.UNKNOWN;

    let elProgress = (
      <CircularProgress
        {...this._getEntryProgressOption(entry)}
        style={this.mergeAndPrefix(styles.progress)}
        size={PROGRESS_SIZE}
        mode='determinate'
        min={0}
        max={100}
        strokeWidth={PROGRESS_STROKE_WIDTH}
      />
    );

    return (
      <div>
        <IconClass style={this.mergeAndPrefix(styles.icon)} />
        {elProgress}
      </div>
    );
  },

  renderConfirmDialog() {
    let actions = [
      <FlatButton
        key="back"
        label={this.t('nButtonCancel')}
        primary={true}
        onTouchTap={this._handleTouchTapBack}
      />,
      <FlatButton
        key="dispose"
        label={this.t('nButtonDisposeChange')}
        onTouchTap={this._handleTouchTapDisposeChange}
      />,
      <FlatButton
        key="save"
        label={this.t('nTextSaveChange')}
        onTouchTap={this._handleTouchTapSaveChange}
      />
    ];

    return (
      <Dialog
        ref='confirm'
        style={{overflow:'auto'}}
        open={this.state.openConfirm}
        title={this.t('nTitleChangeConfirmation')}
        actions={actions}
        modal={true}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        repositionOnUpdate={true}
      >
        {this.t('nTextChangeConfirmation')}
      </Dialog>
    );
  },

  renderTab(selected) {
    let styles = this.getStyles();
    let code = selected.product.code;
    let tabElem;
    let tabs = [{
      name: code === PORT_AGENCY_CODE ? this.t('nLabelGeneralProductEvent'):this.t('nLabelProductEvent'),
      page: EVENT_PAGE
    }];

    if(code === PORT_AGENCY_CODE || code === PORT_CAPTION_OUTLAY_CODE){
      tabs.push({
        name: this.t('nLabelProductPrice'),
        page: PRICE_PAGE
      });
    }else if(code === SCHEDULE_REPORT_CODE){
      tabs.unshift({
        name: this.t('nLabelProductConfig'),
        page: CONFIG_PAGE
      });
    }else if(code === SOF_CODE){
      tabs.unshift({
        name: this.t('nLabelProductFeedback'),
        page: FILE_PAGE
      });
    }else {
      tabs.unshift({
        name: this.t('nLabelProductFeedback'),
        page: FILE_PAGE
      });
      tabs.unshift({
        name: this.t('nLabelProductPrice'),
        page: PRICE_PAGE
      });
      tabs.unshift({
        name: this.t('nLabelProductConfig'),
        page: CONFIG_PAGE
      });
    }

    let items = [];
    tabs.forEach((obj,index) => {
      if(obj.name && obj.page) {
        items.push(
          <Tab
            style={this.mergeAndPrefix(styles.tab)}
            key={obj.page}
            label={obj.name}
            value={obj.page}
            onActive={this._handleSwitchBtnClick.bind(this, obj.page, selected)}
            capitalize={obj.name}
            isUpdate={this.state[`${obj.page}_UPDATE`]}
          />
        );
      }
    });
    tabElem = (
      <Tabs
        ref='tabs'
        key='page-tabs'
        value={this.state.page}
        style={this.mergeAndPrefix(styles.tabs)}
        tabItemContainerStyle={this.mergeAndPrefix(styles.tabItemContainer)}
        inkBarStyle={styles.inkBar}
      >
        {items}
      </Tabs>
    );

    return tabElem;
  },

  render() {
    let styles = this.getStyles();
    let theme = this.context.muiTheme;
    let {
      calculateOrderEntryFee,
      changed,
      costTypes,
      disabled,
      findMainProducts,
      findSubProductsById,
      fullHeight,
      mode,
      order,
      orderEntry,
      products,
      segment,
      ship,
      style,
      updateOrderEntry,
      params,
      location,
      productsUpdate,
      user,
      ...other,
    } = this.props;

    let {
      prevSelectedIndex,
      selectedIndex,
    } = this.state;

    let orderId = order._id;
    let entries = this._getVisibleOrderEntries();

    let items = this._toMatrixItems(entries);
    let count = items.length;

    selectedIndex = selectedIndex >= 0 && selectedIndex < count ? selectedIndex : count;
    let selected = selectedIndex === count ? null : entries.get(selectedIndex);
    let isAddService = _.get(user.getOrderPermission(),'addService');
    let isDeleteService = _.get(user.getOrderPermission(),'deleteService');
    let isEditService = _.get(user.getOrderPermission(),'editService');

    let elContent = null;
    let contentButtons = [];
    let contentSwitchButtons = null;
    let showRemoveButton = false;
    if(!disabled && order.withinClosed() && !order.child) {
      if(!this._addEntry) {
        this._addEntry = {
          key: 'addEntry',
          name: this.t('nButtonAddServiceProduct'),
          description: this.t('nButtonAddServiceProduct'),
          icon: IconAdd,
          iconBackgroundColor: theme.palette.accent1Color,
        };
      }
      isAddService && items.push(this._addEntry);
    }
    if(!disabled && selectedIndex === count) {
      elContent = (
        <ServiceProductListView
          ref='productList'
          findMainProducts={findMainProducts}
          mode={mode}
          products={products}
          order={order}
          onProductTouchTap={this._handleAddProduct}
        />
      );
      showRemoveButton = false;
    } else if(!this.state.isAdding) {
      let showPage = this.state.page;

      elContent = (
        <OrderEntryDetailsView
          ref='orderEntryDetailsView'
          changed={changed}
          costTypes={costTypes}
          findSubProductsById={findSubProductsById}
          mode={mode}
          order={order}
          orderEntry={selected}
          page={showPage}
          segment={segment}
          ship={ship}
          params = {params}
          location = {location}
          onReportTitleTouch = {this._handleReportTitleTouch}
          onOpenMessage = {this.props.onFeedbackDialogOpen}
        />
      );
      contentButtons = (isEditService && selected && selected.withinExecuted()) ? [{
        key: 'save',
        // title: this.state.page === CONFIG_PAGE ? this.t('nTipSaveProductConfig') : (this.state.page === PRICE_PAGE ? this.t('nTipSavePriceConfig'): undefined),
        iconClass: IconSave,
        disabled: global.isOrderDetailsChanged ? !global.isOrderDetailsChanged() : true,
      }] : null;

      if(selected) contentSwitchButtons = this.renderTab(selected);
      showRemoveButton = isDeleteService && selected && !selected.fixed && order.withinClosed() && !(selected.status >= ORDER_ENTRY_STATUS.ACCEPTED);
    }
    _.forEach(items, (item, index) => {
      let entry = item && item.entry;
      item.disabled = entry && entry.status === ORDER_ENTRY_STATUS.CANCELLED;
      item.update = false;
      _.forEach(productsUpdate, product => {
        if(product.id == item.key){
          item.update = product.update;
        }
      })
    })

    return (
      <div>
        <MatrixList
          ref='matrix'
          items={items}
          beforeFold={this._handleBeforeContentFold.bind(this, selected)}
          beforeSwitch={this._handleBeforeContentSwitch.bind(this, selected)}
          contentButtonItems={contentButtons}
          contentShowRefresh={false}
          contentShowRemove={showRemoveButton}
          contentSwitchButtonItems={contentSwitchButtons}
          disabled={disabled}
          nTipFoldOff={this.t('nTipFoldOff')}
          nTipFoldOn={this.t('nTipFoldOn')}
          nTipRefresh={this.t('nTipRefresh')}
          nTipRemove={this.t('nTipRemove')}
          onButtonTouchTap={this._handleContentButtonTouchTap}
          onFold={this._handleContentFold}
          onRemove={this._handleItemRemove}
          onSwitch={this._handleContentSwitch}
          openHeight={fullHeight ? fullHeight : '100%'}
          wrapperColor='#fafafa'
          style={this.mergeAndPrefix(style)}
        >
          {elContent}
        </MatrixList>
        {this.renderConfirmDialog()}
        <DialogConfirm ref='confirmDelete' />
      </div>
    );
  },

  _handleTouchTapBack() {
    this.refs.confirm.close();
  },

  _handleTouchTapDisposeChange() {
    let to = this.state.switchingTo;
    let foldingUp = this.state.foldingUp;

    if(_.isNumber(to)) {
      this.setState({ switchingTo: null }, () => {
        this.switchTo(to);
      });
    } else {
      this.setState({ foldingUp: null }, () => {
        this.fold(foldingUp, true);
      });
    }
    global.notifyOrderDetailsChange(false);
    this.refs.confirm.close();
    global.currentOrder.refresh();
  },

  _handleReportTitleTouch(orderEntryId){
    let order = this.props.order.toJS();
    let to = _.findIndex(order.orderEntries, orderEntry => orderEntry._id == orderEntryId );
    if (to<0) return;
    this.switchToPage(to,EVENT_PAGE);
  },


  _handleTouchTapSaveChange() {
    if(this.refs.orderEntryDetailsView && this.refs.orderEntryDetailsView.getWrappedInstance()) {
      this.refs.orderEntryDetailsView.getWrappedInstance().saveProductConfig();
    }
    let to = this.state.switchingTo;
    let foldingUp = this.state.foldingUp;

    if(_.isNumber(to)) {
      this.setState({ switchingTo: null }, () => {
        this.switchTo(to);
      });
    } else {
      this.setState({ foldingUp: null }, () => {
        this.fold(foldingUp, true);
      });
    }
    global.notifyOrderDetailsChange(false);
    this.refs.confirm.close();
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

  _toMatrixItems(entries) {
    if(!entries) { return []; }

    return entries.map((e) => {
      return {
        key: e._id,
        name: this.t(`nLabelProductName${e.product.code}`),
        description: this.t(`nLabelProductDescription${e.product.code}`),
        icon: this.renderOrderEntryIcon(e),
        iconBackgroundColor: this.context.muiTheme.palette.primary1Color,
        fixed: e.fixed,
        entry: e,
        code: e.product.code,
      };
    }).toArray();
  },

  _handleAddProduct(ref, product) {
    let {
      addOrderEntryToOrder,
      order,
    } = this.props;
    let _id = order && order._id;
    let order_v = order && order.__v;
    let orderEntry = {product: product.code};
    if (_.isFunction(addOrderEntryToOrder)) {
      addOrderEntryToOrder(_id, orderEntry, order_v);
    }
  },

  _handleBeforeContentFold(orderEntry, ref, fold) {
    if(!this._isOrderEntryChanged(orderEntry)) {
      if(global.currentProductConfig) global.currentProductConfig = null;
      return ;
    }
    let isEditService = _.get(this.props.user.getOrderPermission(),'editService');
    if(!fold || !isEditService) { return; }
    this.refs.confirm.show();

    return false;
  },

  _handleBeforeContentSwitch(orderEntry, ref, toIdx, fromIdx) {
    let isEditService = _.get(this.props.user.getOrderPermission(),'editService');
    if(!this._isOrderEntryChanged(orderEntry) || !isEditService) { return; }
    this.refs.confirm.show();

    return false;
  },

  _isOrderEntryChanged(orderEntry) {
    if(orderEntry && !orderEntry.withinExecuted()) {
      if(global.isOrderDetailsChanged()) global.notifyOrderDetailsChange(false);
      return false;
    }
    if(global.isOrderDetailsChanged && !global.isOrderDetailsChanged()) { return false; }
    return true;
  },

//remove order
  _handleItemRemove(ref, itemIdx) {
    let entries = this._getVisibleOrderEntries();
    let entry = entries.get(itemIdx);
    if(!entry) { return; }
    let opt = {
      title: this.t('nLabelRemoveProduct'),
      content: this.t('nLabelConfirmRemoveProduct'),
      modal: true,
      autoDismiss: true,
      buttonConfirmLabel: this.t('nLabelRemove'),
      onTouchTapConfirm: () => {
        this.props.order.removeOrderEntry(entry);
      }
    }
    this.refs.confirmDelete.show(opt);
  },

  _handleContentSwitch(ref, toIdx, fromIdx, autoSwitch) {
    let matrixLength = _.get(ref,['props','items']).length;
    let { productIds } = this.props;
    global.currentOrder = this.props.order;
    let subProductsLength = _.get(_.get(global.currentOrder.toJS(),'orderEntries',[])[toIdx], ['productConfig', 'products'], []).length;
    let orderEntryId = _.get(_.get(global.currentOrder.toJS(),'orderEntries',[])[toIdx], '_id', '');
    let productCode = _.get(_.get(global.currentOrder.toJS(),'orderEntries',[])[toIdx], ['product', 'code'], '');
    let state = {
      prevSelectedIndex: fromIdx,
      selectedIndex: toIdx,
      activeOrderEntryId: orderEntryId,
      activeProductCode: productCode,
      subProductsLength,
    };
    this.setState(state);

    let status = _.get(this.props.order.toJS(), 'status');
    if(status === 999 || status === 1000 || status === 0) return;
    if(matrixLength - 1 === toIdx || matrixLength === toIdx) return;
    if(this.state.page === CONFIG_PAGE){
      if(_.isFunction(global.api.message.clearUnreadStatusByOrderEntryId)){
        global.api.message.clearUnreadStatusByOrderEntryId.promise(orderEntryId, 'Change')
        .then((res)=>{
          if(res.status === 'OK'){
            this.setState({CONFIG_PAGE_UPDATE: false});
          }
        })
        .catch((err)=>{
          console.log(this.t('nTextInitedFailed'));
        })
      }
      if(_.isFunction(global.api.message.getUpdateStatus)){
        global.api.message.getUpdateStatus.promise(orderEntryId, 'report')
        .then((res)=>{
          if(res.status === 'OK'){
            this.setState({EVENT_PAGE_UPDATE:res.response.update});
          }
        })
        .catch((err)=>{
          console.log(this.t('nTextInitedFailed'));
        })
      }
    }
    if(this.state.page === EVENT_PAGE){
      if(_.isFunction(global.api.message.clearUnreadStatusByOrderEntryId)){
        global.api.message.clearUnreadStatusByOrderEntryId.promise(orderEntryId, 'Event')
        .then((res)=>{
          if(res.status === 'OK'){
            this.setState({EVENT_PAGE_UPDATE: false});
          }
        })
        .catch((err)=>{
          console.log(this.t('nTextInitedFailed'));
        })
      }
      if(_.isFunction(global.api.message.getUpdateStatus)){
        global.api.message.getUpdateStatus.promise(orderEntryId, 'config')
        .then((res)=>{
          if(res.status === 'OK'){
            this.setState({CONFIG_PAGE_UPDATE:res.response.update});
          }
        })
        .catch((err)=>{
          console.log(this.t('nTextInitedFailed'));
        })
      }
    }

    if(this.state.page === PRICE_PAGE || this.state.page === FILE_PAGE){
      if(_.isFunction(global.api.message.getUpdateStatus)){
        global.api.message.getUpdateStatus.promise(orderEntryId, 'config')
        .then((res)=>{
          if(res.status === 'OK'){
            this.setState({CONFIG_PAGE_UPDATE:res.response.update});
          }
        })
        .catch((err)=>{
          console.log(this.t('nTextInitedFailed'));
        })
        global.api.message.getUpdateStatus.promise(orderEntryId, 'report')
        .then((res)=>{
          if(res.status === 'OK'){
            this.setState({EVENT_PAGE_UPDATE:res.response.update});
          }
        })
        .catch((err)=>{
          console.log(this.t('nTextInitedFailed'));
        })
      }
    }
  },

  _handleContentFold(ref, fold) {
    let fn = this.props.onFold;
    if(_.isFunction(fn)) {
      fn(fold);
    }
  },

  _handleContentButtonTouchTap(matrix, itemIdx, token) {
    let content = this.refs.orderEntryDetailsView && this.refs.orderEntryDetailsView.getWrappedInstance();
    if(!content || !token) { return; }
    if(token.key === 'save') {
      content.saveProductConfig();
    }
  },

  _getEntryProgressOption(entry) {
    let theme = this.context.muiTheme;
    let colors = theme.colors;

    let color = colors.grey300;
    let value = 1;

    if(entry.isQuoting() || entry.isInitial()) {
      color = colors.grey300;
      value = 5;
    } else if(entry.isQuoted()) {
      color = colors.yellow300;
      value = 30;
    } else if(entry.isRejected()) {
      color = colors.red300;
      value = 20;
    } else if(entry.isAccepted() || entry.withinAccepted()) {
      color = colors.green300;
      value = 40;
    } else if(entry.isExecuting() || entry.withinExecuting()) {
      color = colors.green600;
      value = 50;
    } else if(entry.isExecuted() || entry.withinExecuted()) {
      color = colors.yellow300;
      value = 60;
    } else if(entry.isBlamed()) {
      color = colors.red300;
      value = 65;
    } else if(entry.isCompleted()) {
      color = theme.palette.primary1Color;
      value = 100;
    }
    if(this.props.order.isCancelled()) {
      color = colors.grey100;
    }
    return {
      color: color,
      value: 100 - value,
    };
  },

  _handleSwitchBtnClick(page,orderEntry) {
    if(!this._isOrderEntryChanged(orderEntry)) {
      if(this.state.page!==page) this.setState({page: page});
      return;
    }
    this.refs.confirm.show();
  },
});

module.exports = OrderEntryList;
