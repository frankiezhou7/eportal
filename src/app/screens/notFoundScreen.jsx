const React = require('react');
const Header = require('./header');
const NotFound = require('./notFound');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;
const _ = require('eplodash');
const PropTypes = React.PropTypes;
const APP_BAR_MAX_HEIGHT = 72;

const NotFoundScreen = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Common/${__LOCALE__}`),

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  childContextTypes :{
    muiTheme: PropTypes.object,
    router: PropTypes.object,
  },

  propTypes: {
    children: PropTypes.object,
  },

  getDefaultProps() {
    return { };
  },

  getStyles() {
    return {
      root: {
        height: '100%',
        paddingTop: APP_BAR_MAX_HEIGHT,
        boxSizing: 'border-box',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
      appBar: {
        position: 'fixed',
        top: 0,
      },
      content: {
        margin: 'auto',
        maxWidth: global.contentWidth,
        height: '100%',
      },
    };
  },

  render() {
    return (
      <div style={this.s('root')}>
        <Header style={this.s('appBar')} />
        <div style = {this.s('content')}>
          <NotFound />
        </div>
      </div>
    );
  },
});

module.exports = NotFoundScreen;
