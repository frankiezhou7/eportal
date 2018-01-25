const React = require('react');
const IconButton = require('epui-md/IconButton');
const IconNavigation = require('epui-md/svg-icons/navigation/menu');

const { PropTypes, Component } = React;

class MainNavigationButton extends Component {
  render() {
    return (
      <IconButton onTouchTap={this._handleTouchTap} iconStyle={{fill: '#FFFFFF', color: '#FFFFFF'}}>
        <IconNavigation />
      </IconButton>
    );
  }

  _handleTouchTap = (evt) => {
    global.cli.navigation.toggleLeftNav(true);
  }
};

module.exports = MainNavigationButton;
