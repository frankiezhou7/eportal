'use strict';

var webpack = require('webpack');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var git = require('git-rev-sync');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var ForceCaseSensitivePlugin = require('force-case-sensitivity-webpack-plugin');

var Dashboard = require('webpack-dashboard');
var DashboardPlugin = require('webpack-dashboard/plugin');
var dashboard = new Dashboard();

var ENV = process.env;
var VERSION = require('./package.json').version;

var IS_LOCAL = argv.local;
var IS_PRD = argv.release;
var IS_STG = argv.staging;
var IS_TST = argv.test;
var IS_DEV = !IS_PRD && !IS_STG && !IS_TST;
var DEBUG = IS_DEV;
var COMMIT_HASH = git.short();
var NO_HOT = !!argv.nohot || !DEBUG;
var LOCALE = argv.locale || 'zh-Hans-CN';

var HOST = argv.host || ENV.EP_SVC_HOST;
var GATEWAY = argv.gateway ||
(
  IS_LOCAL ? 'http://' + HOST + ':20000' :
  IS_PRD ? 'https://portal.e-ports.com/api/' :
  IS_STG ? 'http://staging.e-ports.com/api/' :
  IS_TST ? 'http://test.e-ports.com/api/' :
  'http://dev.e-ports.com/api/'
);

global.DEBUG = DEBUG;

var BUILD_PATH = path.join(__dirname, IS_PRD ? 'production' : IS_STG ? 'staging' :  IS_TST ? 'test' : 'development', LOCALE);

var AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
  '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
  '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';

var piDefine = new webpack.DefinePlugin({
  'process.env.NODE_ENV': DEBUG ? '\"development\"' : '\"production\"',
  'DEBUG': DEBUG,
  '__SERVER__': false,
  '__LOCALE__': '"' + LOCALE + '"',
  '__LANG__': '"' + LOCALE.substr(0, 2) + '"',
  '__HOST__': '"' + HOST + '"',
  '__GATEWAY__': '"' + GATEWAY + '"',
  '__VERSION__': '"' + VERSION + '"',
  '__COMMIT__': '"' + COMMIT_HASH + '"'
});

var piUglify = new webpack.optimize.UglifyJsPlugin({
  minimize: true,
  sourceMap: false,
  mangle: false,
  compress: {
    warnings: false,
  }
});
var piAggressiveMerging = new webpack.optimize.AggressiveMergingPlugin();
var piDebupe = new webpack.optimize.DedupePlugin();
var piHotModuleRepalcement = new webpack.HotModuleReplacementPlugin();
// Allows error warninggs but does not stop compiling. Will remove when eslint is added
var piNoErrorsPlugin = new webpack.NoErrorsPlugin();
var piOccurenceOnce = new webpack.optimize.OccurenceOrderPlugin();
var piOpenBrowserPlugin = new OpenBrowserPlugin({url: `http://localhost:3000/${LOCALE}/`});
var piDashboard = new DashboardPlugin(dashboard.setData);
var piForceCaseSensitivePlugin = new ForceCaseSensitivePlugin();

var plugins = require('./webpack.config.replaces')
.concat(!NO_HOT ? [ piHotModuleRepalcement, piNoErrorsPlugin, piDashboard, piOpenBrowserPlugin ] : [ piDebupe ])
.concat([ piDefine, piOccurenceOnce, piForceCaseSensitivePlugin ]);

var entry = (!NO_HOT ? [
  'webpack/hot/dev-server',
  'webpack/hot/only-dev-server'
] : []).concat([
  path.join(__dirname, '/src/app/app.jsx'),
]);

console.log(`\nDEBUG=${DEBUG}, LOCALE=${LOCALE}, NO_HOT=${NO_HOT} GATEWAY_URL=${GATEWAY}, PLUGINS=${plugins.length}\n`);
console.log(`\nBUILD_PATH=${BUILD_PATH}\n`);

var config = {
  output: {
    filename: 'app.js',
    path: BUILD_PATH,
    publicPath: NO_HOT ? './' : '/' + LOCALE + '/',
  },
  config: DEBUG,
  cache: DEBUG,
  // Configuration for dev server
  devServer: {
    contentBase: BUILD_PATH,
    filename: 'app.js',
    historyApiFallback: true,
    hot: true,
    inline: true,
    port: 3000,
    publicPath: NO_HOT ? './' : '/' + LOCALE + '/',
    stats: { colors: true },
    proxy: {
      "*": {
        target: `http://localhost:3000/`,
        bypass: function(req) {
          var parts = req.url.split('/');
          if(parts.length <= 3) { return req.url; }

          return '/' + parts[1] + '/' + parts[parts.length - 1];
        },
      }
    }
  },
  devtool: 'eval', //DEBUG ? 'eval' : false,
  debug: DEBUG,
  entry: entry,
  stats: {
    colors: true,
    reason: DEBUG,
    times: true
  },
  node: {
    console: true,
    global: true,
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'epui-md': path.resolve(__dirname, 'node_modules/epui-md/src'),
      'epui-rich-editor': path.resolve(__dirname, 'node_modules/epui-rich-editor/lib'),
    },
  },
  plugins: plugins,
  externals: {},
  eslint: {
    configFile: path.join(__dirname, '.eslintrc'),
    failOnWarning: false,
    failOnError: false,
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        loader: 'eslint-loader'
      }
    ],
    loaders: [{
      test: /\.css$/,
      loader: 'style!css?minimize!' + AUTOPREFIXER_LOADER
    }, {
      test: /\.less$/,
      loader: 'style!css?minimize!' + AUTOPREFIXER_LOADER +'!less'
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.jsx?$/,
      include: [
        path.resolve(__dirname, 'src'),
        /\/epui\-md\//,
        /\/ep\-api\-auth\//,
        /\/ep\-api\-epds\//,
        /\/ep\-api\-event\//,
        /\/ep\-api\-order\//,
        /\/ep\-api\-user\//,
        /\/epsvc\-api\//,
      ],
      exclude: [
        /\/epui\-md\/node_modules\//
      ],
      loaders: (NO_HOT ? [] : [ 'react-hot' ]).concat([ 'babel?compact=false' ]),
    }, {
      test: /\.(gif|jpg|png)$/,
      loader: 'file'
    }, {
      test: /\.(woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file'
    }]
  },
  resolveLoader: {
    root: path.join(__dirname, "node_modules")
  }
};

module.exports = config;
