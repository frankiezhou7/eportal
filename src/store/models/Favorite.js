const _ = require('eplodash');
const Base = require('./Base');


class Favorite extends Base {
  _id = undefined;
  id = undefined;
  name = undefined;

  constructor() {
    super();
  }
}

Favorite.modelName = 'Favorite';

Favorite.fromJS = function(obj) {
  if(!obj) { return obj; }

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
};

module.exports = Favorite;
