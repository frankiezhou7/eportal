const React = require('react');
const ExchangeRate = require('~/src/sections/manage/exchange-rate');
const PropTypes = React.PropTypes;

const ExchangeRateView = React.createClass({
  contextTypes: {
    muiTheme: PropTypes.object
  },

  render() {
    return <ExchangeRate isView = {true} />;
  }

});

module.exports = ExchangeRateView;
