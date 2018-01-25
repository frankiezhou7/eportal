const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('eplodash');
const RaisedButton = require('epui-md/RaisedButton');
const AutoStylable = require('epui-auto-style');
const Translatable = require('epui-intl');

// const IconDashboard = require('epui-md/svg-icons/maps/menus-homepage');
const IconDashboard = require('epui-md/svg-icons/ep/menus-homepage-big');

const { List, ListItem } = require('epui-md/List');
const ListItemFavorites = require('./connected-list-item-favorites');

const { Component, PropTypes } = React;

class Navigation extends Component {
  static propTypes = {
    user: PropTypes.object,
    style: PropTypes.object,
    onItemTouchTap: PropTypes.func,
  }
  static contextTypes = {
    muiTheme: PropTypes.object,
  }
  render() {
    const { user } = this.props;
    let theme = this.context.muiTheme;
    let color = theme && theme.epColor.portColor;
    const dashboardIcon = (<IconDashboard color={color}/>);
    const items = [
      <ListItem primaryText='Dashboard' leftIcon={dashboardIcon} onTouchTap={this._handleToDashboard} />,
      <ListItemFavorites type='port' onItemTouchTap={this._handleOpenPort} />,
      <ListItemFavorites type='ship' onItemTouchTap={this._handleOpenShip} />,
    ];

    if(user && user.hasRole('ARSUPADM')) {
      items.push(
        <ListItem primaryText='系统管理' onTouchTap={this._handleToManagement} />
      );
    }

    return (
      <List style={this.props.style}>
        {items}
      </List>
    );
  }

  _handleOpenShip = (e, id) => {
    global.tools.toSubPath(`/ship/${id}/voyage/`, true);

    const { onItemTouchTap } = this.props;
    if(onItemTouchTap) {
      onItemTouchTap(e, 'open_ship', id);
    }
  }

  _handleOpenPort = (e, id) => {
    global.tools.toSubPath(`/port/${id}`);

    const { onItemTouchTap } = this.props;
    if(onItemTouchTap) {
      onItemTouchTap(e, 'open_port', id);
    }
  }

  _handleToDashboard = (e) => {
    global.tools.toSubPath('dashboard');

    const { onItemTouchTap } = this.props;
    if(onItemTouchTap) {
      onItemTouchTap(e, 'open_dashboard');
    }
  }

  _handleToManagement = (e) => {
    global.tools.toSubPath('manage');

    const { onItemTouchTap } = this.props;
    if(onItemTouchTap) {
      onItemTouchTap(e, 'open_management');
    }
  }
}

module.exports = Navigation;
