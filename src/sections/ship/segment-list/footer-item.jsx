const React = require('react');
const ReactDOM = require('react-dom');
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;
const ListItem = require('./list-item');
const IconMore = require('epui-md/svg-icons/notification/refresh');
const IconNoMore = require('epui-md/svg-icons/av/not-interested');
const Velocity = require('velocity-animate');
const PropTypes = React.PropTypes;

const FooterItem = React.createClass({

  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/SegmentList/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    active: PropTypes.bool,
    openWidth: PropTypes.number,
    closeWidth: PropTypes.number,
    height: PropTypes.number,
    open: PropTypes.bool,
    hasMore: PropTypes.bool,
    loading: PropTypes.bool,
    onTouchTap: PropTypes.func,
    nLabelNoMoreSegment: PropTypes.string,
    nLabelLoadMoreSegments: PropTypes.string,
    nLabelLoadingSegments: PropTypes.string,
  },

  getDefaultProps() {
    return {
      active: false,
      open: false,
    };
  },

  getInitialState: function() {
    return {};
  },

  componentDidMount() {
    this.animateIcon(this.props.loading);
  },

  componentWillReceiveProps(nextProps) {
    this.animateIcon(nextProps.loading);
  },

  getStyles() {
    let {
      active,
      height
    } = this.props;

    let theme = this.context.muiTheme.segmentList;

    return {
      icon: {
        width: '100%',
        height: '100%',
        fill: '#00599a' || this.context.muiTheme.palette.accent1Color,
      },
      circle: {
        // backgroundColor: theme.inactiveEdgeColor,
        borderRadius: '50%',
        boxSizing: 'border-box',
        marginTop: '-5%',
        marginLeft: '-25%',
        width: '150%',
        height: '150%',
      },
      wrapper: {
        width: '100%',
        height: '100%',
        textAlign: 'left'
      },
      message: {
        lineHeight: height + 'px',
        verticalAlign: 'middle',
        color: '#4990E2',
      }
    };
  },

  animateIcon(loading) {
    let node = ReactDOM.findDOMNode(this.icon); // eslint-disable-line react/no-find-dom-node

    if(!loading && this.__vlcIcon && node) {
      Velocity(node, 'finish');
      this.__vlcIcon = null;
      return;
    }

    if(!loading || this.__vlcIcon || !node) { return; }

    this.__vlcIcon = Velocity(node, {
      rotateZ: '3600deg'
    }, {
      duration: 30000
    });
  },

  renderIcon() {
    let styles = this.getStyles();

    let {
      hasMore,
      loading,
      open,
    } = this.props;

    let styCircle = this.mergeAndPrefix(styles.circle);
    let styIcon = this.mergeAndPrefix(styles.icon);

    if(loading || hasMore) {
      return (
        <div style={styCircle}>
          <IconMore
            ref={(ref) => this.icon = ref}
            style={styIcon}
          />
        </div>
      );
    }

    return null;
  },

  render() {
    let styles = this.getStyles();

    let {
      hasMore,
      openWidth,
      closeWidth,
      height,
      open,
    } = this.props;


    let styWrapper = this.mergeAndPrefix(styles.wrapper);
    let styMessage = this.mergeAndPrefix(styles.message);

    let message = hasMore ? this.t('nLabelLoadMoreSegments') : this.t('nLabelNoMoreSegment');

    return (
      <ListItem
        disabled={!hasMore}
        active={false}
        closeWidth={closeWidth}
        height={height}
        open={open}
        openWidth={openWidth}
        icon={this.renderIcon()}
        hideIcon={!open && !hasMore}
        onHover={this._handleHover}
        onTouchTap={this._handleTouchTap}
        hasPrev={hasMore}
        topEdgeType='dashed'
      >
        <div style={styWrapper}>
          <span style={styMessage}>{message}</span>
        </div>
      </ListItem>
    );
  },

  _handleTouchTap(e) {
    let fn = this.props.onTouchTap;
    if(_.isFunction(fn)) { fn(e); }
  }
});

module.exports = FooterItem;
