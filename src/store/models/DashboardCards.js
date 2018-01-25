const _ = require('eplodash');
const Base = require('./Base');


class DashboardCards extends Base {
  entries = undefined;

  constructor() { super(); }
}
DashboardCards.modelName = 'DashboardCards';
DashboardCards.fromJS = function(obj) {
  if(!obj) { return obj; }

  let types = {
    entries: null,
  };

  if(_.isArray(obj)) {
    types.entries = this.domain.toList(obj, 'DashboardCard');
  }

  types = this.domain.fromJS(types);
  let Type = this;
  return new Type(types, true);
};

module.exports = DashboardCards;
