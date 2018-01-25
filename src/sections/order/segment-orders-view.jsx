const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const CreateOrderDialog = require('./create-order-dialog');
const CreateOrderForm = require('./create-order-form');
const FlatButton = require('epui-md/FlatButton');
const IconAdd = require('epui-md/svg-icons/content/add-order');
const IconButton = require('epui-md/IconButton');
const Loading = require('epui-md/ep/RefreshIndicator');
const Orders = require('./orders');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Translatable = require('epui-intl').mixin;
const SEGMENT_STATUS = require('~/src/shared/constants').SEGMENT_STATUS;
const SPECIAL_TYPE_CODE = 'OTOPA';

const SegmentOrdersView = React.createClass({
  mixins: [AutoStyle, PureRenderMixin, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  translations: [
    require(`epui-intl/dist/Orders/${__LOCALE__}`),
    require(`epui-intl/dist/Order/${__LOCALE__}`),
  ],

  propTypes: {
    account: PropTypes.object,
    allProducts: PropTypes.object,
    costTypes: PropTypes.object,
    createOrder: PropTypes.func,
    findOrdersByVoyageSegmentId: PropTypes.func,
    fold: PropTypes.bool,
    editable: PropTypes.bool,
    fullHeight: PropTypes.number,
    getCostTypes: PropTypes.func,
    getProducts: PropTypes.func,
    nLabelAddCargoQuantityTitle: PropTypes.string,
    onOrderFold: PropTypes.func,
    orders: PropTypes.object,
    segment: PropTypes.object,
    ship: PropTypes.object,
    user: PropTypes.object,
    products: PropTypes.object,
    subProducts: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object,
    getOffLandingArticleTypes: PropTypes.func,
    offLandingArticleTypes: PropTypes.object,
    onFeedbackDialogOpen: PropTypes.func,
    fetchMe: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      cursor: 10,
    };
  },

  componentDidMount() {
    this._getCostTypes();
    this._getAllProducts();

    let {
      getOffLandingArticleTypes,
      offLandingArticleTypes,
      segment,
      orders,
      user,
    } = this.props;

    if(!segment) { return; }

    let findOrder =true;

    if(orders && orders.get('entries') && orders.get('entries').size>0){
      let id = orders.get('entries').get(0).get('segment');
      if(id == segment._id) findOrder =false;
    }
    if(findOrder) this.props.findOrdersByVoyageSegmentId(segment._id);

    if(!offLandingArticleTypes || offLandingArticleTypes.size === 0) {
      if (_.isFunction(getOffLandingArticleTypes)) {
        getOffLandingArticleTypes();
      }
    }
    this.setState({isCreateOrder:_.get(user.getOrderPermission(),'createOrder')});
  },

  componentWillReceiveProps(nextProps) {
    let nextSeg = nextProps.segment;
    let segment = this.props.segment;

    if(nextProps.orders.count() - this.props.orders.count() === 1) {
      let order = nextProps.orders.toJS().entries[0];
      let portAgencyEntry = order.orderEntries[0];
      //this.updateProductConfig(order, portAgencyEntry, segment);
    }

    if(!nextSeg || segment._id === nextSeg._id) { return; }
    this.props.findOrdersByVoyageSegmentId(nextSeg._id);
  },

  componentWillUpdate(nextProps) {
    const orders = this.props.orders;
    const nextOrders = nextProps.orders;
    const params = this.props.params;
    const nextParams = nextProps.params;
    const entries = orders && orders.get('entries');
    const nextEntries = nextOrders && nextOrders.get('entries');
    const length = entries ? entries.count() : 0;
    const nextLength = nextEntries ? nextEntries.count() : 0;
    const pagination = nextOrders && nextOrders.get('pagination');
    const cursor = this.state.cursor;
    const nextCursor = pagination && pagination.toJS().cursor;
    let orderIds = [];
    if(params.voyageId !== nextParams.voyageId){
      this.setState({cursor: 10});
    }

    if(nextEntries && length !== nextLength ){
      let index = -1;
      for(let entry of nextEntries){
        index++;
        if(entry.status === 0 || entry.status === 999 || entry.status === 1000) { continue; }
        if(index >= nextCursor - cursor) {
          orderIds.push(entry._id);
        }
      };
      this.setState({cursor:nextCursor});
      if(orderIds.length > 0){
        if(_.isFunction(global.api.message.clearOrdersUnreadStatusByOrderIds)){
          global.api.message.clearOrdersUnreadStatusByOrderIds.promise(orderIds,'OPState')
          .then((res)=>{
            if(res.status === 'OK'){

            }
          })
          .catch((err)=>{
            console.log(this.t('nTextInitedFailed'));
          })
        }
      }
      orderIds = [];
    }
  },

  componentDidUpdate(){
    this.selectDefault();
  },

  selectDefault(){
    let orderId = this.props.params.orderId;
    let hasDefaultOrder = !_.isEmpty(orderId);
    if(hasDefaultOrder){
      let orders = this.props.orders;
      let entries = orders && orders.get('entries');
      const loading = orders && orders.getMeta('loading');
      if(loading) return;
      let found = _.find(entries.toJS(), {'_id':orderId});
      if(!found) this.loadMore();
    }
  },

  createOrder() {
    let dialog = this.refs.dialog;
    if(!dialog) { return; }
    dialog.show();
  },

  getStyles() {
    let theme = this.context.muiTheme;
    return {
      info: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '20px 0',
        textAlign: 'center',
      },
      addOrder: {
        wrapper: {
          width: '100%',
          boxSizing: 'border-box',
          paddingBottom: '15px',
          textAlign: 'center',
          backgroundColor: '#f0f0f0'
        },
        button: {
          height: '45px',
          padding: '4px 16px',
        },
        icon: {
          width: '16px',
          height: '16px',
          fill: theme.palette.accent1Color,
          verticalAlign: 'middle',
        },
        text: {
          paddingLeft: '6px',
          fontSize: '16px',
          verticalAlign: 'middle',
          color: theme.palette.accent1Color,
        },
      },
      moreWrapper: {
        width: '100%',
        height: '40px',
        boxSizing: 'border-box',
        textAlign: 'right',
      },
      more: {
        marginRight: '24px',
        minWidth: '128px',
      },
      message: {},
    };
  },

  renderForm() {
    let {
      account,
      orders,
      segment,
      ship,
      user,
    } = this.props;

    if(!account.isConsigner() || !this.state.isCreateOrder) { return; }

    return (
      <CreateOrderForm
        ref='form'
        ship={ship}
        segment={segment}
        orders={orders}
        user={user}
        account={account}
        createOrder={this._createOrder}
      />
    );
  },

  renderDialog(props) {
    let {
      account,
      segment,
      ship,
    } = props;
    if(!account.isConsigner() || !this.state.isCreateOrder) { return; }

    let elAdd = this.isDepartured() ? null : (
      <div style={this.style('addOrder.wrapper')}>
        <FlatButton
          style={this.style('addOrder.button')}
          backgroundColor='transparent'
          onTouchTap={this._handleAddOrder}
        >
          <IconAdd style={this.style('addOrder.icon')} />
          <span style={this.style('addOrder.text')}>
            {this.t('nTextAddOneMoreOrder')}
          </span>
        </FlatButton>
      </div>
    );

    return (
      <div>
        {elAdd}
        <CreateOrderDialog
          ref='dialog'
          account={props.account}
          createOrder={this._createOrder}
          orders={props.orders}
          segment={segment}
          ship={ship}
          user={props.user}
        />
      </div>
   );
  },

  render() {
    let styles = this.getStyles();

    let {
      fold,
      editable,
      fullHeight,
      orders,
      onOrderFold,
      segment,
      ship,
      fetchMe,
    } = this.props;

    if(!orders) { return null; }
    if(orders.getMeta('loading')) {
      return (
        <div style={this.style('info')}>
          <Loading />
        </div>
      );
    }

    const entries = orders.get('entries');
    const pagination = orders.get('pagination');
    const hasMore = pagination ? pagination.get('hasNext') : false;
    const hasOrder = entries ? entries.count() > 0 : false;
    const elOrders = hasOrder ? (
      <Orders
        {...this.props}
        ref='orders'
        fullHeight={fullHeight}
        onOrderFold={onOrderFold}
        orders={entries}
      />
    ) : null;

    const elLoadMore = hasMore ? (
      <div style={this.style('moreWrapper')}>
        <FlatButton
          style={this.style('more')}
          backgroundColor='transparent'
          onTouchTap={this._handleLoadMore}
        >
          <span style={this.style('message')}>
            {this.t('nTextLoadMoreOrders')}
          </span>
        </FlatButton>
      </div>
    ) : null;

    let elCreate = !hasOrder ? this.renderForm(this.props) : this.renderDialog(this.props);
    if(!elOrders && !elCreate) {
      return (
        <div style={this.style('info')}>
          {this.t('nTextNoOrdersFound')}
        </div>
      );
    }
    if(!editable) elCreate = null;

    return (
      <div>
        {elCreate}
        {elOrders}
        {elLoadMore}
      </div>
    );
  },

  _handleAddOrder() {
    this.createOrder();
  },

  _getCostTypes() {
    let {
      costTypes,
      getCostTypes,
    } = this.props;

    if (!costTypes || costTypes.size <= 0) {
      if (_.isFunction(getCostTypes)) {
        getCostTypes();
      }
    }
  },

  _getAllProducts() {
    let {
      allProducts,
      getProducts,
    } = this.props;

    if (!allProducts || allProducts.size <= 0) {
      if (_.isFunction(getProducts)) {
        getProducts();
      }
    }
  },

  _createOrder(order) {
    let { ship, segment } = this.props;

    //TODO: 获取ship.length.overall时可能因为immutablejs不支持length导致取不到值，需要再确认并修复
    let rawShip = ship && ship.toJS();

    if (!rawShip) { return; }

    let nrtIctm69 = rawShip.nrt && rawShip.nrt.ictm69;
    let grtIctm69 = rawShip.grt && rawShip.grt.ictm69;
    let nationality = rawShip.nationality && rawShip.nationality._id;
    let type = rawShip.type;
    let length = rawShip.length && rawShip.length.overall;
    let orderType = order.type;

    if ((nrtIctm69 && grtIctm69 && nationality && type && length && orderType !== SPECIAL_TYPE_CODE) ||
      (orderType === SPECIAL_TYPE_CODE && nationality && type)
    ) {
      let needCargoQuantityTypes = ['OTCL', 'OTCD', 'OTPCD', 'OTPCL'];
      let cargoQuantity = order.config && order.config.cargoQuantity ? order.config.cargoQuantity : undefined;
      if(_.includes(needCargoQuantityTypes, orderType) && !cargoQuantity) {
        let element = this.refs.dialog;
        if (element) { element.dismiss(); }
        let props = {
          title: this.t('nLabelAddCargoQuantityTitle'),
          open: true,
          modal: true,
        };
        let cargoQuantityEle = {
          name: 'CargoQuantityDialog',
          props: { order: order }
        };
        let globalDialog = global.register.dialog;
        if (globalDialog) { globalDialog.generate(props, cargoQuantityEle); }

      } else {
        this.props.createOrder(order);
      }
    } else {
      let element = this.refs.dialog;
      let globalAlert = global.alert;

      if (element) { element.dismiss(); }
      let content = this.t('nTextImproveShipInfo');
      let title = this.t('nTitleImproveShipInfo');
      let onConfirm = this._handleConfirm;
      if (globalAlert) { globalAlert(content, title, onConfirm); }
    }
  },

  _handleConfirm() {
    let { ship } = this.props;
    let shipId = ship && ship.get('_id');

    if (shipId) {
      let props = {
        title: this.t('nTitleUpdateShipInfo'),
        open: true,
      };

      let component = {
        name: 'ShipFormConnect',
        props: {
          shipId: shipId,
        },
      };

      if (global.register.dialog) {
        global.register.dialog.generate(props, component);
      }
    }
  },

  loadMore(){
    const {
      findOrdersByVoyageSegmentId,
      orders,
      segment,
    } = this.props;

    const id = segment && segment._id;
    const pagination = orders && orders.pagination;
    if(!pagination.get('hasNext')) { return; }
    if (_.isFunction(findOrdersByVoyageSegmentId)) {
      findOrdersByVoyageSegmentId(id, {
        cursor: pagination ? pagination.get('cursor') : 0,
      });
    }
  },

  _handleLoadMore() {
    this.loadMore();
    let {orderEntryId} = this.props.params;
    if(!_.isEmpty(orderEntryId)){
      let pathname = this.props.location.pathname;
      let paths = pathname.split('/');
      //get paths after removing id of orderId
      paths.length = 6;
      global.tools.toSubPath(paths.join('/'),true);
    }
  },

  isDepartured(){
    let segment = this.props.segment && this.props.segment.toJS();
    let isDepartured = false;
    if(segment && segment.status === SEGMENT_STATUS.CANCELED) {
      isDepartured = true;
      return isDepartured;
    }
    if(_.has(segment,['schedule','timePoints','departure','time'])){
      let departure = segment.schedule.timePoints.departure;
      if(!departure.estimated){
        let now = moment();
        if(now.isAfter(moment(departure.time))) isDepartured = true;
      }
    }
    return isDepartured;
  },

  updateProductConfig(order, orderEntry, segment) {
    let productConfig = orderEntry.productConfig;
    let costItemsEstimated = [];
    let costItems = [];

    costItemsEstimated = this._populateCostItems(orderEntry.costItemsEstimated);
    costItemsEstimated = _.filter(costItemsEstimated, item => {
      let selected = true;
      _.forEach(productConfig.products, product => {
        let productId = _.isString(product.product)
          ? product.product
          : product.product._id;
        if (item.product._id === productId) {
          selected = product.select;
        }
      });
      return item.isAdd && selected;
    });

    if (productConfig) {
      if (global.api.order.updateProductConfigForOrderAndCalculateOrderEntryFee) {
        global.api.order.updateProductConfigForOrderAndCalculateOrderEntryFee(
          order._id,
          orderEntry._id,
          segment.arrivalPort._id,
          order.__v,
          orderEntry.__v,
          order.type.code,
          productConfig,
          costItemsEstimated
        );
      }
    }
  },

  _populateCostItems(costItems){
    let types =  this.props.costTypes.toJS();
    let products = this.props.subProducts && this.props.subProducts.size >0 ?
                   this.props.subProducts.toJS(): (this.props.products ? this.props.products.toJS():null);
    if(!costItems || !types || !products) { return null; }
    let populateItems = _.map(costItems,costItem=>{
      let product =null;
      if(_.isString(costItem.costType)){
        costItem.costType =_.find(types,type => {
          return type._id == costItem.costType;
        });
      }
      _.forEach(products,pt=>{
        if(pt._id === costItem.product) costItem.product =pt;
      });
      return costItem;
    });
    return populateItems;
  },
});

module.exports = SegmentOrdersView;
