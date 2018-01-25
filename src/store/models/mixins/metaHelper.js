const _ = require('eplodash');

module.exports = function(inst) {
  if(!inst || !inst.getMeta) {
    return null;
  }

  let loading = inst.getMeta('loading');
  let op = inst.getMeta('operation');
  let err = inst.getMeta('error');
  let actions = inst.getMeta('actions');
  let hasAction = function(actName) {
    return _.find(actions, a=>a===actName);
  }
  let isDoing = function(actName) {
    return loading && !!hasAction(actName);
  };

  return {
    actions: actions,
    error: err,
    hasAction: hasAction,
    isDoing: isDoing,
    loading: loading,
    operation: op,
  }
};
