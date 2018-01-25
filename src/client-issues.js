require('../modernizr');

var CLIENT_ENV = 0;

const COOKIE_NOT_SUPPORTED = 1 << 0;
const STORAGE_NOT_SUPPORTED = 1 << 1;
const SVG_NOT_SUPPORTED = 1 << 2;
const HISTORY_NOT_SUPPORTED = 1 << 3;
const BROWSER_NOT_COMPATIBLE = 1 << 10;

if(!Modernizr.cookies) {
  CLIENT_ENV = CLIENT_ENV | COOKIE_NOT_SUPPORTED;
}
if(!Modernizr.localstorage) {
  CLIENT_ENV = CLIENT_ENV | STORAGE_NOT_SUPPORTED;
}
if(!Modernizr.svg) {
  CLIENT_ENV = CLIENT_ENV | SVG_NOT_SUPPORTED;
}

if(!Modernizr.history) {
  CLIENT_ENV = CLIENT_ENV | HISTORY_NOT_SUPPORTED;
}

module.exports = {
  cookies: CLIENT_ENV & COOKIE_NOT_SUPPORTED,
  localstorage: CLIENT_ENV & STORAGE_NOT_SUPPORTED,
  svg: CLIENT_ENV & SVG_NOT_SUPPORTED,
  history: CLIENT_ENV & HISTORY_NOT_SUPPORTED,
  issues: CLIENT_ENV
};
