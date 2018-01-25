const React = require('react');
const IconButton = require('epui-md/IconButton');
const IconMenu = require('epui-md/IconMenu/IconMenu');
const MenuDivider = require('epui-md/Divider');
const MenuItem = require('epui-md/MenuItem');
const MoreVertIcon = require('epui-md/svg-icons/navigation/more-vert');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;

const HEADER_HEIGHT = 72;
const HEADER_PADDING = 12;
const HEADER_CONTENT_HEIGHT = HEADER_HEIGHT - 2 * HEADER_PADDING;
const EPCODE = 'EP';

const OrderHeader = React.createClass({
  mixins: [StylePropable, Translatable],

  translations: [
    require(`epui-intl/dist/Order/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    order: PropTypes.object,
    actions: PropTypes.array,
    errorText: PropTypes.string,
    infoText: PropTypes.string,
    onAction: PropTypes.func,
    primaryAction: PropTypes.string,
    secondaryAction: PropTypes.string,
    secondaryActionIcon: PropTypes.element,
    style: PropTypes.object,
    subtitle: PropTypes.string,
    flag: PropTypes.string,
    orderNumber: PropTypes.string,
    title: PropTypes.string,
    warningText: PropTypes.string,
    dateCreate: PropTypes.string,
    verifyStatus: PropTypes.number,
    subtitleStyle: PropTypes.bool,
  },

  getDefaultProps() {
    return {};
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let hasSubtitle = !!this.props.subtitle;

    return {
      root: {
        width: '100%',
        height: HEADER_HEIGHT,
        padding: '12px 12px 12px 20px',
        boxSizing: 'border-box',
        position: 'relative',
      },
      jump: {
        marginLeft: '10px',
        display: 'inline-block',
        color: theme.epColor.primaryColor,
        cursor: 'pointer',
      },
      left: {
        base: {
          height: HEADER_CONTENT_HEIGHT
        },
        title: {
          lineHeight: hasSubtitle ? `${HEADER_CONTENT_HEIGHT / 2}px` : `${HEADER_CONTENT_HEIGHT}px`,
          fontSize: 20,
          color: theme.palette.primary1Color
        },
        subtitle: {
          display: 'block',
          lineHeight: `${HEADER_CONTENT_HEIGHT / 2}px`,
          color: '#00599a',
          color: this.props.subtitleStyle ? '#00599a' : theme.palette.greyColor,
          fontWeight: 500,
        }
      },
      right: {
        base: {
          position: 'absolute',
          top: `${HEADER_PADDING}px`,
          right: `${HEADER_PADDING}px`,
          height: `${HEADER_CONTENT_HEIGHT}px`
        },
        status: {
          lineHeight: `${HEADER_CONTENT_HEIGHT}px`,
          verticalAlign: 'super',
          marginRight: `${HEADER_PADDING}px`
        },
        button: {
          display: 'inline-block',
          verticalAlign: 'super',
          marginRight: `${HEADER_PADDING}px`
        },
        menu: {},
        icon: {
          fill: 'rgb(245, 166, 35)'
        },
      }
    };
  },

  renderOrderNumber(){
    let { dateCreate, flag } = this.props;
    let date = dateCreate.replace(/\D+/g,'').substring(0,15);
    return EPCODE + flag + date;
  },

  renderOrderJump() {
    let { order } = this.props;
    let styles = this.getStyles();
    let items = [];
    if(order && order.parent) {
      items.push((
        <div
          style={styles.jump}
          onMouseDown={this._handleJumpOldOrder}
        >
          {this.t('nTextJumpToOldOrder')}
        </div>
      ))
    }
    if(order && order.child) {
      items.push((
        <div
          style={styles.jump}
          onMouseDown={this._handleJumpNewOrder}
        >
          {this.t('nTextJumpToNewOrder')}
        </div>
      ))
    }
    return items;
  },

  render() {
    let styles = this.getStyles();

    let {
      title,
      subtitle,
      orderNumber,
      style
    } = this.props;
    let textAndStyle = this._getStatusTextAndStyle();

    let styRoot = this.mergeAndPrefix(styles.root, style);
    let styLeft = this.mergeAndPrefix(styles.left.base);
    let styTitle = this.mergeAndPrefix(styles.left.title);
    let stySubtitle = this.mergeAndPrefix(styles.left.subtitle);
    let styRight = this.mergeAndPrefix(styles.right.base);


    let elSubtitle, elStatus, elButton, elMenu;

    elSubtitle = subtitle ? (
      <span style={stySubtitle}>{subtitle}</span>
    ) : null;

    elStatus = textAndStyle.text ? (
      <span style={this.mergeAndPrefix(styles.right.status, textAndStyle.style)}>{textAndStyle.text}</span>
    ) : null;

    return (
      <div style={styRoot}>
        <div style={styLeft}>
          <span style={styTitle}>{elSubtitle}</span>
          {this.t('nTextOrderNumber')}
          {orderNumber}
          {this.renderOrderJump()}
        </div>
        <div style={styRight}>
          {elStatus}
          {this.renderPrimaryActionButton()}
          {this.renderSecondaryButton()}
          {this.renderIconMenu()}
        </div>
      </div>
    );
  },

  renderPrimaryActionButton() {
    let {
      primaryAction,
      actions
    } = this.props;

    let action = _.find(actions, {key: primaryAction});
    if(!action) { return null; }

    let styles = this.getStyles();

    let styButton = this.mergeAndPrefix(styles.right.button);

    return (
      <div style={styButton}>
        <RaisedButton
          zDepth={1}
          primary={true}
          label={action.primaryText}
          capitalized={'capitalize'}
          onTouchTap={ () => this._handleAction(action) }
          disabled = { this.props.verifyStatus !== 1 }
        />
      </div>
    );
  },

  renderSecondaryButton() {
    let {
      actions,
      secondaryActionIcon,
      secondaryAction,
    } = this.props;

    let action = _.find(actions, {key: secondaryAction});

    if(!action) { return null; }

    if(!secondaryActionIcon) {
      let styles = this.getStyles();
      let styButton = this.mergeAndPrefix(styles.right.button);

      return (
        <div style={styButton}>
          <RaisedButton
            zDepth={0}
            // secondary={true}
            label={action.primaryText}
            onTouchTap={() => {
              this._handleAction(action);
            }}
          />
        </div>
      );
    }

    return (
      <IconButton
        tooltip={action.primaryText}
        onTouchTap={() => {
          this._handleAction(action);
        }}
      >
        {secondaryActionIcon}
      </IconButton>
    );
  },

  renderIconMenu() {
    let actions = this.props.actions;
    if(!actions || actions.length <= 0) { return null; }

    let styles = this.getStyles();
    let styMenu = this.mergeAndPrefix(styles.right.menu);
    let styIcon = this.mergeAndPrefix(styles.right.icon);

    let divCount = 0;
    let menuItems = _.map(actions, (action) => {
      if(action === 'divider') {
        return <MenuDivider key={'_divider' + divCount++} />;
      }
      var disableOpt = false
      if (action.key === 'confirmOrder' && this.props.verifyStatus !== 1) {
        disableOpt = true
      }
      return (
        <MenuItem
          {...action}
          disabled={ disableOpt }
        />
      );
    });

    let elIcon = (
      <IconButton><MoreVertIcon /></IconButton>
    );

    return (
      <IconMenu
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        iconButtonElement={elIcon}
        onItemTouchTap={(e, action) => {
          this._handleAction(action);
        }}
        style={styMenu}
        iconStyle={styIcon}
      >
        {menuItems}
      </IconMenu>
    );
  },

  _handleAction(action) {
    if(!global.currentOrder || global.currentOrder._id != this.props.order._id){
      global.currentOrder = this.props.order;
    }
    let fn = this.props.onAction;
    if(_.isFunction(fn)) {
      fn(action);
    }
  },

  _handleJumpOldOrder() {
    let { order } = this.props;
    let ship = order && order.ship;
    let parent = order && order.parent;
    parent = parent && parent.toJS();
    global.currentOrder = parent;
    if(ship && parent && parent.segment) {
      global.tools.toSubPath(`/ship/${ship}/voyage/${parent.segment}`);
    }
  },

  _handleJumpNewOrder() {
    let { order } = this.props;
    let ship = order && order.ship;
    let child = order && order.child;
    child = child && child.toJS();
    global.currentOrder = child;
    if(ship && child && child.segment) {
      global.tools.toSubPath(`/ship/${ship}/voyage/${child.segment}`);
    }
  },

  _getStatusTextAndStyle() {
    let {
      errorText,
      infoText,
      warningText
    } = this.props;

    let theme = this.context.muiTheme;
    let text = null, style = null;

    if(errorText) {
      text = errorText;
      style = {
        color: theme.palette.errorColor,
        fontWeight: 'bold'
      };
    } else if (warningText) {
      text = warningText;
      style = {
        color: theme.palette.warningColor,
        fontWeight: 'bold'
      };
    } else {
      text = infoText;
      style = {
        color: '#00599a' || theme.palette.infoColor
      };
    }

    return {
      text: text,
      style: style
    };
  },
});

module.exports = OrderHeader;
