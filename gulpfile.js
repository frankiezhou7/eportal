const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const runSequence = require('run-sequence');
const $ = require('gulp-load-plugins')();
const argv = require('minimist')(process.argv.slice(2));

const exec = require('child_process').exec;
const PORT = 3000;

const IS_PRD = argv.release;
const IS_STG = argv.staging;
const IS_TST = argv.test;
const IS_DEV = !IS_PRD && !IS_STG && !IS_TST;
const IS_OPEN_BROWSER = argv.open;

const LOCALE = argv.locale || 'zh-Hans-CN';

const DEBUG = (process.env.NODE_ENV === 'production' || IS_PRD || IS_STG || IS_TST) ? false : true;

const dest = IS_PRD ? './production' : IS_STG ? './staging' : IS_TST ? './test' : './development';
const src = ['./src/**/*.js', './src/**/*.jsx'];

const pkg = require('./package.json');
const NAME = pkg.name;
const VERSION = pkg.version;

gulp.task('clean', del.bind(null, [dest], {
  dot: true
}));

gulp.task('static', function() {
  return gulp
    .src(['./src/statics/**/*'])
    //.pipe($.changed(dest))
    .pipe(gulp.dest(dest));
});

gulp.task('bundle', function(cb) {
  var started = false;
  var config = require('./webpack.config');
  var bundler = webpack(config);

  var bundle = function(err, stats) {
    if (err) {
      $.util.PluginError('webpack', err);
    }

    $.util.log('[webpack]', stats.toString({
      colors: true
    }));

    if (!started) {
      started = true;
      return cb(err);
    }

    cb(err);
  };

  bundler.run(bundle);
});

gulp.task('build', function(cb) {
  runSequence(
    ['static', 'bundle'],
    'size',
    function(err) {
      cb(err);
    }
  );
});

gulp.task('size', function(cb) {
  gulp
  .src([dest + '/**/*', '!' + dest + '**/*.map'])
  .pipe($.size({
    gzip: false,
    title: 'origin size'
  }))
  .pipe($.size({
    gzip: true,
    title: 'final size'
  }))
  .pipe(gulp.dest('./temp'))
  .on('end', function() {
    del('./temp', {
      dot: true
    });
    cb();
  });
});

gulp.task('serve', ['static'], function(cb) {
  var config = require('./webpack.config');

  new WebpackDevServer(webpack(config), {
    // webpack-dev-middleware options
    contentBase: config.output.path,
    filename: config.output.filename,
    publicPath: config.output.publicPath,
    quiet: true,
    hot: true,
    historyApiFallback: true,
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
  }).listen(PORT, null, function (err, result) {
    if (err) {
      console.log(err);
    }

    if (IS_OPEN_BROWSER) {
      var cmd = `open http://localhost:${PORT}/${LOCALE}/`;
      exec(cmd, function (err, stdout, stderr) {
        if (err) {
          console.log(err);
        }
      });
    }

    cb();

    console.log(`\nListening at 0.0.0.0:${PORT}\n`);
  });
});

gulp.task("name", function() {
  console.log(NAME);
});

gulp.task("version", function() {
  console.log(VERSION);
});

gulp.task('default', ['serve']);
