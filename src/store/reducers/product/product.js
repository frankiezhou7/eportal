const { Map, fromJS } = require('epimmutable');
const {createMultiRemoteActionsReducer} = require('epui-reducer');

const Config = {
  allProducts: {
    'getProducts': null,
  },
  products: {
    'findMainProducts': null,
  },
  subProducts: {
    'findSubProductsById': null,
  },
};

const allProductsReducer = createMultiRemoteActionsReducer('List<Product>', Config.allProducts, true);
const productsReducer = createMultiRemoteActionsReducer('List<Product>', Config.products, true);
const subProductsReducer = createMultiRemoteActionsReducer('List<Product>', Config.subProducts, true);

module.exports = function product_reducer(state = Map(), action) {
  return state.withMutations(s => {
    s.set('allProducts', allProductsReducer(s.get('allProducts'), action));
    s.set('products', productsReducer(s.get('products'), action));
    s.set('subProducts', subProductsReducer(s.get('subProducts'), action));
  });
}
