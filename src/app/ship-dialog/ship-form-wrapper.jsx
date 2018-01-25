const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Dialog = require('epui-md/Dialog');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const ShipForm = require('./ship-form');
const Translatable = require('epui-intl').mixin;

const ShipFormWrapper = React.createClass({
  mixins: [AutoStyle, PureRenderMixin, Translatable],

  translations: require(`epui-intl/dist/ShipDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    close: PropTypes.func,
    createShip: PropTypes.func,
    getFavoriteShips: PropTypes.func,
    nTextCancel: PropTypes.string,
    nTextCreate: PropTypes.string,
    nTextCreateAndContinue: PropTypes.string,
    nTitleAddShip: PropTypes.string,
    shipId: PropTypes.string,
    ships: PropTypes.object,
    updateShipEssentialInfo: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      doing: null,
    };
  },

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.doing === 'createAndContinue') {
      let fn = this.props.getFavoriteShips;
      if (_.isFunction(fn)) { fn(); }
      global.tools.toSubPath(`/ship/${shipId}/voyage`);
    }

    let fn = this.props.getFavoriteShips;
    if (_.isFunction(fn)) { fn(); }
    this.props.close();
  },

  updateShipEssentialInfo() {
    let form = this.refs.shipForm;
    let ship = form.getValue();
    let shipId = this.props.shipId;

    this.setState({
      doing: 'update',
    }, () => {
      this.props.updateShipEssentialInfo(shipId, ship);
    });
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let {
      shipId,
      ships,
    } = this.props;

    return (
      <ShipForm
        {...this.props}
        ref="shipForm"
        shipId={this.props.shipId}
      />
    );
  },
});

module.exports = ShipFormWrapper;
