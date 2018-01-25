const AutoStyle = require('epui-auto-style').mixin;
const Order = require('./order');
const Paper = require('epui-md/Paper');
const React = require('react');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Translatable = require('epui-intl').mixin;
const ORDER_MODE = require('~/src/shared/constants').ORDER_MODE;

const Orders = React.createClass({
  mixins: [AutoStyle, PureRenderMixin],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    account: PropTypes.object,
    addOrderEntryToOrder: PropTypes.func,
    allProducts: PropTypes.any,
    costTypes: PropTypes.any,
    createOrder: PropTypes.func,
    fold: PropTypes.bool,
    fullHeight: PropTypes.number,
    onOrderFold: PropTypes.func,
    orders: PropTypes.object,
    segment: PropTypes.object,
    ship: PropTypes.object,
    user: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object,
    onFeedbackDialogOpen: PropTypes.func,
    fetchMe: PropTypes.func,
  },

  childContextTypes: {
    activeOrderId: PropTypes.string,
    setOnTop: PropTypes.func,
  },

  getDefaultProps() {
    return {
      orders: [],
    };
  },

  getInitialState() {
    return {
      activeOrderId: null,
      changed: false,
      zIndex: 3001,
    };
  },

  getChildContext() {
    return {
      activeOrderId: this.state.activeOrderId,
      setOnTop: this.setOnTop,
    };
  },

  componentDidMount() {
    global.notifyOrderDetailsChange = this.notifyOrderDetailsChange;
    global.isOrderDetailsChanged = this.isOrderDetailsChanged;
    if (_.isFunction(this.props.fetchMe)) {
      this.props.fetchMe();
    }
  },

  notifyOrderDetailsChange(changed, callback) {
    if(changed !== this.state.changed) this.setState({changed : changed},callback);
  },

  isOrderDetailsChanged() {
    return this.state.changed;
  },

  fold(flag) {
    let id = this.state.activeOrderId;
    if(!id) { return; }
    if(this.refs[id]) {
      this.refs[id].fold(flag);
    }
  },

  getStyles() {
    return {
      root: {
        background: 'transparent',
      },
      order: {},
      activeOrder: {},
    };
  },

  render() {
    let {
      addOrderEntryToOrder,
      allProducts,
      costTypes,
      fold,
      fullHeight,
      orders,
      segment,
      ship,
      user,
      params,
      location,
      ...other,
    } = this.props;

    if(!orders) { return null; }

    let activeOrderId = params.orderId;
    let elOrders = [];
    let account = user && user.getAccount();

    for(let o of orders) {
      let erId = o.consigner && o.consigner._id;
      let eeId = o.consignee && o.consignee._id;

      let mode =
        account._id === erId ? ORDER_MODE.CONSIGNER :
        account._id === eeId ? ORDER_MODE.CONSIGNEE :
        ORDER_MODE.VIEWER;

      elOrders.push(
        <Order
          {...other}
          ref={o._id}
          key={o._id}
          id={o._id}
          addOrderEntryToOrder={addOrderEntryToOrder}
          allProducts={allProducts}
          changed={this.state.changed}
          costTypes={costTypes}
          params = {params}
          location = {location}
          fullHeight={fullHeight}
          mode={mode}
          onFold={this._handleOrderFold}
          order={o}
          user={user}
          segment={segment}
          ship={ship}
          onTop={this.state.onTop}
          style={o._id === activeOrderId ? this.style('order', 'activeOrder') : this.style('order')}
        />
      );
    }

    return (
      <Paper
        zDepth={0}
        style={this.style('root')}
      >
        {elOrders}
      </Paper>
    );
  },

  _handleOrderFold(orderId, fold, offsetTop) {
    let fn = this.props.onOrderFold;
    if(_.isFunction(fn)) {
      fn(orderId, fold, offsetTop);
    }
  },

  setOnTop(orderId) {
    this.setState({onTop: orderId});
    // let { zIndex } = this.state;
    // let order = this.refs[orderId];
    // this.setState({zIndex: ++zIndex});
    // order.setOnTop(zIndex);
  },
});

module.exports = Orders;
