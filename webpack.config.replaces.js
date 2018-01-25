const webpack = require('webpack');

const reSrc = /^(.*!)?~\/src\/(.*)$/;
const reReact = /^react\/(.*)$/;
const reReactDom = /^react\-dom\/(.*)$/;
const reReactAddons = /^react\-addons\-(.*)$/;
const reAlt = /^epui-alt(.*)$/;
const reAPI = /^epsvc\-api\/(.*)$/;

module.exports = [
  new webpack.NormalModuleReplacementPlugin(reSrc, function(res) { var p = reSrc.exec(res.request); res.request = (p[1] || '') + __dirname + '/src/' + p[2]; }),
  new webpack.NormalModuleReplacementPlugin(reReact, function(res) { res.request = __dirname + '/node_modules/react/' + reReact.exec(res.request)[1]; }),
  new webpack.NormalModuleReplacementPlugin(reReactDom, function(res) { res.request = __dirname + '/node_modules/react-dom/' + reReactDom.exec(res.request)[1]; }),
  new webpack.NormalModuleReplacementPlugin(reReactAddons, function(res) { res.request = __dirname + '/node_modules/react-addons-' + reReactAddons.exec(res.request)[1]; }),
  new webpack.NormalModuleReplacementPlugin(reAPI, function(res) { res.request = __dirname + '/node_modules/epsvc-api/' + reAPI.exec(res.request)[1]; }),

  new webpack.NormalModuleReplacementPlugin(/^react$/, __dirname + '/node_modules/react'),
  new webpack.NormalModuleReplacementPlugin(/^react-hot/, __dirname + '/node_modules/react-hot-loader'),
  new webpack.NormalModuleReplacementPlugin(/^react-dom$/, __dirname + '/node_modules/react-dom'),
  new webpack.NormalModuleReplacementPlugin(/^eplodash$/, __dirname + '/node_modules/eplodash'),
  new webpack.NormalModuleReplacementPlugin(/^epui-intl$/, __dirname + '/node_modules/epui-intl'),
  new webpack.NormalModuleReplacementPlugin(/^moment$/, DEBUG ? 'moment/moment.js' : 'moment/min/moment.min.js'),
];
