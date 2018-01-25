const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const PropTypes = React.PropTypes;
const RetrievePassword = require('./retrievePassword');
const ScreenMixin = require('~/src/mixins/screen');
const ThemeManager = require('~/src/styles/theme-manager');
const Translatable = require('epui-intl').mixin;
const EpAppBar = require('~/src/shared/ep-app-bar');
const WhiteLogo = require('~/src/statics/' + __LOCALE__ + '/css/logo-white.svg');

require('epui-intl/lib/locales/' + __LOCALE__);

const RetrievePasswordScreen = React.createClass({
  mixins: [AutoStyle, Translatable, ScreenMixin],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/RetrievePassword/${__LOCALE__}`),
  ],

  contextTypes: {
  	muiTheme: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
    router: PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme),
    };
  },

  propTypes: {},

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    this.setPageTitle(this.t('nTextRetrievePassword'));
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
      textCenter: {
        textAlign: 'center'
      },
      marginTop: {
        marginTop: '40px'
      },
    };

    return styles;
  },

  render() {
    let style = this.getStyles();
    let logo = <img style={this.style('logo')} src={WhiteLogo} />;
    return (
      <div style={this.style('root')}>
        <EpAppBar
          showMenuIconButton={false}
          leftNode={logo}
          leftNodeStyles = {this.style('leftNode')}
        />
        <div style={this.style('background')}>
          <div style={{marginTop: '60px'}}>
            <RetrievePassword />
          </div>
        </div>
      </div>
    );
  },
})

module.exports = RetrievePasswordScreen;
