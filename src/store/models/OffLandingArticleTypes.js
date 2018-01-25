const _ = require('eplodash');
const Base = require('./Base');
const BasePageable = require('./BasePageable');

class OffLandingArticleTypes extends BasePageable {
  constructor() {
    super();
  }
}
OffLandingArticleTypes.modelName = 'OffLandingArticleTypes';
OffLandingArticleTypes.ENTRY_TYPE = 'OffLandingArticleType';

module.exports = OffLandingArticleTypes;
