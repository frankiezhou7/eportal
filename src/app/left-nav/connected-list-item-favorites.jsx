const React = require('react');
const { connect } = require('react-redux');
const ListItemFavorites = require('./list-item-favorites');

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      user: state.getIn(['session', 'user']),
      favorites: state.getIn(['favorites'])
    };
  }
)(ListItemFavorites);
