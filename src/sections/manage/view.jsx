const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Header = require('./header');
const MainAccountButton = require('~/src/shared/main-account-button');
const MainNavigationButton = require('~/src/shared/main-navigation-button');
const NavigationContainer = require('epui-md/ep/NavigationContainer');
const IconSettings = require('epui-md/svg-icons/action/settings');
const React = require('react');
const Translatable = require('epui-intl').mixin;
const { ListItem } = require('epui-md/List');

const PropTypes = React.PropTypes;

const NAV_ITEMS = require('./items');

const MngmntData = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Management/${__LOCALE__}`),

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  propTypes: {
    children: PropTypes.object,
    target: PropTypes.string,
  },

  getDefaultProps() {
    return { };
  },

  getStyles() {
    return {
      root: {
        height: '100%',
        paddingTop: global.appHeight,
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
      coverContent: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        zIndex: 2,
      },
      content: {
        margin: 'auto',
        maxWidth: global.contentWidth,
        height: '100%',
      },
    };
  },

  renderSubNavigationItems() {
    const icon = (<IconSettings />);

    return _.map(NAV_ITEMS, item => (
      <ListItem
        key={item.key}
        primaryText={item.text}
        leftIcon={icon}
        value={item.key}
      />
    ));
  },

  render() {
    const { target } = this.props;

    return (
      <div style={this.s('root')}>
        <Header
          style={this.s('appBar')}
          target={target}
        />
        <NavigationContainer
          menuItems={this.renderSubNavigationItems()}
          value={target}
          style={this.s('coverContent')}
          onChange={this._onSubNavigationChange}
          keepOpen ={true}
          float = {false}
        >
          <div style = {this.s('content')}>
            {React.cloneElement(this.props.children, {...this.props})}
          </div>
        </NavigationContainer>
      </div>
    );
  },

  _onSubNavigationChange(ref, target) {
    global.tools.toSubPath(`/manage/${target}`);
  }
});

module.exports = MngmntData;
