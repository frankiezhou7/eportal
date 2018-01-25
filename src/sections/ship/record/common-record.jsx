const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Translation = require('epui-intl').mixin;
const PropTypes = React.PropTypes;
const OrderRecord = require('./order-record');
const Moment = require('moment');
const format = 'DD/MMM/YYYY HH:mm';

const CommonRecord = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, Translation],

  translations: require(`epui-intl/dist/SegmentDetails/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    record : PropTypes.object,
    order : PropTypes.object,
    onTitleTouchTap:PropTypes.func,
    nLabelMessage: PropTypes.string,
    type : PropTypes.oneOf['report','service','message'],
  },

  getDefaultProps() {
    return {
      record:{},
      type: 'report',
      nLabelMessage: 'Message',
    };
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let styles = {
      root: {
        padding: 24,
      },
      record:{
        root:{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 15,
          color: '#4A4A4A',
          paddingBottom: 10,
          borderBottom: '1px solid #E8E8E8',
          marginTop: 10,
          alignItems: 'center',
        },
        title:{
          color: '#004588',
          fontWeight: 500,
          padding: '5px 4px 2px 6px',
          display: 'inline-block',
          textDecoration: 'underline',
          marginRight: 10,
          cursor: 'pointer',
        },
        message:{
          padding: '5px 4px 2px 6px',
          display: 'inline-block',
          marginRight: 10,
        },
        time:{
          display: 'inline-block',
          marginLeft: 10,
        },
        user:{
          display: 'inline-block',
          marginLeft: 10,
        },
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();
    let {record, type, order} = this.props;
    let orderEntry = _.find(order.orderEntries,entry=>entry._id == record.orderEntry);
    let show = type == 'message' ? true : _.has(orderEntry,['product','name']);
    return show ? (
      <div key = {record._id || 'message'} style = {this.style('record.root')}>
        <div style = {this.style('left')}>
          <div
            style = {this.style('record.title')}
            onTouchTap = {this._handleTitleTouchTap}
          >
            {type == 'message' ? this.t('nLabelMessage'): orderEntry.product.name}
          </div>
          <div style = {this.style('record.message')}>{record.message}</div>
        </div>
        <div style = {this.style('right')}>
          <div style = {this.style('record.time')}>{Moment(record.date).format(format)}</div>
          <div style = {this.style('record.user')}>{record.creator}</div>
        </div>
      </div>
    ):null;
  },

  _handleTitleTouchTap(){
    if(this.props.onTitleTouchTap) this.props.onTitleTouchTap(this.props.record);
  }

});

module.exports = CommonRecord;
