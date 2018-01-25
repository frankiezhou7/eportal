const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Card = require('epui-md/Card/Card');
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const DashboardCardButton = React.createClass({

  mixins: [AutoStyle, Translatable],

  contextTypes: {
  	muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    onTouchTap: PropTypes.func,
    title: PropTypes.string,
    icon: PropTypes.element,
    iconColor: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      hover: false,
    };
  },

  getStyles() {
    let { style, iconColor } = this.props;
    let { hover } = this.state;

    iconColor = iconColor || '#f2b754';

    let styles = {
      root: {
        position: 'relative',
        display: 'inline-block',
        width: '270px',
        height: '150px',
        overflow: 'hidden',
        cursor: 'pointer',
        verticalAlign: 'middle',
        transition:'none',
      },
      icon: {
        margin: 'auto',
        width: '40px',
        height: '40px',
        fill: iconColor,
      },
      iconWrapper: {
        margin: '55px auto',
        width: '40px',
        height: '40px',
        overflow: 'hidden',
      },
      title: {
        position: 'absolute',
        padding: '16px',
        paddingBottom: '0px',
        top: '0px',
        left: '0px',
        width: '100%',
        color: '#000',
        fontSize: '14px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        wordBreak: 'keep-all',
      },
    };

    styles.root = _.merge(styles.root, style);

    return styles;
  },

  render() {
    let styles = this.getStyles();
    let { hover } = this.state;
    let { title, icon } = this.props;
    let zDepth = hover ? 2 : 1;

    icon = React.cloneElement(icon, { style: this.s('icon') });

    return (
      <Card
        ref='root'
        style={this.s('root')}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
        onTouchTap={this._handleTouchTap}
        zDepth={zDepth}
      >
        <div style={this.s('title')}>{title}</div>
        <div style={this.s('iconWrapper')}>
          {icon}
        </div>
      </Card>
    );
  },

  _handleMouseEnter() {
    this.setState({
      hover: true,
    });
  },

  _handleMouseLeave() {
    this.setState({
      hover: false,
    });
  },

  _handleTouchTap() {
    let fn = this.props.onTouchTap;
    if (_.isFunction(fn)) {
      fn();
    }
  },

});

module.exports = DashboardCardButton;
