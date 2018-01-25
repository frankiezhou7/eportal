const React = require('react');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const ShipDialog = React.createClass({
  mixins: [Translatable],

  translations: require(`epui-intl/dist/ShipDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    nTitleAddShip: PropTypes.string,
    nTitleUpdateShipInfo: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  show(shipId) {
    let props = {
      title: shipId ? this.t('nTitleUpdateShipInfo') : this.t('nTitleAddShip'),
      open: true,
      modal: true,
    };

    let component = {
      name: 'ShipFormConnect',
      props: {
        shipId: shipId,
      },
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  render() {
    return (
      <div></div>
    );
  },
});

module.exports = ShipDialog;
