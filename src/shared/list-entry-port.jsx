const React = require('react');
const IconPort = require('epui-md/svg-icons/ep/port');
const AutoStylable = require('epui-auto-style');

const { PropTypes, Component } = React;

class ListEntryPort extends Component {
  static propTypes = {
    style: PropTypes.object,
    showIcon: PropTypes.bool,
    entry: PropTypes.object,
    countries: PropTypes.any,
    onTouchTap: PropTypes.func,
  };

  static defaultProps = {
    showIcon: false,
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  getStyles() {
    const { style, showIcon } = this.props;
    let theme = this.context.muiTheme;
    return {
      root: style,
      icon: {
        fill: theme.epColor.portColor,
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
      country: {
        paddingRight: 5,
      }
    }
  }

  render() {
    let { entry, showIcon, countries } = this.props;

    let elCountry = null;

    if(entry.country && countries) {
      let c = countries.find(c => c._id === entry.country);
      elCountry = !c ? null : (<span style={this.s('country')}>{c.name.toUpperCase()}</span>);
    }

    let elIcon = !showIcon ? null : (
      <IconPort style={this.s('icon')} />
    );

    return (
      <div style={this.s('root')} onTouchTap={this.props.onTouchTap}>
        {elIcon}
        <div style={this.s('body.root')}>
          <span style={this.s('name')}>{entry.name}</span>
          <div style={this.s('body.secondary')}>
            {elCountry}
          </div>
        </div>
      </div>
    );
  }
};

module.exports = AutoStylable(ListEntryPort);
