(function () {

  global.debug = DEBUG ? console.log.bind(console) : ()=>{};

  require('es6-shim');
  require('./handle-error');

  require('epui-intl').setLocale(__LOCALE__);
  require('../statics/' + __LOCALE__ + '/css/font.css');
  require('../statics/' + __LOCALE__ + '/css/main.css');

  // 判断/使用history类型
  const issues = require('~/src/client-issues');
  const { hashHistory, browserHistory } = require('react-router');
  const history = issues.history ? hashHistory : browserHistory;

  // 路径处理
  const { getSubPath } = require('~/src/utils');
  const toSubPath = function (sub, replace) {
    sub = getSubPath(sub);
    if(replace) {
      history.replace(sub);
    } else {
      history.push(sub);
    }
  };

  // 设置全局工具
  global.tools = { history, getSubPath, toSubPath };
  global.contentWidth = 960;
  global.appHeight = 56;

  // 实例化store
  const store = require('~/src/store');

  // 加载服务API及客户端API至global
  require('../api')(store.dispatch);
  require('../cli')(store.dispatch);

  const React = require('react');
  const { render } = require('react-dom');
  if(DEBUG) { global.React = React; }

  const injectTapEventPlugin = require('react-tap-event-plugin');
  injectTapEventPlugin();

  const AppRouter = require('./app-router');
  render(AppRouter, document.getElementById('main'));

})();
