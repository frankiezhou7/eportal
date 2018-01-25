const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const EpAppBar = require('~/src/shared/app-bar-with-buttons');
const React = require('react');
const Translatable = require('epui-intl').mixin;
const MixinScreen = require('~/src/mixins/screen');
const WhiteLogo = require('~/src/statics/' + __LOCALE__ + '/css/logo-white.svg');
const PropTypes = React.PropTypes;

const DefaultHeader = React.createClass({
  mixins: [AutoStyle, Translatable, MixinScreen],

  translations: [
    require(`epui-intl/dist/Management/${__LOCALE__}`),
    require(`epui-intl/dist/Global/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    title: PropTypes.any,
  },

  getDefaultProps() {
    return { };
  },

  getStyles() {
    let spacing = this.context.muiTheme.spacing;
    let themeVariables = this.context.muiTheme.appBar;

    return {
      root: _.assign({
        color: themeVariables.textColor,
        fontSize: 12,
        fontWeight: 'bold',
      }, this.props.style),
      content: {
        marginTop: -5,
      },
      top: {
        lineHeight: '18px',
        color: 'white',
        padding: '1px 2px',
      },
      title: {
        display: 'block',
        color: 'white',
        lineHeight: '28px',
        fontSize: 24,
        fontWeight: 'bold',
      },
      logo: {
        marginTop: '10px',
        width: '118px',
      },
    };
  },

  render() {
    let title = this.props.title ? this.props.title : <img style={this.style('logo')} src={WhiteLogo} />;
    let pathname = global.location.pathname;
    return (
        <EpAppBar
          ref="appBar"
          leftNode={title}
          showFAB={false}
          showMenuIconButton={true}
          style={this.s('root')}
          zDepth={1}
        />
    );
  },
});

module.exports = DefaultHeader;
