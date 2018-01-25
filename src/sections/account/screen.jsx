const React = require('react');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const PropTypes = React.PropTypes;
const AccountView = require('./view');
const { getSubPathComponents } = require('~/src/utils');

const {
  findUserGroupsByOwner,
  createUserGroup,
  updateUserProfile,
  removeUserGroupById,
  updateUserGroupById,
  findUsersByUserGroup,
  createUserByUserGroup,
  updateUserByUserGroup,
  removeUsersAndWithPositionByIds,
  fetchMe,
  userExists,
} = global.api.user;

const {
  findOrganizationById,
  updateOrganizationById,
  createPerson,
  updatePersonById,
} = global.api.epds;

module.exports = connect(
  (state, props) => {
    const segs = getSubPathComponents(global.location.pathname);
    return {
      user: state.getIn(['session', 'user']),
      users: state.get('users'),
      userGroups: state.get('userGroups'),
      account: state.getIn(['session', 'account']),
      target: segs[1],
      findUserGroupsByOwner,
      createUserGroup,
      removeUserGroupById,
      updateUserGroupById,
      findUsersByUserGroup,
      createUserByUserGroup,
      updateUserByUserGroup,
      removeUsersAndWithPositionByIds,
      updateUserProfile,
      fetchMe,
      findOrganizationById,
      updateOrganizationById,
      createPerson,
      updatePersonById,
      userExists,
    };
  }
)(AccountView);
