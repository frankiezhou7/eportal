const React = require('react');
const _ = require('eplodash');
const PropTypes = React.PropTypes;
const ScreenMixin = require('../../mixins/screen');
const Ship = require('./ship');
const Translatable = require('epui-intl').mixin;

const ShipScreen = React.createClass({
  mixins: [ScreenMixin, Translatable],

  propTypes: {
    findShipById: PropTypes.func,
    params: PropTypes.object,
    router: PropTypes.func,
    ships: PropTypes.object,
  },

  componentWillMount() {
    let {
      findShipById,
      params,
    } = this.props;
    let shipId = params.shipId;
    if(!shipId) {
      //TODO:
      return;
    }
    let ships = this.props.ships;
    let index = ships ? ships.findIndex(s => shipId === s.get('_id')) : -1;
    if (index === -1 && _.isFunction(findShipById)) {
      findShipById(shipId);
    }
  },

  componentDidMount() {
    this.setPageTitle(this.t('nTitleShipVoyages'));
  },

  componentWillReceiveProps(nextProps) {
    let newId = nextProps.params.shipId;
    let oldId = this.props.params.shipId;
    let ships = nextProps.ships;
    let index = ships ? ships.findIndex(s => newId === s.get('_id')) : -1;
    if(newId !== oldId && index === -1) {
      let { findShipById } = this.props;
      if (_.isFunction(findShipById)) {
        findShipById(newId);
      }
    }
  },

  render() {
    let {
      params,
      ships,
    } = this.props;
    let shipId = params.shipId;

    let index = ships ? ships.findIndex(s => s.get('_id') === shipId) : -1;
    let ship = ships ? ships.get(index) : null;

    if(ship && ship.getMeta('error')){ global.tools.toSubPath(`/404`); }

    return (
      <Ship
        {...this.props}
        ship={ship}
      />
    );
  },
});

module.exports = ShipScreen;
