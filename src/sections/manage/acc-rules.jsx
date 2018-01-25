const React = require('react');
const Dom = require('react-dom');

const ListAccessRule = require('~/src/shared/management-access-rules');

module.exports = function ListAccessRulePage(props) {
  return (
    <ListAccessRule style={{height: '100%', width: '100%'}} />
  )
}
