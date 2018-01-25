const _ = require('eplodash');
const { List, Map, Record } = require('epimmutable');
const utils = require('../../utils');

class Base {
  _id = undefined;
  __v = undefined;

  constructor() { }

  getId() {
    return this._id;
  }

  getError() {
    return this.getMeta('error') || null;
  }

  isLoading() {
    return !!this.getMeta('loading');
  }

  $merge(src) {
    if(!src || !src.forEach) {
      return this;
    }

    let rec = this.asMutable();

    src.forEach((v, k) => {
      if(_.isUndefined(v)) { return; }
      rec.set(k, v);
    });

    return rec.asImmutable();
  }
}

Base.Empty = function() {
  let Type = this;
  return new Type(null, true);
};

module.exports = Base;
