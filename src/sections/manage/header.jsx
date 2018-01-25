const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const EpAppBar = require('~/src/shared/app-bar-with-buttons');
const React = require('react');
const Translatable = require('epui-intl').mixin;
const MixinScreen = require('~/src/mixins/screen');
const NAV_ITEMS = require('./items');
const PropTypes = React.PropTypes;


const MngmntHeader = React.createClass({
  mixins: [AutoStyle, Translatable, MixinScreen],

  translations: [
    require(`epui-intl/dist/Management/${__LOCALE__}`),
    require(`epui-intl/dist/Global/${__LOCALE__}`),
  ],

  contextTypes: {
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
    };
  },

  renderLeftNode() {
    const { target } = this.props;

    const item = _.find(NAV_ITEMS, { key: target });
    const top = '系统管理';
    const title = item ? item.text : '-';

    this.setPageTitle(`${top}/${title}`);

    return (
      <div style={this.s('content')}>
        <span style={this.s('top')}>{top}</span>
        <span style={this.s('title')}>{title}</span>
      </div>
    );
  },

  render() {
    let pathname = global.location.pathname;
    let redirect = _.split(pathname, '/manage')[0] + '/notification';
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

module.exports = MngmntHeader;
