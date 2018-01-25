const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const ChangePasswordForm = require('./changePasswordForm');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const ChangePasswordScreen = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/ChangePassword/${__LOCALE__}`),

  contextTypes: {
  	muiTheme: PropTypes.object,
  },

  propTypes: {
    nTextChangePassword: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    this._hideNavigations();
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
    return <ChangePasswordForm {...this.props} />;
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

module.exports = ChangePasswordScreen;
