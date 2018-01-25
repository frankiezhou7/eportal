const React = require('react');
const alt = require('epalt');
const PropTypes = React.PropTypes;
const StylePropable = require('epui/lib/mixins/style-propable');
const OrderEntryDetails = require('./order-entry-details');
const AltContainer = require('epalt/lib/AltContainer');

require('~/src/stores/products');

let store = alt.findStore('products');
let orderStore = alt.findStore('segment-orders');
let actions = alt.findActions('products');
let orderActions = alt.findActions('segment-orders');

let OrderEntryDetailsView = React.createClass({
  mixins: [StylePropable],

  propTypes: {
    ship: PropTypes.object,
    segment: PropTypes.object,
    costTypes: PropTypes.object,
    page: PropTypes.string,
    mode: PropTypes.string,
    changed: PropTypes.bool,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    product: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState: function() {
    return {};
  },

  componentDidMount(){
    global.currentProductConfig = this.props.orderEntry.productConfig;
    actions.findSubProductsById(this.props.orderEntry.product._id);
  },


  componentWillReceiveProps(nextProps) {
    if(this.props.orderEntry._id!==nextProps.orderEntry._id){
      global.currentProductConfig = this.props.orderEntry.productConfig;
      actions.findSubProductsById(nextProps.orderEntry.product._id);
    }
  },

  saveProductConfig(){
    this.refs.container.refs.orderEntryDetails.saveProductConfig();
  },

  renderOrderEntryDetails(props) {
    let {
      ship,
      segment,
      order,
      orderEntry,
      costTypes,
      page,
      mode,
      changed,
    } = this.props;
    return (
      <OrderEntryDetails
        {...props}
        ref='orderEntryDetails'
        ship={ship}
        segment={segment}
        order={order}
        orderEntry={orderEntry}
        costTypes={costTypes}
        page = {page}
        mode = {mode}
        changed = {changed}
      />
    );
  },

  render() {
    return (
      <AltContainer
        ref='container'
        store={store}
        render={this.renderOrderEntryDetails}
        inject={{
          subProducts: this._getSubProducts
        }}
      />
    );
  },

  _getSubProducts(props) {
    return store.getState().subProducts;
  },


});

module.exports = OrderEntryDetailsView;
