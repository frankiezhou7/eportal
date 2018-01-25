const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class Currencies extends BasePageable {
  constructor() {
    super();
  }
}
Currencies.modelName = 'Currencies';
Currencies.ENTRY_TYPE = 'Currency';

module.exports = Currencies;
