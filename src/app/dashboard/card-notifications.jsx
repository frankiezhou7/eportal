const React = require('react');
const _ = require('eplodash');
const Message = require('epui-md/svg-icons/notification/message');
const Schedule = require('epui-md/svg-icons/notification/schedule');
const Product = require('epui-md/svg-icons/notification/rotated-square');
const Report = require('epui-md/svg-icons/notification/fold-file');
const OrderState = require('epui-md/svg-icons/notification/triangle');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const CardNotifications = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Dashboard/${__LOCALE__}`),
    require(`epui-intl/dist/Notification/${__LOCALE__}`),
  ],

  contextTypes: {
  	muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    status: PropTypes.array,
    isFinished: PropTypes.bool,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {

    };
  },

  componentWillMount() {
    const { status } = this.props;
    //* The 5 elements stands for type:
    // *  1: Voyage Changed, include ETA, ETB, ETD change, ETA -> ATA, ...
    // *  2: Order Operation Stage changed
    // *  3: Order FeedBack changed
    // *  4: Order Log updated
    // *  5: Order content changed
    this.setState({
      status:{
        schedule: status && status[0],
        message: status && status[2],
        report: status && status[3],
        orderState: status && status[1],
        product: status && status[4],
      }
    });
  },

  getTheme() {
    return this.context.muiTheme;
  },

  getStyles() {
    let { style, isFinished } = this.props;
    let styles = {
      root: {
        display: 'flex',
        width: '135px',
      },
      icon: {
        fill: isFinished ? '#9B9B9B' : '#e44d3c',
        width: 15,
        height: 15,
        marginRight: 12,
      }
    };

    styles.root = _.merge(styles.root, style);

    return styles;
  },

  renderNotification(type){
    let { status } = this.state;
    let iconStatus = status && status[type];
    switch(type){
      case 'schedule':
        return iconStatus ? (
          <div title={this.t('nLabelVesselScheduleUpdate')}>
            <Schedule style={this.style('icon')}/>
          </div>
        ) : null;
      break;
      case 'message':
        return iconStatus ? (
          <div title={this.t('nLabelMessageUpdate')}>
            <Message style={this.style('icon')}/>
          </div>
        ) : null;
      break;
      case 'report':
        return iconStatus ? (
          <div title={this.t('nLabelReportUpdate')}>
            <Report style={this.style('icon')}/>
          </div>
        ) : null;
      break;
      case 'orderState':
        return iconStatus ? (
          <div title={this.t('nLabelOrderStatusUpdate')}>
            <OrderState style={this.style('icon')}/>
          </div>
        ) : null;
      break;
      case 'product':
        return iconStatus ? (
          <div title={this.t('nLabelServiceUpdate')}>
            <Product style={this.style('icon')}/>
          </div>
        ) : null;
      break;
      default:
      break;
    }
  },

  render() {
    return (
      <div
        style={this.style('root')}
      >
        {this.renderNotification('schedule')}
        {this.renderNotification('message')}
        {this.renderNotification('report')}
        {this.renderNotification('orderState')}
        {this.renderNotification('product')}
      </div>
    );
  },
});

module.exports = CardNotifications;
