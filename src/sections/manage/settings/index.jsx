var React = require('react')
var ExchangeRate = require('./exchange-rate')
var ShipVerify = require('./ship-verify')
var DefaultConsignee = require('./default-consignee')

const Settings = React.createClass({
  render() {
    return (
      <div style={{ marginTop: 20 }}>
        <ExchangeRate />
        <ShipVerify />
        <DefaultConsignee />
      </div>
    )
  }
})

module.exports = Settings
