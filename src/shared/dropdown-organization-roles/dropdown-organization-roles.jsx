const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropDownOrganizationRolesInner = require('./dropdown-organization-roles-inner');
const PropTypes = React.PropTypes;

const DropDownOrganizationRoles = React.createClass({
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

    return (
      <DropDownOrganizationRolesInner
        {...this.props}
        ref={(ref) => this.inner = ref}
      />
    );
  },

  _getRefs() {
    return this.inner.getWrappedInstance();
  },
});

module.exports = DropDownOrganizationRoles;
