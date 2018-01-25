const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class PurchaseArticleTypes extends BasePageable {
  constructor() {
    super();
  }
}
PurchaseArticleTypes.modelName = 'PurchaseArticleTypes';
PurchaseArticleTypes.ENTRY_TYPE = 'PurchaseArticleType';

module.exports = PurchaseArticleTypes;
