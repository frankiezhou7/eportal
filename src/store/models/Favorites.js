const _ = require('eplodash');
const Base = require('./Base');


class Favorites extends Base {
  ships = undefined;
  ports = undefined;

  constructor() { super(); }

  isFavoritePort(portId) {
    if(!this.ports) { return false; }
    return !!this.ports.find(p => p.id === portId);
  }

  isFavoriteShip(shipId) {
    if(!this.ships) { return false; }
    return !!this.ships.find(s => s.id === shipId);
  }

  getFavoriteShips() {
    global.api.epds.getFavoriteShips();
  }

  getFavoritePorts() {
    global.api.epds.getFavoritePorts();
  }

  addFavoriteShip(targetId, targetName) {
    global.api.epds.addFavoriteShip(targetId, targetName);
  }

  addFavoritePort(targetId, targetName) {
    global.api.epds.addFavoritePort(targetId, targetName);
  }

  removeFavorite(favId) {
    global.api.epds.removeFavoriteById(favId);
  }

  removeFavoritePort(portId) {
    if(!this.ports) { return; }
    const f = this.ports.find(p => p.id === portId);
    if(!f) { return; }

    global.api.epds.removeFavoriteById(f._id);
  }

  removeFavoriteShip(shipId) {
    if(!this.ships) { return; }
    const f = this.ships.find(s => s.id === shipId);
    if(!f) { return; }

    global.api.epds.removeFavoriteById(f._id);
  }

  $setPorts(favs) {
    if (!favs) { return this; }

    return this.withMutations(s => {
      s.set('ports', this.domain.toList(favs, 'Favorite'));
    });
  }

  $setShips(favs) {
    if (!favs) { return this; }

    return this.withMutations(s => {
      s.set('ships', this.domain.toList(favs, 'Favorite'));
    });
  }

  $addShip(fav) {
    if (!fav) { return this; }

    return this.withMutations(s => {
      if(!s.ships) { s.set('ships', this.domain.create('List')); }
      s.set('ships', s.ships.push(this.domain.create('Favorite', fav)));
    });
  }

  $addPort(fav) {
    if (!fav) { return this; }

    return this.withMutations(s => {
      if(!s.ports) { s.set('ports', this.domain.create('List')); }
      s.set('ports', s.ports.push(this.domain.create('Favorite', fav)));
    });
  }

  $remove(fav) {
    if(!this.ships && !this.ports) { return this; }

    let fid = fav && (fav._id || fav.get('_id'));
    if(!fid) { return this; }

    let idx, s = this.asMutable();

    idx = s.ships.findIndex(f => f.get('_id') === fid);
    if(idx >= 0) {
      s.set('ships', s.ships.remove(idx));
      return s.asImmutable();
    }

    idx = s.ports.findIndex(f => f.get('_id') === fid);
    if(idx >= 0) {
      s.set('ports', s.ports.remove(idx));
      return s.asImmutable();
    }

    return s.asImmutable();
  }

}

Favorites.modelName = 'Favorites';

Favorites.fromJS = function(obj) {
  if(!obj) { return obj; }

  let favs = {
    ships: null,
    ports: null,
  };

  if(_.isArray(obj.ships)) {
    favs.ships = this.domain.toList(obj, 'Favorite');
  }

  if(_.isArray(obj.ports)) {
    favs.ports = this.domain.toList(obj, 'Favorite');
  }

  favs = this.domain.fromJS(favs);
  let Type = this;
  return new Type(favs, true);
};

module.exports = Favorites;
