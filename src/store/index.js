const { createStore, compose, combineReducers, applyMiddleware } = require('redux');
const { routerMiddleware } = require('react-router-redux');
const thunk = require('redux-thunk').default;

const create = compose(
  applyMiddleware(thunk),
  applyMiddleware(routerMiddleware(global.tools.history)),
  window.devToolsExtension && DEBUG ? window.devToolsExtension() : f => f
)(createStore);

const store = create(require('./reducers'), require('./initial'));

// store.dispatch({
//
// })
// if (module.hot) {
//   module.hot.accept('./reducers', () => {
//     const nextReducer = require('./reducers');
//     store.replaceReducer(nextReducer);
//   });
// }

module.exports = store;
