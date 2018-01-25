const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Detail = require('./right-nav-detail');
const Drawer = require('epui-md/Drawer');
const Header = require('./right-nav-header');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const { getSubPath } = require('~/src/utils');

const RightNav = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
    router: PropTypes.object,
  },

  propTypes: {
    disableSwipeToOpen: PropTypes.bool,
    docked: PropTypes.bool,
    header: PropTypes.element,
    open: PropTypes.bool,
    openSecondary: PropTypes.bool,
    user: PropTypes.object,
    account: PropTypes.object,
  },

  getDefaultProps() {
    return {
      disableSwipeToOpen: false,
      docked: false,
      open: false,
      openSecondary: true,
    };
  },

  getInitialState() {
    return {};
  },

  handleLogout() {
    let { logout } = global.api.user;
    let { logoff } = global.cli.user;

    if (_.isFunction(logout)) {
      logout();
    }

    if (_.isFunction(logoff)) {
      logoff();
    }

    // redirect to login
    let redirectTo = getSubPath('/login');
    global.tools.toSubPath(redirectTo);
  },

  handleRequestChange(open, reason) {
    let { toggleRightNav } = global.cli.navigation;
    if (_.isFunction(toggleRightNav)) {
      toggleRightNav();
    }
  },

  getStyles() {
    let styles = {
      root: {},
      drawer: {
        zIndex: 500,
      },
    };

    return styles;
  },

  render() {
    let {
      docked,
      open,
      openSecondary,
      account,
      user,
    } = this.props;

    if(!user) { return null; }

    let username = user.get('username');
    let fullname = user.get('fullname');
    let photoURL = user.get('photoURL');
    let isSuperAdmin = user.get('isSuperAdmin');
    let orgName = account.organization && account.organization.name;
    return (
      <Drawer
        ref={(ref) => this.drawer = ref}
        docked={docked}
        open={open}
        openSecondary={openSecondary}
        onRequestChange={this.handleRequestChange}
        style={this.style('drawer')}
      >
        <Header
          ref={(ref) => this.header = ref}
          username={username}
          isSuperAdmin={isSuperAdmin}
          orgName={orgName}
          fullname={fullname}
          photoURL={photoURL}
        />
        <Detail
          ref={(ref) => this.detail = ref}
          onLogout={this.handleLogout}
          user={user}
          account={account}
        />
      </Drawer>
    );
  },
});

module.exports = RightNav;
