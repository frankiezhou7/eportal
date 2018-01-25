const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Translation = require('epui-intl').mixin;
const RaisedButton = require('epui-md/RaisedButton');
const PropTypes = React.PropTypes;
const Moment = require('moment');
const format = 'DD/MMM/YYYY HH:mm';

const OrderStatusItem = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, Translation],

  translations: require(`epui-intl/dist/Order/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    record : PropTypes.object,
    isActive: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      isActive: false,
      record:{}
    };
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let props = this.props;
    let rootStyle = {
      display: 'inline-block',
    }
    let statusStyle = {
      minWidth: 160,
    }
    if(props.style) {
      Object.assign(rootStyle, props.style);
    }
    if(props.statusStyle) {
      Object.assign(statusStyle, props.statusStyle);
    }

    let styles = {
      root: rootStyle,
      status:statusStyle,
      time: {
        marginTop: 5,
        fontSize: 14,
        color: '#9B9B9B'
      },
      user: {
        marginTop: 0,
      },
      label:{
        fontWeight: 500,
        fontSize: 15,
        color: this.props.isActive ? '#FFFFFF' : '#4A4A4A',
        marginLeft: 5,
        marginRight: 5,
      }
    };
    return styles;
  },

  render() {
    let record = this.props.record;
    return (
      <div style={this.style('root')}>
        <RaisedButton
          label={this.t(`nLabelOrderAction${record.data.state}`)}
          labelStyle = {this.style('label')}
          style={this.style('status')}
          capitalized = {'capitalized'}
          primary = {this.props.isActive}
          disabled = {!this.props.isActive}
        />
        <div style = {this.style('time')}>{Moment(record.date).format(format)}</div>
        <div style = {this.style('time','user')}>{record.creator}</div>
      </div>
    );
  },

});

module.exports = OrderStatusItem;
