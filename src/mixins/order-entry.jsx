const React = require('react');
const PropTypes = React.PropTypes;

const OrderEntryMixin = {

  mixins: [],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    costTypes: PropTypes.any,
    calculateOrderEntryFee: PropTypes.func,
    updateOrderEntry: PropTypes.func,
  },

  componentWillMount() {
  },

  componentWillReceiveProps(nextProps) {
  },

};

module.exports = OrderEntryMixin;
