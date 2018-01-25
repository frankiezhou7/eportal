let React = require('react');
let PropTypes = React.PropTypes;
let StylePropable = require('~/src/mixins/style-propable');
let _ = require('eplodash');
let TouchRipple = require('epui-md/ripples/touch-ripple');

const ITEM_WIDTH = 88;
const ITEM_HEIGHT = 108;


let component = React.createClass({
  mixins: [StylePropable],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    entry: PropTypes.object.isRequired,
    iconElement: PropTypes.element,
    iconClass: PropTypes.object, // 使用iconElement或iconClass进行填充
    iconColor: PropTypes.string,
    iconBackgroundColor: PropTypes.string,
    disabled: PropTypes.bool,
    onTouchTap: PropTypes.func
  },

  getDefaultProps() {
    let theme = this.context.muiTheme;
    let palette = theme.palette;
    let colors = theme.colors;
    return {
      iconColor: colors.white,
      iconBackgroundColor: palette.primary1Color,
      disabled: false
    };
  },

  getStyles() {
    return {
      wrapper: {
        position: 'relative',
        display: 'block',
        width: `${ITEM_WIDTH}px`,
        height: `${ITEM_HEIGHT}px`,
        textAlign: 'center'
      },
      root: {
        position: 'relative',
        display: 'block',
        width: `${ITEM_WIDTH}px`,
        height: `${ITEM_HEIGHT}px`,
        cursor: 'pointer',
        overflow: 'hidden',
        boxSizing: 'border-box',
        paddingTop: '20px'
      },
      iconWrapper: {
        display: 'inline-block',
        margin: '0 auto',
        width: '48px',
        height: '48px',
        backgroundColor: this.props.iconBackgroundColor,
        borderRadius: '50%'
      },
      icon: {
        position: 'absolute',
        top: '0px',
        left: '24px',
        margin: '4px auto',
        width: '40px',
        height: '40px',
        fill: this.props.iconColor
      },
      name: {
        position: 'relative',
        width: `${ITEM_WIDTH}px`,
        height: '17px',
        top: '7px',
        textAlign: 'center',
        fontSize: '12px'
      }
    };
  },

  render() {
    let styles = this.getStyles();
    let entry = this.props.entry;

    let styItemWrapper = this.mergeAndPrefix(styles.wrapper);
    let styItem = this.mergeAndPrefix(styles.root);
    let styIconWrapper = this.mergeAndPrefix(styls.iconWrapper);
    let styIcon = this.mergeAndPrefix(styles.icon);
    let styName = this.mergeAndPrefix(styles.name);

    let iconEl = this.props.iconElement ? this.props.iconElement : (
      <this.props.iconClass style={styleIcon} />
    );

    let name = entry.name;

    return (
      <div
        style={styItemWrapper}
        onTouchTap={this._handleTouchTap}>
        <div style={styItem}>
          <div style={styIconWrapper}>
            <TouchRipple>
              {iconEl}
            </TouchRipple>
          </div>
          <div style={styName}>{name}</div>
        </div>
      </div>
    );
  },

  _handleTouchTap() {
    if(_.isFunction(this.props.onTouchTap)) {
      this.props.onTouchTap(this.props.entry);
    }
  }
});

module.exports = component;
