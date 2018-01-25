let React = require('react');
let StylePropable = require('~/src/mixins/style-propable');
let PortMixin = require('./mixins/port');

let PropTypes = React.PropTypes;

let PortReports = React.createClass({
  mixins: [StylePropable, PortMixin],

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

  componentDidUpdate(prevProps, prevState) {
  },

  getStyles() {
    return {};
  },

  render() {
    let styles = this.getStyles();

    return (
      <div>
        <h1>TODO PORT REPORTS!</h1>
      </div>
    );
  }
});

module.exports = PortReports;
