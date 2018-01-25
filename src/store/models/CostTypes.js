const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class CostTypes extends BasePageable {
  constructor() {
    super();
  }
}
CostTypes.modelName = 'CostTypes';
CostTypes.ENTRY_TYPE = 'CostType';

module.exports = CostTypes;
