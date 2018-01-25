const React = require('react');
const Dom = require('react-dom');

const AccessRole = require('~/src/shared/management-access-roles');

module.exports = function ListAccessRulePage(props) {
  return (
    <AccessRole style={{ width: '100%', height: '100%' }} />
  );
}
