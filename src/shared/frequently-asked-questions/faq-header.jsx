const React = require('react');
const _ = require('eplodash');
const Account = require('epui-md/svg-icons/action/account-circle');
const AppBar = require('~/src/shared/app-bar-with-buttons');
const AutoStyle = require('epui-auto-style').mixin;
const Avatar = require('epui-md/Avatar');
const IconButton = require('epui-md/IconButton');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const WhiteLogo = require('~/src/statics/' + __LOCALE__ + '/css/logo-white.svg');

const FAQHeader = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Management/${__LOCALE__}`),
    require(`epui-intl/dist/Global/${__LOCALE__}`),
  ],

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
      iconButton: {
        marginTop: '13.5px',
      },
      iconMenu: {
        marginTop: '12px',
        marginRight: 'auto',
      },
      leftIcon: {
        padding: '16px 12px',
      },
      logo: {
        width: '118px',
        height: '75px',
      },
    };
  },

  render() {
    let logo = <img style={this.style('logo')} src={WhiteLogo} />;
    let title = (
      <div style={this.style('title.root')} >
        <div style={this.style('title.logo')} >
          {logo}
        </div>
      </div>
    );
    const titleStyle ={
      maxWidth: '1160px',
      margin: '0 auto',
    }

    let pathname = global.location.pathname;
    let redirect = _.split(pathname, '/faq')[0] + '/notification';

    return (
      <AppBar
        key="appBar"
        iconStyleLeft={this.style('iconMenu')}
        showMenuIconButton={true}
        style={this.style('root')}
        title={title}
        titleStyle={titleStyle}
      />
    );
  },
});

module.exports = FAQHeader;
