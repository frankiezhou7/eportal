const React = require('react');
const _ = require('eplodash');
const DropDownAccountsInner = require('./dropdown-accounts-inner');
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;

const DropDownAccounts = React.createClass({
  mixins: [StylePropable, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value: PropTypes.object,
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

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    return(
      <DropDownAccountsInner
        {...this.props}
        ref="inner"
        styles={styles.root}
      />
    );
  },

  _getRef() {
    return this.refs.inner.getWrappedInstance();
  },
});

module.exports = DropDownAccounts;
