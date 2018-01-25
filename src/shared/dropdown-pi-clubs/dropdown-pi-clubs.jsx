const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropDownPiClubsInner = require('./dropdown-pi-clubs-inner');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const DropDownPiClubs = React.createClass({
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
      <DropDownPiClubsInner
        {...this.props}
        ref='inner'
      />
    );
  },

  _getRefs() {
    return this.refs.inner.getWrappedInstance();
  },
});

module.exports = DropDownPiClubs;
