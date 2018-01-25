const _ = require('eplodash');
const agent = require('./agent');

function wrap(dispatch) {
  global.api = {
    epds: wrapActionsObject(require('ep-api-epds'), dispatch),
    event: wrapActionsObject(require('ep-api-event'), dispatch),
    order: wrapActionsObject(require('ep-api-order'), dispatch),
    user: wrapActionsObject(require('ep-api-user'), dispatch),
    auth: wrapActionsObject(require('ep-api-auth'), dispatch),
    message: wrapActionsObject(require('ep-api-message'), dispatch),
    chatting: wrapActionsObject(require('ep-api-chatting'), dispatch)
  };

  debug(`已加载服务API：${Object.keys(global.api)}`);
  return global.api;
};

function wrapActionsObject(Raw, dispatch) {
  let api = new Raw(agent);

  _.forIn(Raw.prototype, (func, name) => {
    if(!_.isFunction(func)) { return null; }
    let src = 'remote';
    let TYPE = _.toUpper(_.snakeCase(name));
    let LOADING = `${TYPE}_LOADING`;
    let FAIL = `${TYPE}_FAIL`;

    let bound = func.bind(api);

    let action = function() {
      let args = arguments;
      let req = Raw.normalize(name, args);

      let request = req.body;
      let files = req.files;

      dispatch({ type: LOADING, payload: { request, files }, src });

      bound.apply(null, args).then(
        response => dispatch({ type: TYPE, payload: { request, files, response: response.response }, src }),
        error => dispatch({ type: FAIL, payload: { request, files, error }, src })
      );
    };
    action.displayName = name;
    action.promise = bound;

    api[LOADING] = LOADING;
    api[FAIL] = FAIL;
    api[TYPE] = TYPE;
    api[name] = action;
  });

  return api;
};

module.exports = wrap;
