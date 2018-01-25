import _ from 'eplodash';
import invariant from 'fbjs/lib/invariant';
import warning from 'fbjs/lib/warning';
import agent from './agent';
import issues from './client-issues';
import moment from 'moment';


const PRESERVED = ['arguments', 'caller', 'constructor', 'length', 'prototype'];
const PREFIX = _.compact(global.location.pathname.split('/'))[0];

export function normalizeDomain(domain) {
  return _.upperFirst(_.camelCase(domain));
}

export function assignFunctions(from, to) {
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

export function mergeFunctions(From, To) {
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

export function wrapAPI(Raw, dispatch) {
  let api = new Raw(agent);

  _.forIn(Raw.prototype, (func, name) => {
    if(!_.isFunction(func)) { return null; }
    let TYPE = _.toUpper(_.snakeCase(name));
    let LOADING = `${TYPE}_LOADING`;
    let FAIL = `${TYPE}_FAIL`;

    let bound = func.bind(api);

    let action = function() {
      let args = arguments;
      let request = Raw.normalize(name, args).body;
      dispatch({ type: LOADING, payload: { request }});
      bound.apply(null, args).then(
        response => dispatch({ type: TYPE, payload: { request, response: response.response } }),
        error => dispatch({ type: FAIL, payload: { request, error } })
      );
    };
    action.displayName = name;
    action.promise = bound;

    api[name] = action;
  });

  return api;
};

export function isPrimitive(obj) {
  return _.isString(obj) || _.isBoolean(obj) || _.isNumber(obj);
}

export function getSubPath(sub) {
  sub = _.isString(sub) ? sub : '';
  let segs = _.compact(sub.split('/'));
  if(PREFIX && PREFIX !== '' && segs[0] !== PREFIX) {
    segs.unshift(PREFIX);
  }
  return '/' + segs.join('/');
}

export function getSubPathComponents(sub, all) {
  sub = _.isString(sub) ? sub : '';
  let segs = _.compact(sub.split('/'));
  if(!all && PREFIX && PREFIX !== '' && segs[0] === PREFIX) {
    segs.shift();
  }
  return segs;
}

export function formatDate(data,format){
  format = format || 'YYYY-MM-DD HH:mm:ss';
  if(!data) return '';
  return moment(data).format(format);
}

export function displayWithLimit(str,number){
  if(!str) return ' - ';
  if(!number) return str;
  return str.length>number ? str.substring(0,number)+'...': str;
}
