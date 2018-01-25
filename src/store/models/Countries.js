const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class Countries extends BasePageable {
  constructor() { super(); }
}
Countries.modelName = 'Countries';
Countries.ENTRY_TYPE = 'Country';

module.exports = Countries;
