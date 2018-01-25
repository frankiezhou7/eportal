const cookies = require('cookies-js');
const issues = require('./client-issues');
const localStore = require('store');
const { Map } = require('epimmutable');

const COST_TYPE_LIST = 'COST_TYPE_LIST';
const COUNTRY_ENTRIES = 'COUNTRY_ENTRIES';
const COUNTRY_LIST = 'COUNTRY_LIST';
const CURRENCY_LIST = 'CURRENCY_LIST';
const DEVICE_ID = 'DEVICE_ID';
const GUIDES_SWITCHES = 'GUIDES_SWITCHES';
const HIDE_WELCOME_SPLASH = 'HIDE_WELCOME_SPLASH';
const INVITATION_LETTER_TYPES = 'INVITATION_LETTER_TYPES';
const ISSUING_AUTHORITY = 'ISSUING_AUTHORITY';
const LOCAL = 'LOCAL';
const OFF_LANDING_ARTICLE_TYPE = 'OFF_LANDING_ARTICLE_TYPE';
const ORG_ROLES = 'ORG_ROLES';
const PAYLOAD_TYPE_LIST = 'PAYLOAD_TYPE_LIST';
const PI_CLUBS = 'PI_CLUBS';
const PORT_TYPES = 'PORT_TYPES';
const PURCHASE_ARTICLE_TYPE = 'PURCHASE_ARTICLE_TYPE';
const REMEMBER_ME = 'REMEMBER_ME';
const SEAMAN_CLASSES = 'SEAMAN_CLASSES';
const SESSION_ID = 'SESSION_ID';
const SESSION_TOKEN = 'SESSION_TOKEN';
const SHIP_SIZES = 'SHIP_SIZES';
const SHIP_STATUS = 'SHIP_STATUS';
const SHIP_TYPES = 'SHIP_TYPES';
const SHOW_FOCUS_GUIDES = 'SHOW_FOCUS_GUIDES';

const store = localStore.enabled ? localStore : {};

function getSessionToken() {
  if(issues.cookie || !localStore.enabled) { return 0; }
  return cookies.get(SESSION_TOKEN);
}

function ensureSessionToken() {
  if(issues.cookie || !localStore.enabled) { return; }

  let curr = cookies.get(SESSION_TOKEN);
  if(curr) { return; }

  let c = (get(SESSION_TOKEN) || 0) + 1;
  cookies.set(SESSION_TOKEN, c);
  set(SESSION_TOKEN, c);
  debug(`新会话令牌: ${c}`);
}

function get(key) {
  let raw = store.get ? store.get(key) : store[key];
  if(!raw) { return; }

  let itvl = raw.timeStamp - Date.now();

  if(raw.ttl === false) { return raw.value; } // 永久数据
  if(raw.token === getSessionToken()) { return raw.value; } // 会话数据
  if(raw.ttl > itvl) { return raw.value; } // 时效数据
  debug(`缓存过期: ${key}`);
  remove(key);
  return;
}

function set(key, value, ttl) { // ttl = seconds
  let raw = {};

  raw.key = key;
  raw.timeStamp = Date.now();
  raw.token = ttl === 0 ? getSessionToken() : null;
  raw.ttl = ttl === 0 ? ttl : (ttl || false);
  raw.value = value;

  store.set ? store.set(key, raw) : (store[key] = raw);
  debug(`缓存存入: ${key} (${raw.ttl})`);
}

function remove(key) {
  store.remove ? store.remove(key) : (delete store[key]);
  debug(`缓存移除: ${key}`);
}

//会话令牌在每次载入/新会话开始时更新
ensureSessionToken();

module.exports = {
  get,
  remove,
  set,
  COST_TYPE_LIST,
  COUNTRY_ENTRIES,
  COUNTRY_LIST,
  CURRENCY_LIST,
  DEVICE_ID,
  GUIDES_SWITCHES,
  HIDE_WELCOME_SPLASH,
  INVITATION_LETTER_TYPES,
  ISSUING_AUTHORITY,
  LOCAL,
  OFF_LANDING_ARTICLE_TYPE,
  ORG_ROLES,
  PAYLOAD_TYPE_LIST,
  PI_CLUBS,
  PORT_TYPES,
  PURCHASE_ARTICLE_TYPE,
  REMEMBER_ME,
  SEAMAN_CLASSES,
  SESSION_ID,
  SESSION_TOKEN,
  SHIP_SIZES,
  SHIP_STATUS,
  SHIP_TYPES,
  SHOW_FOCUS_GUIDES,
};
