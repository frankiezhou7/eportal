const _ = require('eplodash');
const { getSubPath } = global.tools;

const skips = [
  getSubPath('/demo'),
  getSubPath('/dev'),
  getSubPath('/notfound'),
  getSubPath('/login'),
  getSubPath('/reg'),
  getSubPath('/status'),
  getSubPath('/setPassword'),
  getSubPath('/retrieve'),
  getSubPath('/reset'),
  getSubPath('/faq'),
  //add by hanping -- start
  getSubPath('/dues'),
  getSubPath('/recommendations'),
  getSubPath('/port-data'),
  getSubPath('/organization-data'),
  getSubPath('/news-data'),
  getSubPath('/ship-data'),
  getSubPath('/line-up'),
  //add by hanping --end
];

const isSkipped = function(location) {
  return _.find(skips, p => _.startsWith(location.pathname, p));
}

module.exports = function AsyncLoader(promise) {
  return function(nextState, callback) {
    function goAhead() {
      promise().then(component => {
        callback(null, component);
      });
    }

    require('./auth')().then(({ loggedIn, authorization }) => {
      if(isSkipped(nextState.location)) { return goAhead(); }

      if(!loggedIn) {
        let path = nextState.location.pathname;
        debug(`未登录访问${path}，转向登录页`);
        global.tools.toSubPath(`/login?path=${path}`);
        callback();
        return;
      }
      if(!authorization) {
        let path = nextState.location.pathname;
        path = path.split('/')[2];
        if(path === 'manage') {
          global.tools.toSubPath('dashboard');
          callback();
          return;
        }
      }
      return goAhead();
    });
  }
}
