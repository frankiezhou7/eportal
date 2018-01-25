const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const MenuItem = require('epui-md/MenuItem');
const PropTypes = React.PropTypes;
const Tab = require('epui-md/Tabs/Tab');
const Tabs = require('epui-md/Tabs/Tabs');
const Translatable = require('epui-intl').mixin;

const TABS = {
  GENERAL: 'GENERAL',
  TERMINAL: 'TERMINAL',
  ANCHORAGE: 'ANCHORAGE',
};

const PortFormHeader = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    onChange: PropTypes.func,
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      value: TABS.GENERAL,
    };
  },

  handleChange(value) {
    this.setState({
      value,
    }, () => {
      let { onChange } = this.props;
      if (_.isFunction(onChange)) {
        onChange(value);
      }
    });
  },

  getStyles() {
    let styles = {
      root: {},
      inkBar: {
        backgroundColor: '#0277bd',
      },
      tab: {
        fontSize: '14px',
        color: '#0277bd',
      },
      tabItemContainer: {
        backgroundColor: 'white',
      },
    };

    return styles;
  },

  render() {
    let { style } = this.props;
    let { value } = this.state;
    let styles = this.getStyles();

    return (
      <Tabs
        key="tabs"
        ref={(ref) => this.tabs = ref}
        inkBarStyle={styles.inkBar}
        onChange={this.handleChange}
        tabItemContainerStyle={styles.tabItemContainer}
        value={value}
      >
        <Tab
          key="general"
          label="GENERAL INFORMATION"
          value={TABS.GENERAL}
          style={styles.tab}
        />
        <Tab
          key="terminal"
          label="TERMINAL"
          value={TABS.TERMINAL}
          style={styles.tab}
        />
        <Tab
          key="anchorage"
          label="ANCHORAGE"
          value={TABS.ANCHORAGE}
          style={styles.tab}
        />
      </Tabs>
    );
  },
});

module.exports = PortFormHeader;
