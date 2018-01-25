const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const LoginForm = require('./loginForm');
const PropTypes = React.PropTypes;
const ScreenMixin = require('~/src/mixins/screen');
const EpAppBar = require('~/src/shared/ep-app-bar');
const Translatable = require('epui-intl').mixin;
const ThemeManager = require('~/src/styles/theme-manager');
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const WhiteLogo = require('~/src/statics/' + __LOCALE__ + '/css/logo-white.svg');

const LoginScreen = React.createClass({

  mixins: [AutoStyle, ScreenMixin, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/Login/${__LOCALE__}`),
  ],

  propTypes: {
    children: PropTypes.element,
    location: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
    router: PropTypes.object,
  },

  contextTypes: {
  	muiTheme: PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme)
    };
  },

  componentDidMount() {
    this.setPageTitle(this.t('nTextLogin'));
  },

  getStyles() {
    let styles = {
      root: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
      background: {
        width: '100%',
        height: '100%',
        minWidth: '400px',
        minHeight: '800px',
        // backgroundImage: 'url(' + require(`~/src/statics/${__LOCALE__}/css/bg.png`) + ')',
        backgroundImage: `url('${require('~/src/shared/pic/background.svg')}')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 100%',
        backgroundColor: '#fff',
        zoom: 1,
      },
      logo: {
        marginTop: 12,
      },
      leftNode:{
        position: 'absolute',
        top: 6,
      },
    };

    return styles;
  },

  render() {
    let {query} = this.props.location;
    let logo = <img style={this.style('logo')} src={WhiteLogo} />;

    return (
      <div style={this.style('root')}>
        <EpAppBar
          showMenuIconButton={false}
          leftNode={logo}
          leftNodeStyles = {this.style('leftNode')}
        />
        <div style={this.style('background')}>
          <LoginForm redirectTo={query && query.path} />
        </div>
      </div>
    );
  }
});

module.exports = LoginScreen;
