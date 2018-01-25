const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const PropTypes = React.PropTypes;
const RegisterForm = require('./registerForm');
const ScreenMixin = require('~/src/mixins/screen');
const ThemeManager = require('~/src/styles/theme-manager');
const Translatable = require('epui-intl').mixin;

require('epui-intl/lib/locales/' + __LOCALE__);

const RegisterScreen = React.createClass({
  mixins: [AutoStyle, ScreenMixin, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/Register/${__LOCALE__}`),
  ],

  propTypes: {},

  contextTypes: {
    muiTheme: PropTypes.object,
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
    return {};
  },

  componentDidMount() {
    this.setPageTitle(this.t('nPageTitleRegister'));
  },

  getStyles() {
    let styles = {
      root: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        minWidth: '320px',
        minHeight: '450px',
        backgroundImage: 'url(' + require(`~/src/statics/${__LOCALE__}/css/bg.png`) + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        overflow: 'auto',
      },
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    return (
      <div
        ref='root'
        style={this.style('root')}
      >
        <RegisterForm {...this.props} />
      </div>
    );
  },
});

module.exports = RegisterScreen;
