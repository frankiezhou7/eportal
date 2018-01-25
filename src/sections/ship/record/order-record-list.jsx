const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Translation = require('epui-intl').mixin;
const Loading = require('epui-md/ep/RefreshIndicator');
const PropTypes = React.PropTypes;
const OrderRecord = require('./order-record');
const FlatButton = require('epui-md/FlatButton');

const OrderRecordList = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, Translation],

  translations: [
    require(`epui-intl/dist/Orders/${__LOCALE__}`),
    require(`epui-intl/dist/Order/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    orders: PropTypes.object,
    segment: PropTypes.object,
    params : PropTypes.object,
    findOrdersByVoyageSegmentId: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let styles = {
      root: {},
      moreWrapper: {
        width: '100%',
        height: '40px',
        boxSizing: 'border-box',
        textAlign: 'center',
        marginTop: 10,
      },
      more: {
        marginRight: '24px',
        minWidth: '128px',
      },
      message:{

      }
    };

    return styles;
  },

  componentDidMount() {
    let { segment } = this.props;
    if(!segment) { return; }
    this.props.findOrdersByVoyageSegmentId(segment._id);
  },

  componentWillReceiveProps(nextProps) {
    let nextSeg = nextProps.segment;
    let segment = this.props.segment;
    if(!nextSeg || segment && segment._id === nextSeg._id) { return; }
    this.props.findOrdersByVoyageSegmentId(nextSeg._id);
  },

  render() {
    let styles = this.getStyles();
    let {
      orders,
      segment,
      params
    } = this.props;

    if(!segment) {return null; }
    if(!orders) { return null; }
    if(orders.getMeta('loading')) {
      return (
        <div style={this.style('info')}>
          <Loading />
        </div>
      );
    }

    const entries = orders.get('entries') && orders.get('entries').toJS();
    let orderRecords = entries ? _.map(entries,order=>{
      return <OrderRecord key ={order._id} order = {order} params = {params}/>
    }): null;

    const pagination = orders.get('pagination');
    const hasMore = pagination ? pagination.get('hasNext') : false;
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

    return (
      <div style={this.style('root')}>
        {orderRecords}
        {elLoadMore}
      </div>
    );
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
  },

});

module.exports = OrderRecordList;
