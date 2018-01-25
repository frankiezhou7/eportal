const React = require('react');
const _ = require('eplodash');
const DropDownOrgRoles = require('../dropdown-organization-roles');
const DropDownOrganizations = require('../dropdown-organizations');

const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

const ShipManagementItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/StorageYard/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    onAdd: PropTypes.func,
    style: PropTypes.object,
    value: PropTypes.object,
  },

  getDefaultProps() {
    return {
      value:{
        role: '',
        organization: {
          text: '',
          value: ''
        }
      }
    };
  },

  getValue() {
    return {
      role: this.refs.role && this.refs.role.getValue(),
      organization: this.refs.organization && this.refs.organization.getValue()
    }
  },

  handleAdd(event, index, value) {
    let { onAdd } = this.props;
    if (_.isFunction(onAdd)) {
      onAdd();
    }
  },

  getStyles() {
    let styles = {
      root: {},
      orgRole: {
        width: '200px',
        marginRight: '10px',
      },
      org: {
        width: '400px',
      },
    };

    return styles;
  },

  render() {
    let { style } = this.props;
    let styles = this.getStyles();

    return (
      <div style={Object.assign(styles.root, style)}>
        <DropDownOrgRoles
          key="orgRoles"
          ref="role"
          style={this.style('orgRole')}
          onChange={this.handleAdd}
          value = {this.props.value.role}
        />
        <DropDownOrganizations
          key="organizations"
          ref="organization"
          style = {this.style('org')}
          fullWidth = {true}
          onChange={this.handleAdd}
          value = {this.props.value.organization}
        />
      </div>
    );
  },
});

module.exports = ShipManagementItem;
