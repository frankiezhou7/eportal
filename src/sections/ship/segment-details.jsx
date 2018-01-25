const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const IconReport = require('epui-md/svg-icons/content/report');
const Message = require('epui-md/svg-icons/ep/message');
const NotificationIcon = require('epui-md/svg-icons/notification/red-dot');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const SegmentOrders = require('./segment-orders');
const SegmentStatus = require('./segment-status');
const ResizeSensible = require('~/src/mixins/resize-sensible');
const ShipMixin = require('./mixins/ship');
const Translation = require('epui-intl').mixin;

const SPACING = 6;
const STATUS_HEIGHT = 96;
const STATUS_FOLD_HEIGHT = 46;

const SEGMENT_STATUS = require('~/src/shared/constants').SEGMENT_STATUS;

const SegmentDetails = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, ResizeSensible, Translation],

  translations: [
    require(`epui-intl/dist/SegmentDetails/${__LOCALE__}`),
    require(`epui-intl/dist/Global/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    ship: PropTypes.object,
    params: PropTypes.object,
    segment: PropTypes.object,
    style: PropTypes.object,
    updateTimingReportsBySegmentId: PropTypes.func,
    nTextNoSegmentSelected: PropTypes.string,
    refresh: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      fold: true,
      selectOrderID: this.props.params && this.props.params.orderId ? this.props.params.orderId : null,
      isUpdate: false,
      messageIds: [],
      orderId: '',
    };
  },

  componentDidUpdate(nextProps,nextState) {
    // let orderId = _.get(global.currentOrder && global.currentOrder.toJS(), '_id', '');
    // this.setState({orderId:orderId});
    // if(orderId !== this.state.orderId && orderId.length > 0){
    //   if(_.isFunction(global.api.message.getMessages)){
    //     global.api.message.getMessages.promise(orderId, 'feedback', false)
    //     .then((res)=>{
    //       if(res.status === 'OK'){
    //         let messageIds = [];
    //         _.forEach(res.response.data, message => {
    //           messageIds.push(message._id);
    //         });
    //         if(messageIds.length > 0){
    //           this.setState({messageIds, isUpdate:true});
    //         }
    //       }
    //     })
    //     .catch((err)=>{
    //       console.log(this.t('nTextInitedFailed'));
    //     })
    //   }
    // }
  },

  componentWillReceiveProps(nextProps) {
    let {
      ship,
      segment,
    } = this.props;

    let nextShip = nextProps.ship;
    let nextSeg = nextProps.segment;

    if(!nextSeg) { return; }

    if(segment !== nextSeg) {
      //fixer bug for record to voyage with same voyageId
      if(segment && segment._id == nextSeg._id) { return; }

      if(this.refs.orders) {
        this.refs.orders.fold(true);
      }
    }
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let style = this.props.style;
    let marginTop = this.state.fold ? STATUS_HEIGHT : STATUS_FOLD_HEIGHT;
    marginTop = marginTop + 9;

    let {
      rootHeight
    } = this.state;

    let styles = {
      root: style,
      noContent: {
        width: '100%',
        textAlign: 'center',
      },
      noContentIcon: {
        marginTop: '48px',
        width: '32px',
        height: '32px',
        fill: theme.palette.primary1Color,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      status:{
        position: 'absolute',
        marginBottom: '6px',
        marginLeft: '3px',
        zIndex: 15,
      },
      orders: {
        position: 'relative',
        marginTop: marginTop,
        height: `${rootHeight - marginTop}px`,
        boxSizing: 'border-box',
      },
      feedback: {
        cursor: 'pointer',
        position: 'absolute',
        boxSizing: 'border-box',
        background: '#FFF',
        right: 3,
        top: 0,
        width: '46px',
        height: '46px',
        boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
      },
      feedbackIcon: {
        fill: '#F5A623',
        width: '35px',
        height: '35px',
        margin: '5.5px'
      },
      dot: {
        right: 5,
        top: 6,
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();
    let {
      ship,
      segment,
      style,
    } = this.props;

    let { isUpdate, fold } = this.state;

    if(!segment) {
      return (
        <div style={this.style('noContent', 'root')}>
          <IconReport style={this.style('noContentIcon')} />
          {this.t('nTextNoSegmentSelected')}
        </div>
      );
    }
    let editable = segment.status !== SEGMENT_STATUS.CANCELED;

    let elFeedback = !this.state.fold ? (
      <div
        style={this.style('feedback')}
        onClick={this._handleClickFeedback}
        title={this.t('nLabelMessage')}
      >
        {isUpdate ? <NotificationIcon style={this.style('dot')}/> : null}
        <Message style={this.style('feedbackIcon')}/>
      </div>
    ) : null;

    let elOrders = (
      <SegmentOrders
        {...this.props}
        editable={editable}
        ref='orders'
        style={this.style('orders')}
        ship={ship}
        segment={segment}
        canCreateOrder={true}
        onOrderFold={this._handleOrderFold}
        onFeedbackDialogOpen={this._handleClickFeedback}
      />
    );

    return (
      <div style={this.style('root')}>
        <SegmentStatus
          {...this.props}
          editable={editable}
          fold={!this.state.fold}
          foldHeight={STATUS_FOLD_HEIGHT}
          segment={segment}
          ship={ship}
          style={this.style('status')}
        />
        {elOrders}
      </div>
    );
  },

  _handleClickFeedback() {
    const selectOrderID = this.state.selectOrderID;
    let props = {
      title: this.t('nTitleFeedback'),
      open: true,
      contentStyle: {
        width: '100%',
        maxWidth: '1005px',
      },
      modal: true,
    };

    let component = {
      name: 'FeedbackView',
      props: {
        selectOrderID: selectOrderID,
      },
    };
    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }

    // if(_.isFunction(global.api.message.clearUnreadStatusByIds)){
    //   global.api.message.clearUnreadStatusByIds.promise(this.state.messageIds)
    //   .then((res)=>{
    //     if(res.status === 'OK'){
    //       this.setState({isUpdate: false});
    //     }
    //   })
    //   .catch((err)=>{
    //     console.log(this.t('nTextInitedFailed'));
    //   })
    // }
  },

  _handleOrderFold(fold, orderId) {
    this.setState({
      fold: !!fold,
      selectOrderID: orderId,
    });
  },

});

module.exports = SegmentDetails;
