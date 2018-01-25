const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropDownShipSizesInner = require('./dropdown-ship-sizes-inner');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const DropDownShipSizes = React.createClass({
  mixins: [AutoStyle, Translatable],

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
    let el = this._getRef();
    el.clearValue();
  },

  getValue() {
    let el = this._getRef();
    return el.getValue();
  },

  setValue(value) {
    let el = this._getRef();
    el.setValue(value);
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let { style } = this.props;
    let styles = this.getStyles();

    return(
      <DropDownShipSizesInner
        {...this.props}
        ref="inner"
      />
    );
  },

  _getRef() {
    return this.refs.inner.getWrappedInstance();
  },
});

module.exports = DropDownShipSizes;
