const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const IconButton = require('epui-md/IconButton');
const InsertDriveFileIcon = require('epui-md/svg-icons/editor/insert-drive-file');
const OrderEntryEventsHeader = require('./order-entry-events-header');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField');
const TextFieldDateTime = require('epui-md/TextField/TextFieldDateTime');
const TimeLine = require('epui-md/ep/TimeLine/TimeLine');
const Translatable = require('epui-intl').mixin;
const moment = require('moment');
const ACCOUNT_TYPES = require('~/src/shared/constants').ACCOUNT_TYPE;
const PORT_AGENCY_CODE = 'PTAGT';

const OrderEntryEvents = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/OrderEntryEvents/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    accountType: PropTypes.oneOf(_.values(ACCOUNT_TYPES)),
    eventItems: PropTypes.object,
    onUpdate: PropTypes.func,
    onReportTitleTouch: PropTypes.func,
    hasMore: PropTypes.bool,
    loading: PropTypes.bool,
    nTipsWhenNoEvents: PropTypes.string,
    products: PropTypes.array,
    location: PropTypes.object,
    onFetchMore: PropTypes.func,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    pubOrderEvent: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  // getInitialState() {
  //   let { eventItems } = this.props;
  //   let size = eventItems ? eventItems.size : 0;
  //
  //   return {
  //     size: size,
  //   };
  // },

  componentDidMount(){
    //this.props.eventItems = {};
    this.interval = setInterval(() => {
      this._handleTouchUpdate();
    }, 120000);
  },

  componentWillUnmount(){
    clearInterval(this.interval);
  },

  componentWillReceiveProps(nextProps) {
    // let loading = nextProps.loading;
    // let eventItems = nextProps.eventItems;
    // let size = eventItems ? eventItems.size : 0;
    //
    // if (loading) { return; }
    //
    // if (size - this.state.size === 1) {
    //   this.resetHeader();
    // }
    //
    // this.setState({
    //   size: size,
    // });
  },


  shouldComponentUpdate(nextProps, nextState){
    let orderEntry = this.props.orderEntry && this.props.orderEntry._id;
    let nextOrderEntry = nextProps.orderEntry && nextProps.orderEntry._id;
    if(orderEntry && nextOrderEntry && nextOrderEntry!==orderEntry) return false;
    return true;
  },


  // resetHeader() {
  //   let element = this.refs.header;
  //   if (element) { element.reset(); }
  // },

  getTheme() {
    return this.context.muiTheme;
  },

  getStyles() {
    let theme = this.getTheme();
    let palette = theme.palette;

    let styles = {
      root: {
        position: 'relative',
        padding: '20px 20px',
        width: '100%',
        height: '100%',
        minHeight: 500,
        boxSizing: 'border-box',
      },
      header: {
      },
      iconAdd: {
        width: '16px',
        height: '16px',
        marginRight: '13px',
        background: '#F5A623',
        fill: '#FFF',
        borderRadius: '50%',
      },
      span:{
        height: '16px',
        fontSize: '16px',
        lineHeight: '16px',
        display:'inline-block',
        position: 'relative',
        top: '-3px',
        userSelect: 'none',
      },
      updateButton: {
        textAlign: 'center',
        width: '100%',
        height: '16px',
        color: '#F5A623',
        cursor:'pointer',
        margin:'0 auto 40px auto',
      },
      TimeLine: {
        padding: '35px 20px 0px 20px',
        boxSizing: 'border-box',
      },
      row: {
        root: {
          marginBottom:'30px',
        },
        content: {
          fontSize: '14px',
          color: '#4A4A4A',
          letterSpacing: 0,
          lineHeight: '21px',
          position:'relative',
        },
        circle:{
          position:'absolute',
          backgroundColor: '#000',
          borderRadius: '50%',
          width: '7px',
          height: '7px',
          display: 'inline-block',
          top:'7px',
        },
        text:{
          display: 'block',
          marginLeft:'22px',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        },
        title: {
          fontSize: '16px',
          color: '#004588',
          letterSpacing: 0,
          textDecoration: 'underline',
          lineHeight: '16px',
          fontWeight: 500,
          marginBottom:'12px',
          cursor:'pointer',
        }
      }
    };

    return styles;
  },

  renderHeader(loading, accountType) {
    let isConsignee = accountType === ACCOUNT_TYPES.CONSIGNEE;

    let el = isConsignee ? (
      <OrderEntryEventsHeader
        ref="header"
        loading={loading}
        style={this.style('header')}
        onTouchTap={this._handleTouchTapHeader}
      />
    ) : null;

    return el;
  },

  renderTimeLine(events, hasMore, loading , shouldRenderTitle) {
    let theme = this.getTheme();
    let palette = theme.palette;
    let items = this._getItems(events, shouldRenderTitle);
    let url = require(`~/src/statics/${__LOCALE__}/css/bg-tml-spine.png`);

    return(
      <TimeLine
        backgroundColor={'#fafafa'}
        backgroundImgUrl={url}
        hasMore={hasMore}
        items={items}
        loading={loading}
        onFetchMore={this.props.onFetchMore}
        style={this.style('TimeLine')}
        tips={this.t('nTipsWhenNoEvents')}
        onCancelPublish={this._handleCancelPublish}
        labelRecall={this.t('nLabelRecall')}
      />
    );
  },

  renderContent(eventItems) {
    let products = this.props.products.toJS();
    let This = this;
    let items = eventItems && eventItems.toJS();
    if (!items) return null;
    items.sort((value1, value2) => {
      return value1 - value2
    });
    let mapItems = {};

    _.forEach(products,product=>{
        mapItems[product.name]=[];
    });

    _.forEach(items, item=>{
      if(_.has(item,['orderEntry','product','name'])){
        mapItems[item.orderEntry.product.name].push({
          orderEntry: item.orderEntry._id,
          description: item.description
        });
      }
    });

    let rows = [];
    _.forIn(mapItems, (value, key)=>{
      let contents = [];
      let orderEntry;
      if(value.length < 1) return;

      for(let v of value) {
        if(!orderEntry) orderEntry = v.orderEntry;
        contents.push(
          <div style={This.style('row.content')}>
            <i style={This.style('row.circle')} />
            <div style={This.style('row.text')}>
              {v.description}
            </div>
          </div>
        );
      }

      let titleStyle = this.style('row.title')
      if (key === 'Port Agency') {
        titleStyle = Object.assign({},titleStyle,{
          color: '#000',
          textDecoration: 'none',
        })
      }

      rows.push(
        <div
          style={This.style('row.root')}
        >
          <div
            style={titleStyle}
            onTouchTap = {this._handleReportTitleTouch.bind(this,orderEntry)}
          >
            {key}
          </div>
          {contents}
        </div>
      )
    });
    return (
      <div
        style={this.style('TimeLine')}
      >
        {rows}
      </div>
    );
  },

  render() {
    let {
      accountType,
      eventItems,
      hasMore,
      loading,
      orderEntry,
    } = this.props;

    const shouldRenderTitle = orderEntry.product.code === PORT_AGENCY_CODE;
    let content = shouldRenderTitle ? this.renderContent(eventItems) : this.renderTimeLine(eventItems, hasMore, loading, shouldRenderTitle);
    return (
      <div style={this.style('root')}>
        {this.renderHeader(loading, accountType)}
        {content}
      </div>
    );
  },

  _handleReportTitleTouch(orderEntryId){
    if(this.props.onReportTitleTouch){
      this.props.onReportTitleTouch(orderEntryId);
    }
  },

  _handleCancelPublish(id) {
    const {
      removeEventById,
    } = global.api.event;
    if(_.isFunction(removeEventById)) {
      removeEventById
      .promise(id, 0)
      .then(({ response }) => {
        // alert(this.t('nTextDeleteEventSuccess'));
        this._handleTouchUpdate();
      })
      .catch(err => {
        alert(this.t('nTextDeleteEventFail'));
      });
    }
  },

  _handleTouchUpdate() {
    let { onUpdate } = this.props;
    if(_.isFunction(onUpdate)) {
      onUpdate();
    }
  },

  _handleTouchTapHeader(value) {
    let {
      order,
      orderEntry,
      pubOrderEvent,
    } = this.props;

    let date = value && value.date;
    let description = value && value.value;
    let orderId = order && order._id;
    let orderEntryId = orderEntry && orderEntry._id;
    let type = 'report';  //TODO: 暂时把type写成report，后期需要处理
    if (_.isFunction(pubOrderEvent)) {
      pubOrderEvent(orderId, orderEntryId, type, '', date, description);
      this._handleTouchUpdate();
    }
  },

  _getTransformedObject(events, format) {
    let obj = {};

    if (_.isArray(events)) {
      events = _.reject(events, (event) => {
        return !event.date;
      });

      if (events.length) {
        obj = _.groupBy(events, (event, index) => {
          let date = event && event.date;
          return date && moment(date).format(format);
        });
      }
    }

    return obj;
  },

  _getItems(items, shouldRenderTitle) {
    let rawItems = items && items.toJS();
    let events = this._getTransformedObject(rawItems, 'YYYY');
    let eventsArray = [];
    let dateNow = moment(new Date());
    let isConsigner = this.props.accountType === ACCOUNT_TYPES.CONSIGNER;
    let eventsKeys = _.sortBy(_.keys(events), (key) => {
      return moment(key, 'YYYY');
    });

    if (_.isArray(eventsKeys)) {
      eventsKeys = eventsKeys.reverse();
    }
    _.forEach(eventsKeys, (key, index) => {
      let childrenArray = events[key];
      let children = this._getTransformedObject(childrenArray, 'YYYY-MM-DD');
      let array = [];

      let keys = _.sortBy(_.keys(children), (kk) => {
        return moment(kk, 'YYYY-MM-DD');
      });

      if (_.isArray(keys)) {
        keys = keys.reverse();
      }

      _.forEach(keys, (k, idx) => {
        let child = children[k];
        child = _.sortBy(child, (c) => {
          return c && c.date;
        });

        if (_.isArray(child)) {
          child = child.reverse();
          _.forEach(child, (c, i) => {
            let len = child.length;
            let description = c.description;
            let orderEntry = c.orderEntry;
            let date = c.date
            let dateCreate = c.dateCreate;
            let recallDate = null;
            let isBefore = false;
            let isAfter = false;
            let id = c._id;

            date = moment(date);
            recallDate = moment(dateCreate).add(5, 'minutes');
            isAfter = moment().isAfter(recallDate);
            if(isConsigner) { isAfter = true };
            let month = date.format('MM');
            let day = date.format('DD');
            let year = date.format('YYYY');
            let week = date.format('dddd');
            let time = date.format('HH:mm');
            isBefore = year === dateNow.format('YYYY') &&  month === dateNow.format('MM')&& day ===dateNow.format('DD');
            if (i === len - 1) {
              array.push({
                type: 'date',
                id: id,
                label: {
                  month: month,
                  day: day,
                  year: year,
                  isBefore: isBefore,
                  isAfter: isAfter,
                },
                isAfter: isAfter,
                titleContent: shouldRenderTitle ? orderEntry : null,
                fullContent: description,
                shortContent: {
                  week: week,
                  time: time,
                },
              });
            } else {
              array.push({
                type: 'time',
                id: id,
                label: time,
                isBefore: isBefore,
                isAfter: isAfter,
                titleContent: shouldRenderTitle ? orderEntry : null,
                fullContent: description,
              });
            }
          });
        }
      });

      eventsArray.push({
        type: 'title',
        label: key,
        foldable: true,
        initiallyOpen: true,
        children: array,
      });
    });

    return eventsArray;
  },
});

module.exports = OrderEntryEvents;
