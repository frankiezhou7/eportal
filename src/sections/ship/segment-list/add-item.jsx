const React = require('react');
const IconAdd = require('epui-md/svg-icons/content/add-circle');
const ListItem = require('./list-item');
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;

const AddItem = React.createClass({
  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/SegmentList/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    active: PropTypes.bool,
    openWidth: PropTypes.number,
    closeWidth: PropTypes.number,
    height: PropTypes.number,
    open: PropTypes.bool,
    showEdge: PropTypes.bool,
    nButtonAddSegment: PropTypes.string,
    onTouchTap: PropTypes.func,
  },

  getDefaultProps() {
    return {
      active: false,
      open: false,
      showEdge: false,
    };
  },

  getStyles() {
    let {
      active,
      height,
    } = this.props;

    let theme = this.context.muiTheme.segmentList;

    return {
      icon: {
        fill: active ? '#f5a623' || theme.inactiveColor : '#f5a623' || theme.activeColor,
        marginTop: '-10%',
        marginLeft: '-10%',
        width: '120%',
        height: '120%',
      },
      wrapper: {
        width: '100%',
        height: '100%',
        textAlign: 'left'
      },
      message: {
        lineHeight: height + 'px',
        verticalAlign: 'middle'
      }
    };
  },

  renderIcon() {
    let styles = this.getStyles();

    let styIcon = this.mergeAndPrefix(styles.icon);

    return (
      <IconAdd style={styIcon} />
    )
  },

  render() {
    let styles = this.getStyles();

    let {
      active,
      closeWidth,
      height,
      open,
      openWidth,
      showEdge,
    } = this.props;

    let styWrapper = this.mergeAndPrefix(styles.wrapper);
    let styMessage = this.mergeAndPrefix(styles.message);

    return (
      <ListItem
        active={active}
        closeWidth={closeWidth}
        height={height}
        open={open}
        openWidth={openWidth}
        icon={this.renderIcon()}
        hideIcon={false}
        onTouchTap={this._handleTouchTap}
        hasPrev={false}
        hasNext={showEdge}
        bottomEdgeType='dashed'
      >
        <div style={styWrapper}>
          <span style={styMessage}>{this.t('nButtonAddSegment')}</span>
        </div>
      </ListItem>
    );
  },

  _handleTouchTap() {
    let fn = this.props.onTouchTap;
    if(_.isFunction(fn)) {
      fn();
    }
  },
});

module.exports = AddItem;
