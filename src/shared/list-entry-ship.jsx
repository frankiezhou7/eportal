const React = require('react');
const IconShip = require('epui-md/svg-icons/ep/ship');
const Translatable = require('epui-intl');
const AutoStylable = require('epui-auto-style');

const { PropTypes, Component } = React;

class ListEntryShip extends Component {
  static propTypes = {
    style: PropTypes.object,
    entry: PropTypes.object,
    showIcon: PropTypes.bool,
    onTouchTap: PropTypes.func,
  };

  static defaultProps = {
    showIcon: false,
  };

  getStyles() {
    const { style, showIcon } = this.props;

    return {
      root: style,
      icon: {
        fill: '#20B0D6',
        position: 'absolute',
        top: 12,
        left: 10,
      },
      body: {
        root: {
          position: 'absolute',
          left: showIcon ? 44 : 10,
          top: 8
        },
        secondary: {
          lineHeight: '12px',
          color: '#808080',
          fontSize: 12,
        }
      },
      name: {
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: '14px',
        width: 160,
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      type: {
        paddingRight: 5,
      }
    }
  }

  render() {
    let { entry, showIcon } = this.props;

    let elType = !entry.type ? null : (
      <span style={this.s('type')}>{this.t(`n${entry.type}`)}</span>
    );

    let elIcon = !showIcon ? null : (
      <IconShip style={this.s('icon')} />
    );

    return (
      <div style={this.s('root')} onTouchTap={this.props.onTouchTap}>
        {elIcon}
        <div style={this.s('body.root')}>
          <span style={this.s('name')}>{entry.name}</span>
          <div style={this.s('body.secondary')}>
            {elType}
            <span style={this.s('imo')}>IMO:{entry.imo}</span>
          </div>
        </div>
      </div>
    );
  }
};

module.exports = Translatable(AutoStylable(ListEntryShip), [ require('epui-intl/dist/ShipType/' + __LOCALE__) ]);
