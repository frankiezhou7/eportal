const React = require('react');
const _ = require('eplodash');
const Account = require('epui-md/svg-icons/action/account-circle');
const AppBar = require('~/src/shared/app-bar-with-buttons');
const AutoStyle = require('epui-auto-style').mixin;
const IconButton = require('epui-md/IconButton');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const WhiteLogo = require('~/src/statics/' + __LOCALE__ + '/css/logo-white.svg');
const FaqIcon = require('~/src/shared/frequently-asked-questions/faq-icon');

const DashboardHeader = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Global/${__LOCALE__}`),

  propTypes: {
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getStyles() {
    return {
      root: _.assign({
        position: 'fixed',
        textAlign: 'left',
        zIndex: 1000,
      }, this.props.style),
      iconMenu: {
        marginTop: '12px',
        marginRight: 'auto',
      },
      leftIcon: {
        padding: '16px 12px',
      },
      logo: {
        marginTop: 12,
      },
      title: {
        margin: '0px auto',
        maxWidth: global.contentWidth,
      },
      leftNode:{
        position: 'absolute',
        top: 6,
      },
      middleNode:{
        maxWidth: 1170,
      }
    };
  },

  render() {
    let styles = this.getStyles();
    let logo = <img style={this.style('logo')} src={WhiteLogo} />;
    let pathname = global.location.pathname;
    let redirect = _.split(pathname, '/dashboard')[0] + '/notification';

    return (
      <AppBar
        key="appBar"
        iconStyleLeft={this.style('iconMenu')}
        showMenuIconButton={true}
        leftNode={logo}
        leftNodeStyles = {this.style('leftNode')}
        middleNodeStyles = {this.style('middleNode')}
        style={this.style('root')}
      />
    );
  },
});

module.exports = DashboardHeader;
