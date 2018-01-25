const React = require('react');
const IconShip = require('epui-md/svg-icons/ep/ship');
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const { PropTypes, Component } = React;

const ListEntryShip = React.createClass({

  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/ShipType/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    entry: PropTypes.object,
    showIcon: PropTypes.bool,
    onTouchTap: PropTypes.func,
  },

  getDefaultProps() {
    return {
      showIcon: false,
    };
  },

  getInitialState: function() {
    return {
      hover: false,
    };
  },

  getStyles() {
    const { showIcon } = this.props;
    const { hover } = this.state;
    let styles = {
      root: {
        width: 760,
        height: 48,
        backgroundColor: hover ? '#f9dbaa' : '#fff',
      },
      icon: {
        fill: '#FF00AA',
        position: 'absolute',
        top: 12,
        left: 10,
      },
      body: {
        root: {
          position: 'absolute',
          left: showIcon ? 44 : 17,
          width: 760,
          height: 48,
        },
        // secondary: {
        //   lineHeight: '12px',
        //   color: '#808080',
        //   fontSize: 12,
        // }
      },
      name: {
        fontSize: 14,
        lineHeight: '48px',
        width: 700,
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      type: {
        paddingRight: 5,
      }
    };

    return styles;
  },

  render() {
    let { entry, showIcon } = this.props;
    let styles = this.getStyles();

    let elType = !entry.type ? null : (
      <span style={styles.type}>{this.t(`n${entry.type}`)}</span>
    );

    let elIcon = !showIcon ? null : (
      <IconShip style={styles.icon} />
    );

    return (
      <div style={styles.root}
        onTouchTap={this.props.onTouchTap}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
      >
        {elIcon}
        <div style={styles.body.root}>
          <span style={styles.name}>{`${entry.name} - ${entry.imo}`}</span>
          {/* <div style={styles.body.secondary}>
            {elType}
            <span style={styles.imo}>IMO:{entry.imo}</span>
          </div> */}
        </div>
      </div>
    );
  },

  _handleMouseEnter(e) {
    this.setState({hover:true});
  },

  _handleMouseLeave(e) {
    this.setState({hover:false});
  },
});

module.exports = ListEntryShip;
