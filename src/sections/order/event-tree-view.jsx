const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const EventTree = require('./event-list');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const { List } = require('epimmutable');

// const {
//   store,
//   actions,
// } = require('~/src/stores/events');

const component = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    ship: PropTypes.object,
    segment: PropTypes.object,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState: function() {
    return {};
  },

  componentDidMount() {

  },

  componentWillUnmount() {

  },

  componentWillUpdate() {

  },

  getStyles() {
    return {};
  },

  save() {
    let {
      ship,
      segment,
      order,
      orderEntry,
    } = this.props;

    let items = _.forEach(this.getValue(), (obj) => {
      obj.ship = ship._id;
      obj.segment = segment._id;
      obj.order = order._id;
      obj.orderEntry = orderEntry._id;
    });

    if(!items || items.length <= 0) {
      return;
    }

    actions.updateShipEvents(ship._id, segment._id, order._id, orderEntry._id, items);
  },

  getValue() {
    return this.refs.container.refs.tree.getValue();
  },

  isDirty() {
    return this.refs.container.refs.tree.isDirty();
  },

  renderTree(props) {
    return (
      <EventTree
        {...props}
        ref='tree'
      />
    );
  },

  // render() {
  //   let styles = this.getStyles();
  //
  //   return (
  //     <AltContainer
  //       ref='container'
  //       render={this.renderTree}
  //       stores={[store]}
  //       inject={{
  //         // eventTypesArray: this._getEventTypes,
  //         eventItemsArray: this._getEvents,
  //         orderEntry: this.props.orderEntry,
  //       }}
  //     />
  //   );
  // },

  render() {
    return(
      <div>TODO: event tree view</div>
    );
  },

  _getEvents() {
    let {
      ship,
      segment,
      order,
      orderEntry,
    } = this.props;

    if(!orderEntry) { return List.of(''); }

    let state = store.getState();
    let events = state && state.events;

    // if(events && events[orderEntry._id]) {
    //   return events[orderEntry._id].entries;
    // }

    if(events) {
      return events;
    }

    actions.findShipEventsByQuery(ship._id, segment._id, order._id, orderEntry._id, {
      orderEntry: orderEntry._id
    });

    return List.of('');
  },

  // _getEventTypes() {
  //   let orderEntry = this.props.orderEntry;
  //   let product = orderEntry && orderEntry.product;
  //   let code = product && product.code;
  //
  //   if(!code) { return []; }
  //
  //   let types = store.getState().types;
  //   if(types && types[code]) { return types[code]; }
  //
  //   // actions.findShipEventTypesByTag(code);
  //
  //   return [];
  // }
});

module.exports = component;
