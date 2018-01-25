const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class SeaManClasses extends BasePageable {
  constructor() {
    super();
  }
}
SeaManClasses.modelName = 'SeaManClasses';
SeaManClasses.ENTRY_TYPE = 'SeaManClass';

module.exports = SeaManClasses;
