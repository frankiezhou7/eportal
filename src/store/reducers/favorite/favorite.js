const { Map, fromJS } = require('epimmutable');
const domain = require('../../domain');
const cache = require('~/src/cache');
const { createMultiRemoteActionsReducer } = require('epui-reducer');


const config = {
  getFavoritePorts: '$setPorts',
  getFavoriteShips: '$setShips',
  addFavoritePort: '$addPort',
  addFavoriteShip: '$addShip',
  removeFavoriteById: '$remove'
}

const reducer = createMultiRemoteActionsReducer('Favorites', config, true);

module.exports = reducer;
