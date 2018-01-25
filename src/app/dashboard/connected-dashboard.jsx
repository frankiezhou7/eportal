const React = require('react');
const _ = require('eplodash');
const { connect } = require('react-redux');
const Dashboard = require('./dashboard');
const PropTypes = React.PropTypes;

const {
  addFavoritePort,
  addFavoriteShip,
  getFavoritePorts,
  getFavoriteShips,
  removeFavoriteById,
} = global.api.epds;

const {
  getRecentOrdersForEachShip,
} = global.api.order;

module.exports = connect(
  (state, props) => {
    return {
      favorites: state.getIn(['favorites']),
      recent: state.getIn(['dashboard', 'recent']),
      user: state.getIn(['session', 'user']),
      account: state.getIn(['session', 'account']),
      addFavoritePort,
      addFavoriteShip,
      getFavoritePorts,
      getFavoriteShips,
      getRecentOrdersForEachShip,
      removeFavoriteById,
    };
  }
)(Dashboard);
