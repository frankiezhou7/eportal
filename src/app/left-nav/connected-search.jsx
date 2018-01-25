const React = require('react');
const { connect } = require('react-redux');
const Search = require('./search');

const api = global.api.epds;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      user: state.getIn(['session', 'user']),
      favorites: state.getIn(['favorites']),
      countries: state.getIn(['country', 'list']),
      comboSearch: api.comboSearch,
    };
  }
)(Search);
