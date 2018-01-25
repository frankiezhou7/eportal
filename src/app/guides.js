import _ from 'eplodash';
import cache, { SHOW_FOCUS_GUIDES, GUIDES_SWITCHES } from '~/src/cache';

const G_CONFIG = { _loaded: false };
const G_SWITCHES = cache.get(GUIDES_SWITCHES) || {};

let G_SHOW = cache.get(SHOW_FOCUS_GUIDES);

let promise = null;
let updater = null;

export function loadConfig() {
  if(promise) { return promise; }
  if(G_CONFIG._loaded) { return Promise.resolve(); }

  promise = require('promise?global!./guides-config')();

  promise.then(opts => {
    _.forEach(opts, (opt, name) => {
      opt.hide = _.has(G_SWITCHES, name) ? !G_SWITCHES[name] : false;
    });
    _.assign(G_CONFIG, opts);
    G_CONFIG._loaded = true;
    promise = null;
    if(updater) { updater(); }
    debug(`引导信息加载完成`, G_CONFIG);
  });

  return promise;
}

export function getConfig() {
  return G_CONFIG;
}

export function isLoading() {
  return !!promise;
}

export function isLoaded() {
  if(isLoading()) { return false; }
  return G_CONFIG._loaded;
}

export function getSwitches() {
  return G_SWITCHES;
}

export function isVisible() {
  return G_SHOW;
}

export function toggleVisible(flag) {
  G_SHOW = flag;
  cache.set(SHOW_FOCUS_GUIDES, flag);

  if(G_SHOW && !isLoaded()) {
    loadConfig();
  } else {
    updater();
  }
}

export function switchElement(name, flag) {
  const opt = G_CONFIG[name];
  if(opt) { opt.hide = !flag; }

  G_SWITCHES[name] = flag;
  cache.set(GUIDES_SWITCHES, G_SWITCHES);
}

export function setUpdater(func) {
  updater = func;
}
