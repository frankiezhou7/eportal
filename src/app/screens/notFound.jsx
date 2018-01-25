const React = require('react');
const Header = require('./header');
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const ThemeManager = require('~/src/styles/theme-manager');
const RaisedButton = require('epui-md/RaisedButton');
const Img404 = require('~/src/statics/' + __LOCALE__ + '/css/404.svg');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;
const _ = require('eplodash');
const PropTypes = React.PropTypes;
const APP_BAR_MAX_HEIGHT = 72;

const NotFound = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/NotFound/${__LOCALE__}`),

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  childContextTypes :{
    muiTheme: PropTypes.object,
    router: PropTypes.object,
  },

  propTypes: {
    nText404Message: PropTypes.string,
    nLabelBackHome: PropTypes.string,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme),
    };
  },

  getDefaultProps() {
    return {
    };
  },

  getStyles() {
    let theme = this.context.muiTheme;
    return {
      root:{

      },
      container:{
        margin: 'auto',
        paddingTop: 90,
      },
      wrapper:{
      },
      img:{
        marginTop: 100,
        height: 346
      },
      content:{
        textAlign: 'center',
        width: 600,
        margin: 'auto',
        marginBottom: 100,
      },
      text:{
        color: theme.epColor.primaryColor,
        fontSize: 30,
        marginBottom: 44,
        marginTop: 50
      },
    };
  },

  handleTouchTap(){
    global.tools.toSubPath('dashboard');
  },

  render() {
    return (
      <div style={this.s('root')}>
        <div style = {this.s('container')}>
          <div style = {this.s('wrapper')} ref = 'wrapper'>
            <div style = {this.s('content')}>
              <img
                src={Img404}
                style = {this.s('img')}
              />
            <div style = {this.s('text')}>{this.t('nText404Message')}</div>
              <RaisedButton
                label= {this.t('nLabelBackHome')}
                backgroundColor = {this.context.muiTheme.epColor.primaryColor}
                labelColor = {'#fff'}
                onTouchTap = {this.handleTouchTap}
                capitalized = {'initial'}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = NotFound;
