const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PortForm = require('./port-general');
const TerminalForm = require('../terminal');
const Tab = require('epui-md/Tabs/Tab');
const Tabs = require('epui-md/Tabs/Tabs');
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;


const PortParticulars = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/PortParticulars/${__LOCALE__}`),

  propTypes: {
    nTextPort: PropTypes.string,
    nTextTerminal: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getStyles() {
    let styles = {
      root: {
        maxHeight: '100%',
        overflowY: 'scroll',
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    let selectedValue = this.state.selectedValue;

    let terminalForm = selectedValue === 'terminal' ?
                       (
                         <TerminalForm
                           {...this.props}
                         />
                       ) : null;

    return (
      <Tabs
        style={this.style('root')}
        onChange={this._handleChange}
      >
        <Tab
          label={this.t('nTextPort')}
          value="port"
        >
          <PortForm
            {...this.props}
          />
        </Tab>
        <Tab
          label={this.t('nTextTerminal')}
          value="terminal"
        >
          {terminalForm}
        </Tab>
      </Tabs>
    );
  },

  _handleChange(value, e, tab) {
    let selectedValue = this.state.selectedValue;

    if (!selectedValue && value === 'terminal') {
      this.setState({
        selectedValue: value,
      });
    }
  },

});

module.exports = PortParticulars;
