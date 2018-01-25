const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const MenuItem = require('epui-md/MenuItem');
const Paper = require('epui-md/Paper');
const PortFormHeader = require('./port-form-header');
const PropTypes = React.PropTypes;
const ThemeManager = require('~/src/styles/theme-manager');
const Translatable = require('epui-intl').mixin;

require('epui-intl/lib/locales/' + __LOCALE__);

const TABS = {
  GENERAL: 'GENERAL',
  TERMINAL: 'TERMINAL',
  ANCHORAGE: 'ANCHORAGE',
};

const PortData = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    children: PropTypes.element,
    style: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme),
    };
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      value: TABS.GENERAL,
    };
  },

  handleTouchTap() {
    let form = this.form;

    form.isValid().then(val => {
      console.log('isValid', val);
    });

    console.log(form.getValue());
  },

  handleChange(value) {
    this.setState({
      value,
    });
  },

  getStyles() {
    let styles = {
      root: {
        position: 'relative',
        margin: '20px auto',
        width: '1010px',
      },
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
      container: {
        width: '100%',
        height: '100%',
        overflow: 'auto',
      },
    };

    return styles;
  },

  render() {
    let { style } = this.props;
    let { value } = this.state;
    let styles = this.getStyles();

    return (
      <div style={styles.container}>
        <Paper style={Object.assign(styles.root, style)}>
          <PortFormHeader />
          {this.props.children}
        </Paper>
      </div>
    );
  },
});

module.exports = PortData;
