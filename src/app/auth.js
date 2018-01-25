const store = require('../store');

function isInitialized() {
  let session = store.getState().get('session');
  return !!session.get('user');
}

function isLoggedIn() {
  let session = store.getState().get('session');
  return !!session.getIn(['user', '_id']);
}

function hasPosition() {
  let session = store.getState().get('session');
  return isInitialized() && isLoggedIn() && !!session.getIn(['user', 'position', '_id']);
}

function isAllowed() {
  let session = store.getState().get('session');
  return session.getIn(['account', 'types']) && (session.getIn(['account', 'types', 0]) === 'e-ports' || session.getIn(['account', 'types', 0]) === 'eports');
}

module.exports = function() {
  return new Promise(function(res, rej) {
    return res({
      loggedIn: isInitialized() && isLoggedIn() && hasPosition(),
      authorization: isAllowed(),
    });
  });
};
