const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Transitions = require('epui-md/styles/transitions');
const Translatable = require('epui-intl').mixin;

const EDGE_WIDTH = 2;
const EDGE_PATCH = 0;

const ListItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    icon: PropTypes.element,
    children: PropTypes.object,
    segment: PropTypes.object,
    disabled: PropTypes.bool,
    active: PropTypes.bool,
    isDepartured:  PropTypes.bool,
    closeWidth: PropTypes.number,
    edgeThroughIcon: PropTypes.bool,
    topEdgeType: PropTypes.oneOf(['dashed', 'solid']),
    bottomEdgeType: PropTypes.oneOf(['dashed', 'solid']),
    hasNext: PropTypes.bool,
    hasPrev: PropTypes.bool,
    height: PropTypes.number,
    hideIcon: PropTypes.bool,
    iconSize: PropTypes.number,
    open: PropTypes.bool,
    openWidth: PropTypes.number,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onTouchTap: PropTypes.func,
  },

  getDefaultProps() {
    return {
      disabled: false,
      active: false,
      isDepartured: false,
      closeWidth: 80,
      edgeThroughIcon: false,
      topEdgeType: 'solid',
      bottomEdgeType: 'solid',
      hasNext: false,
      hasPrev: false,
      height: 60,
      hideIcon: false,
      iconSize: 16,
      open: false,
      openWidth: 300,
    };
  },

  getInitialState: function() {
    return {
      hover: false
    };
  },

  getStyles() {
    let {
      disabled,
      active,
      isDepartured,
      closeWidth,
      edgeThroughIcon,
      topEdgeType,
      bottomEdgeType,
      hasNext,
      hasPrev,
      height,
      hideIcon,
      iconSize,
      open,
      openWidth,
    } = this.props;

    let {
      hover,
    } = this.state;

    let theme = this.context.muiTheme.segmentList;
    let palette = this.context.muiTheme.palette;

    let bgColor = active ? isDepartured ? palette.grey2Color : theme.activeColor : (!disabled && hover && open ? theme.hoverColor : theme.inactiveColor);
    let width = open ? openWidth : closeWidth;
    let contentWidth = openWidth - closeWidth;
    let edgeColor = active ? isDepartured ? palette.grey1Color: palette.accent5Color : theme.inactiveEdgeColor;
    let edgeLeft = (closeWidth - EDGE_WIDTH) / 2;
    let edgeBorder = EDGE_WIDTH / 2;
    let topEdgeLength = (height - iconSize) / 2 + EDGE_PATCH;
    let btmEdgeLength = topEdgeLength + (edgeThroughIcon ? iconSize : 0);
    let btmEdgeMargin = edgeThroughIcon ? 0 : iconSize;
    let topEdgeStyle = topEdgeType === 'dashed' ? 'dashed' : 'solid';
    let bottomEdgeStyle = bottomEdgeType === 'dashed' ? 'dashed' : 'solid';
    let iconTop = (height - iconSize) / 2;
    let iconLeft = (closeWidth - iconSize) / 2;

    return {
      root: {
        backgroundColor: bgColor,
        width: openWidth,
      	cursor: disabled ? 'default' : 'pointer',
        //transition: Transitions.easeOut(),
      },
      indicator: {
        width: closeWidth,
        height: height,
        position: 'relative',
      	verticalAlign: 'middle',
        display: 'inline-block',
      },
      icon: {
        opacity: hideIcon ? 0 : 1,
        width: iconSize,
        height: iconSize,
        position: 'absolute',
        top: iconTop,
        left: iconLeft,
        //transition: Transitions.easeOut()
      },
      edge: {
        root: {
          width: 0,
          position: 'absolute',
          left: edgeLeft,
        },
        top: {
          visibility: (hasPrev ? 'visible' : 'hidden'),
          marginTop: -1 * EDGE_PATCH,
          height: topEdgeLength,
          borderColor: edgeColor,
          borderStyle: topEdgeStyle,
          borderWidth: edgeBorder,
          boxSizing: 'border-box',
        },
        bottom: {
          visibility: (hasNext ? 'visible' : 'hidden'),
          marginTop: btmEdgeMargin,
          height: btmEdgeLength,
          borderColor: edgeColor,
          borderStyle: bottomEdgeStyle,
          borderWidth: edgeBorder,
          boxSizing: 'border-box',
        }
      },
      content: {
        width: contentWidth,
        height: height,
        //overflow: 'hidden',
        display: 'inline-block',
        verticalAlign: 'middle',
      }
    };
  },

  render() {
    let {
      icon,
      children
    } = this.props;

    return (
      <div
        style={this.style('root')}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
        onTouchTap={this._handleTouchTap} >
        <div style={this.style('indicator')}>
          <div style={this.style('edge.root')}>
            <div style={this.style('edge.top')}></div>
            <div style={this.style('edge.bottom')}></div>
          </div>
          <div style={this.style('icon')}>
            {icon}
          </div>
        </div>
        <div style={this.style('content')}>
          {children}
        </div>
      </div>
    );
  },

  _handleTouchTap(e) {
    if(this.props.disabled) { return; }
    let fn = this.props.onTouchTap;
    if(_.isFunction(fn)) {
      fn(e, this.props.segment);
    }
  },

  _handleMouseEnter(e) {
    if(this.props.disabled) { return; }
    this.setState({
      hover: true
    });
    let fn = this.props.onMouseEnter;
    if(_.isFunction(fn)) {
      fn(e);
    }
  },

  _handleMouseLeave(e) {
    if(this.props.disabled) { return; }
    this.setState({
      hover: false
    });
    let fn = this.props.onMouseLeave;
    if(_.isFunction(fn)) {
      fn(e);
    }
  },
});

module.exports = ListItem;
