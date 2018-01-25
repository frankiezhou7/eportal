let React = require('react');
let StylePropable = require('~/src/mixins/style-propable');
let ShipMixin = require('./mixins/ship');

let PropTypes = React.PropTypes;

let ShipLogs = React.createClass({
  mixins: [StylePropable, ShipMixin],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {

  },

  getDefaultProps() {
    return {};
  },

  getInitialState: function() {
    return {};
  },

  componentDidMount() {
    this.setTitle();
  },

  componentWillUnmount() {
  },

  componentWillUpdate() {
  },

  getStyles() {
    return {};
  },

  render() {
    let styles = this.getStyles();

    return (
      <div>
        <h1>TODO SHIP LOGS!</h1>
      </div>
    );
  }
});

module.exports = ShipLogs;
