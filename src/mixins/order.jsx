const React = require('react');
const PropTypes = React.PropTypes;

const OrderMixin = {

  mixins: [],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    order: PropTypes.object,

    createOrderEntry: PropTypes.func,
    removeOrderEntry: PropTypes.func,
    updateOrder: PropTypes.func,
  },

  componentWillMount() {
  },

  componentWillReceiveProps(nextProps) {
  },

};

module.exports = OrderMixin;
