const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const OrderEntryEvents = require('./order-entry-events');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const PAGE_SIZE = 50;
const PAGE_SORT = {
  'date': -1,
};
const ACCOUNT_TYPES = require('~/src/shared/constants').ACCOUNT_TYPE;
const PORT_AGENCY_CODE = 'PTAGT';

const OrderEntryEventsView = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    accountType: PropTypes.oneOf(_.values(ACCOUNT_TYPES)),
    eventItems: PropTypes.object,
    findOrderEvents: PropTypes.func,
    ship: PropTypes.object,
    segment: PropTypes.object,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    orderEntryEvents: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  componentWillMount() {
    let {
      findOrderEvents,
      order,
      orderEntry,
    } = this.props;
    let orderId = order && order._id;
    let orderEntryId = orderEntry && orderEntry._id;
    if(orderId && orderEntryId) {
      let pagination;
      if(orderEntry.product.code === PORT_AGENCY_CODE) {
        pagination = {
         query: {
           order: order._id,
         },
         size: PAGE_SIZE,
         sortby: PAGE_SORT,
       };
      }else {
        pagination = {
         query: {
           order: order._id,
           orderEntry: orderEntry._id,
         },
         size: PAGE_SIZE,
         sortby: PAGE_SORT,
       };
      }
      if (_.isFunction(findOrderEvents)) {
        findOrderEvents(pagination);
      }
    }
  },

  componentWillReceiveProps(nextProps) {
    let order = nextProps.order;
    let orderEntry = nextProps.orderEntry;
    let {
      findOrderEvents,
    } = this.props;

    if (order._id !== this.props.order._id || orderEntry._id !== this.props.orderEntry._id) {
      let pagination;
      if(orderEntry.product.code === PORT_AGENCY_CODE) {
        pagination = {
         query: {
           order: order._id,
         },
         size: PAGE_SIZE,
         sortby: PAGE_SORT,
       };
      }else {
        pagination = {
         query: {
           order: order._id,
           orderEntry: orderEntry._id,
         },
         size: PAGE_SIZE,
         sortby: PAGE_SORT,
       };
      }

      if (_.isFunction(findOrderEvents)) {
        findOrderEvents(pagination);
      }
      // let element = this.events;
      // if (element) {
      //   element.resetHeader();
      // }
    }
  },

  onUpdate() {
    let {
      findOrderEvents,
      order,
      orderEntry,
    } = this.props;
    let orderId = order && order._id;
    let orderEntryId = orderEntry && orderEntry._id;
    if(orderId && orderEntryId) {
      let pagination;
      if(orderEntry.product.code === PORT_AGENCY_CODE) {
        pagination = {
         query: {
           order: order._id,
         },
         size: PAGE_SIZE,
         sortby: PAGE_SORT,
       };
      }else {
        pagination = {
         query: {
           order: order._id,
           orderEntry: orderEntry._id,
         },
         size: PAGE_SIZE,
         sortby: PAGE_SORT,
       };
      }
      if (_.isFunction(findOrderEvents)) {
        findOrderEvents(pagination);
      }
    }
  },

  getStyles() {
    return {};
  },

  getValue() {
    return this.events.getValue();
  },

  render() {
    let { eventItems } = this.props;
    return (
      <OrderEntryEvents
        {...this.props}
        ref={(ref) => this.events = ref}
        eventItems={eventItems && eventItems.get('entries')}
        loading={this._isLoading()}
        hasMore={this._hasMore()}
        onFetchMore={this._handleFetchMore}
        onUpdate={this.onUpdate}
      />
    );
  },

  _isLoading() {
    let events = this.props.eventItems;
    let loading = !!(events && events.getMeta('loading'));
    return loading;
  },

  _hasMore() {
    let events = this.props.eventItems;
    let pagination = events && events.get('pagination');
    let hasNext = pagination && pagination.get('hasNext');

    return !!hasNext;
  },

  _handleFetchMore() {
    let {
      findOrderEvents,
      order,
      orderEntry,
      eventItems,
    } = this.props;
    let pagination = eventItems && eventItems.get('pagination');
    if (!pagination) { return; }
    let cursor = pagination.get('cursor');
    if (!cursor) { return; }

    let newPagination;
    if(orderEntry.product.code === PORT_AGENCY_CODE) {
      newPagination = {
       query: {
         order: order._id,
       },
       size: PAGE_SIZE,
       sortby: PAGE_SORT,
       cursor: cursor,
     };
    }else {
      newPagination = {
       query: {
         order: order._id,
         orderEntry: orderEntry._id,
       },
       size: PAGE_SIZE,
       sortby: PAGE_SORT,
       cursor: cursor,
     };
    }

    if (_.isFunction(findOrderEvents)) {
      findOrderEvents(newPagination);
    }
  },
});

const {
  findOrderEvents,
  pubOrderEvent,
} = global.api.event;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      eventItems: state.getIn(['event', 'orderEntryEvents']),
      findOrderEvents,
      pubOrderEvent,
    };
  }
)(OrderEntryEventsView);
