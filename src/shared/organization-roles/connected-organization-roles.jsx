const OrganizationRolesInner = require('./organization-roles-inner');
const { connect } = require('react-redux');
const { getOrgRoleTypes } = global.api.epds;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      getOrgRoleTypes,
      orgRoles: state.get('orgRoles'),
    };
  },
  null,
  null,
  {withRef: true},
)(OrganizationRolesInner);
