const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropDownShipStatusInner = require('./dropdown-ship-status-inner');
const PropTypes = React.PropTypes;

const DropDownShipStatus = React.createClass({
  mixins: [AutoStyle],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  clearValue() {
    let el = this._getRefs();
    el.clearValue();
  },

  getValue() {
    let el = this._getRefs();
    return el.getValue();
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    return(
      <DropDownShipStatusInner
        {...this.props}
        ref='inner'
      />
    );
  },

  _getRefs() {
    return this.refs.inner.getWrappedInstance();
  },
});

module.exports = DropDownShipStatus;
