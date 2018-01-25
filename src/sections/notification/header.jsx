const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const EpAppBar = require('~/src/shared/app-bar-with-buttons');
const React = require('react');
const Translatable = require('epui-intl').mixin;
const MixinScreen = require('~/src/mixins/screen');
const PropTypes = React.PropTypes;


const NotificationHeader = React.createClass({
  mixins: [AutoStyle, Translatable, MixinScreen],

  translations: [
    require(`epui-intl/dist/Notification/${__LOCALE__}`),
    require(`epui-intl/dist/Global/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
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
        marginTop: 5,
      },
      title: {
        display: 'block',
        color: 'white',
        lineHeight: '30px',
        fontSize: 24,
        fontWeight: 'bold',
      },
    };
  },

  renderLeftNode() {
    const title = this.t('nTextNotification');

    return (
      <div style={this.s('content')}>
        <span style={this.s('title')}>{title}</span>
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
        contentWidth={1024}
      />
    );
  },
});

module.exports = NotificationHeader;
