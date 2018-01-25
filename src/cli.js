const _ = require('eplodash');
const TYPE_PREFIX = 'CLI/';

function wrap(dispatch) {
  global.cli = {
    initial: wrapActionsObject(require('~/src/store/actions/initial'), dispatch),
    navigation: wrapActionsObject(require('~/src/store/actions/navigation'), dispatch),
    session: wrapActionsObject(require('~/src/store/actions/session'), dispatch),
    user: wrapActionsObject(require('~/src/store/actions/user'), dispatch),
  };

  debug(`已加载本地API：${Object.keys(global.cli)}`);
  return global.cli;
};

function wrapActionsObject(Raw, dispatch) {
  let cli = {};

  _.forIn(Raw, (o, name) => {
    if(_.isFunction(o)) {
      cli[name] = (...args) => dispatch(o(...args));
      return;
    }

    if(!_.isArray(o)) {
      cli[name] = o;
      return;
    }

    const src = 'client';
    const type = _.toUpper(_.snakeCase(name));
    const argNames = o;

    cli[type] = TYPE_PREFIX + type;
    cli[name] = (...args) => {
      let payload = argNames.length <= 1 ? args[0] : _.zipObject(argNames, args);
      return dispatch({ type: cli[type], payload, src });
    };

  });

  return cli;
}

module.exports = wrap;
