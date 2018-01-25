const _ = require('eplodash');
const Base = require('./Base');

class Country extends Base {
  __v = undefined;
  _id = undefined;
  code = undefined;
  name = undefined;
  constructor() { super(); }
}
Country.modelName = 'Country';
module.exports = Country;
