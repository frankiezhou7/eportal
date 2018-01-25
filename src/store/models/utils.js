let _ = require('eplodash');
let invariant = require('fbjs/lib/invariant');
let warning = require('fbjs/lib/warning');

const PRESERVED = ['arguments', 'caller', 'constructor', 'length', 'prototype'];

function normalizeDomain(domain) {
  return _.upperFirst(_.camelCase(domain));
}

function assignFunctions(from, to) {
  let names = Object.getOwnPropertyNames(from);
  _.forEach(names, (name) => {
    if(name === 'ENTRY_TYPE' && !to.ENTRY_TYPE) {
      to.ENTRY_TYPE = from.ENTRY_TYPE;
      return;
    }
    if(_.includes(PRESERVED, name) || !_.isFunction(from[name])) { return; }
    to[name] = from[name];
  });
}

function mergeFunctions(From, To) {
  if(!From) { return To; }

  let Cls = From.prototype ? From : null;

  if(Cls) {
    assignFunctions(Cls, To);
  }

  let fromProto = From.prototype || From;
  let toProto = To.prototype || To;
  assignFunctions(fromProto, toProto);

  let proto = fromProto.__proto__;
  if(proto && proto.constructor !== Object) {
    return mergeFunctions(proto.constructor, To);
  }

  return To;
}

function isPrimitive(obj) {
  return _.isString(obj) || _.isBoolean(obj) || _.isNumber(obj);
}

module.exports = {
  normalizeDomain: normalizeDomain,
  mergeFunctions: mergeFunctions,
  isPrimitive: isPrimitive,
};
