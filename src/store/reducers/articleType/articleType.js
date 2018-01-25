const { List, Map, fromJS } = require('epimmutable');
const cache = require('~/src/cache');
const domain = require('../../domain');
const {createMultiRemoteActionsReducer} = require('epui-reducer');

const Config = {
  purchaseArticleType: {
    'getPurchaseArticleTypes': function(entity, payload) {
      cache.set(cache.PURCHASE_ARTICLE_TYPE, payload.response);
      entity = domain.create('List<PurchaseArticleType>', payload.response)
        .setMetas('loading', false, 'error', null);
      return entity;
    }
  },
  offLandingArticleType: {
    'getOffLandingArticleTypes': function(entity, payload) {
      cache.set(cache.OFF_LANDING_ARTICLE_TYPE, payload.response);
      entity = domain.create('List<OffLandingArticleType>', payload.response)
        .setMetas('loading', false, 'error', null);
      return entity;
    }
  },
};

const purchaseArticleTypeReducer = createMultiRemoteActionsReducer('List<PurchaseArticleType>', Config.purchaseArticleType, true);
const offLandingArticleTypeReducer = createMultiRemoteActionsReducer('List<OffLandingArticleType>', Config.offLandingArticleType, true);

module.exports = function ariticle_type_reducer(state = Map(), action) {
  return state.withMutations(s => {
    s.set('purchaseArticleType', purchaseArticleTypeReducer(s.get('purchaseArticleType'), action));
    s.set('offLandingArticleType', offLandingArticleTypeReducer(s.get('offLandingArticleType'), action));
  });
}
