const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const EpAppBar = require('~/src/shared/app-bar-with-buttons');
const React = require('react');
const Translatable = require('epui-intl').mixin;
const MixinScreen = require('~/src/mixins/screen');
const PropTypes = React.PropTypes;


const AccountHeader = React.createClass({
  mixins: [AutoStyle, Translatable, MixinScreen],

  translations: [
    require(`epui-intl/dist/Management/${__LOCALE__}`),
    require(`epui-intl/dist/Global/${__LOCALE__}`),
  ],

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  propTypes: {
    target: PropTypes.string,
    style: PropTypes.object,
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
        fontWeight: 'bold'
      }, this.props.style),
      content: {
        marginTop: 8,
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
    };
  },

  renderLeftNode() {
    const { target } = this.props;
    return (
      <div style={this.s('content')}>
        <span style={this.s('title')}>{target}</span>
      </div>
    );
  },

  render() {
    return (
      <EpAppBar
        ref="appBar"
        style={this.s('root')}
        leftNode={this.renderLeftNode()}
        showFAB={false}
        showMenuIconButton={true}
        zDepth={1}
      />
    );
  },

});

module.exports = AccountHeader;
