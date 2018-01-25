const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const PropTypes = React.PropTypes;
const ResetPasswordForm = require('./resetPasswordForm');
const ScreenMixin = require('~/src/mixins/screen');
const ThemeManager = require('~/src/styles/theme-manager');
const Translatable = require('epui-intl').mixin;

require('epui-intl/lib/locales/' + __LOCALE__);

const ResetPasswordScreen = React.createClass({
  mixins: [AutoStyle, Translatable, ScreenMixin],

  translations: [
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/ResetPassword/${__LOCALE__}`),
  ],

  contextTypes: {
  	muiTheme: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    nPageTitleResetPassword: PropTypes.string,
  },

  getDefaultProps() {
    return {
      locale: __LOCALE__,
    };
  },

  getInitialState() {
    return {};
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme),
    };
  },

  componentDidMount() {
    this._hideNavigations();
    this.setPageTitle(this.t('nPageTitleResetPassword'));
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
      },
    };

    return styles;
  },

  render() {
    return (
      <div style={this.style('root')}>
        <ResetPasswordForm {...this.props} />
      </div>
    );
  },

  _hideNavigations() {
    let register = global.register;
    let leftNav = register && register.leftNav;
    let rightNav = register && register.rightNav;

    if (leftNav) {
      leftNav.dismiss();
      leftNav.close();
    }
    if (rightNav) {
      rightNav.dismiss();
      rightNav.close();
    }
  },
});

module.exports = ResetPasswordScreen;
