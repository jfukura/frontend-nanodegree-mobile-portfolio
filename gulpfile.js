
var gulp        = require('gulp'),
    imagemin    = require('gulp-imagemin'),
    cssmin      = require('gulp-cssmin'),
    htmlmin     = require('gulp-htmlmin'),
    inline      = require('gulp-inline'),
    minline     = require('gulp-minify-inline'),
    // uglify      = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    serve       = require('gulp-serve'),
    psi         = require('psi'),
    ngrok       = require('ngrok'),
    sequence    = require('run-sequence');

var config      = {
  "build": "dist",
  "images": {
    "source": "img/*",
    "target": "/img",
    "views": "images/"
  },
  "css": {
    "source": "css/*",
    "target": "/css"
  },
  "js": {
    "source": "js/*",
    "target": "/js"
  },
  "html": {
    "source": "*.html",
    "target": "/"
  },
  "views": {
    "images": {
      "source": "views/images/*",
      "target": "/views/images"
    },
    "html": {
      "source": "views/*.html",
      "target": "/views"
    },
    "css": {
      "source": "views/css/*",
      "target": "/views/css"
    },
    "js": {
      "source": "views/js/*",
      "target": "/views/js"
    }
  }
    },
    site        = '',
    portVal     = 3000;

gulp.task('views-css', function () {
  return gulp.src(config.views.css.source)
  .pipe(cssmin())
  .pipe(gulp.dest(config.build + config.views.css.target));
});

gulp.task('views-html', function () {
  return gulp.src(config.views.html.source)
    // .pipe(inline())
    .pipe(htmlmin({collapseWhitespace: true}))
    // .pipe(minline())
  .pipe(gulp.dest(config.build + config.views.html.target));
});

gulp.task('views-js', function () {
  return gulp.src(config.views.js.source)
  // .pipe(uglify())
  .pipe(gulp.dest(config.build + config.views.js.target));
});

gulp.task('views-img', function() {
  return gulp.src(config.views.images.source)
    .pipe(imagemin({
      progressive: true,
    }))
  .pipe(gulp.dest(config.build + config.views.images.target));
});

gulp.task('css', function () {
  return gulp.src(config.css.source)
  .pipe(cssmin())
  .pipe(gulp.dest(config.build + config.css.target));
});

gulp.task('html', function () {
  return gulp.src(config.html.source)
  .pipe(inline())
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(minline())
  .pipe(gulp.dest(config.build + config.html.target));
});

gulp.task('js', function () {
  return gulp.src(config.js.source)
  // .pipe(uglify())
  .pipe(gulp.dest(config.build + config.js.target));
});

gulp.task('img', function() {
  return gulp.src(config.images.source)
  .pipe(imagemin({
    progressive: true,
  }))
  .pipe(gulp.dest(config.build + config.images.target));
});

gulp.task('build', ['html','css','js','img','views-html','views-css','views-js']);

gulp.task('ngrok-url', function(cb) {
  return ngrok.connect(portVal, function (err, url) {
    site = url + '/dist/';
    console.log('serving your tunnel from: ' + site);
    cb();
  });
});

gulp.task('psi-mobile', function () {
    return psi(site, {
        // key: key
        nokey: 'true',
        strategy: 'mobile',
    }).then(function (data) {
        console.log(site);
        console.log(data.pageStats);
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
    });
});

gulp.task('psi-desktop', function () {
    return psi(site, {
        nokey: 'true',
        strategy: 'desktop',
    }).then(function (data) {
        console.log(site);
        console.log(data.pageStats);
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
    });
});

// psi sequence with 'browser-sync-psi' instead
gulp.task('psi-seq', function (cb) {
  return sequence(
    // 'build',
    'serve',
    'ngrok-url',
    'psi-desktop',
    'psi-mobile',
    cb
  );
});

// psi task runs and exits
gulp.task('psi', ['psi-seq'], function() {
  process.exit();
});

// // Watch Files For Changes & Reload
gulp.task('serve', function() {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', '']
  });

  gulp.watch(['*.html'], reload);
  gulp.watch(['css/*.{scss,css}'], reload);
  gulp.watch(['js/*.js','app/styleguide/**/*.js'], reload);
  gulp.watch(['img/**/*'], reload);

});