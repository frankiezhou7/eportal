const React = require('react');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const ScreenMixin = require('~/src/mixins/screen');

const ShipMixin = {

  mixins: [Translatable, ScreenMixin],

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object
  },

  propTypes: {
    ship: PropTypes.object
  },

  getDefaultProps() {
    return {
      ship: null
    };
  },

  setTitle(title) {
    if(title) {
      this.setPageTitle(title);
      return;
    }
    let ship = this.props.ship;
    let name = ship && ship.name;
    name = name ? name + '/' : '';

    let location = this.props.location;
    let path = location && location.pathname;

    let res = /\/([^/]*)$/.exec(path);
    let titles = {
      'voyages': `${name}${this.t('nTitleShipVoyages')}`,
      'particulars': `${name}${this.t('nTitleShipParticulars')}`,
      'logs': `${name}${this.t('nTitleShipLogs')}`,
      'reports': `${name}${this.t('nTitleShipReports')}`,
    };
    this.setPageTitle(titles[res[1]]);
  },
  //
  // getSegment(segmentId, props) {
  //   props = props || this.props;
  //   let ship = this.props.ship;
  //   if(!ship || !ship.voyageSegments) { return null; }
  //   return _.find(ship.voyageSegments.entries, { _id: segmentId });
  // },
  //
  // getSegments(props) {
  //   props = props || this.props;
  //   let ship = props.ship;
  //   if(!ship || !ship.voyageSegments) { return null; }
  //
  //   return ship.voyageSegments;
  // },
  //
  // getSegmentEntries(props) {
  //   let segs = this.getSegments(props);
  //   return segs && segs.entries;
  // },
  //
  // getSegmentPagination(props) {
  //   let segs = this.getSegments(props);
  //   return segs && segs.pagination;
  // },
  //
  // clearSegments() {
  //   let ship = this.props.ship;
  //   if(!ship || !ship.voyageSegments) { return; }
  //   ship.voyageSegments = null;
  // },
  //
  // countSegments(props) {
  //   props = props || this.props;
  //   let ship = props.ship;
  //   if(!ship || !ship.voyageSegments || !ship.voyageSegments.entries) { return 0; }
  //   return ship.voyageSegments.entries.length;
  // },
  //
  // getSegmentOrders(segmentId, props) {
  //   let seg = this.getSegment(segmentId, props);
  //   if(!seg) { return null; }
  //   return seg.orders;
  // },
  //
  // getSegmentOrder(segmentId, orderId, props) {
  //   let orders = this.getSegmentOrders(segmentId, props);
  //   if(!orders) { return null; }
  //   return _.find(orders, { _id: orderId });
  // },
  //
  // componentWillMount() {
  //   this._defineProp('shipId', () => {
  //     if(!this.props.ship) { return null; }
  //     return this.props.ship._id;
  //   });
  //
  //   this._defineProp('shipName', () => {
  //     if(!this.props.ship) { return null; }
  //     return this.props.ship.shipName;
  //   });
  // },
  //
  // _defineProp(name, getter) {
  //   Object.defineProperty(this, name, {
  //     get: getter
  //   });
  // }
};

module.exports = ShipMixin;
