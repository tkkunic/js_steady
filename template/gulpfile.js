const config = require("./config");

const gulp              = require('gulp'),
      plumber           = require('gulp-plumber'), //エラー時の強制終了を防止
      notify            = require('gulp-notify'), //エラー発生時にデスクトップ通知する
      header            = require('gulp-header'),
      browserSync       = require('browser-sync'), //ブラウザ反映
      fs                = require('fs'),
      rename            = require("gulp-rename"), //.ejsの拡張子を変更
      sourcemaps        = require('gulp-sourcemaps'),
      mode              = require('gulp-mode')({
                          modes: ["publish", "development"],
                          default: "development",
                          verbose: false
                        }),
      isProduction      = mode.publish(),
      replace           = require('gulp-replace'); // gulp上で置換が行える

// html系
const ejs               = require("gulp-ejs"),
      data              = require('gulp-data'),
      prettify          = require('gulp-prettify'),
      convertEncoding   = require('gulp-convert-encoding'),
      htmlhint          = require('gulp-htmlhint');

// css系
const sass              = require('gulp-sass'), //Sassコンパイル
      postcss           = require('gulp-postcss'), //autoprefixerとセット
      autoprefixer      = require('autoprefixer'), //ベンダープレフィックス付与
      flexBugsFixes     = require('postcss-flexbugs-fixes'),
      mqpacker          = require('css-mqpacker');

// 画像系
const imagemin          = require("gulp-imagemin"),
      imageminMozjpeg   = require("imagemin-mozjpeg"),
      imageminPngquant  = require("imagemin-pngquant"),
      imageminSvgo      = require("imagemin-svgo");

// js系
const webpack = require("webpack");
const webpackStream = require("webpack-stream"); // gulpでwebpackを使うために必要なプラグイン
const webpackConfigDev = require('./webpack.dev'); // 開発環境のときに実行するwebpackのファイル
const webpackConfigProd = require('./webpack.prod'); // 本番環境のときに実行するwebpackのファイル
const webpackConfig = isProduction ? webpackConfigProd : webpackConfigDev; //本番か開発かどちらかを判断するためのもの

// data file
// ここにページで使うページ情報などのjsonファイルをオブジェクト形式で追加できる
const JSON_DATA = {
  "SITE_DATA": JSON.parse(fs.readFileSync(`${config.DATA.SRC}site.json`, 'utf-8')),
};

// サイトで使用するpathの設定
// [filePath]はルート総体にするか相対パスにするかを案件で決めてください。
// [srcPath]は主にincludeするcomponentsのパスに使うものです。
const htmlPathOptions = (file) => {
  const flagRootPath  = false;
  const absolutePath  = `${file.path.split('./src/')[file.path.split('./src/').length - 1].replace('.ejs', '.html').replace(/index\.html$/, '')}`,
        depth         = file.path.replace(/\\/g, '/').split('src/pages')[1].split('/').length - 2,
        filePath      = (flagRootPath === true) ? '/' : depth > 0 ? '../'.repeat(depth) : './',
        srcPath       = depth > 0 ? './' + ('../'.repeat(depth)) : './';
  return {
    absolutePath,
    filePath,
    srcPath,
  }
}

// html コンパイル
function htmls() {
  const lastRunResult = gulp.lastRun(htmls);
  return gulp.src([`${config.PAGES.SRC}**/*.ejs`, `!${config.PAGES.SRC}**/_*.ejs`], {since: lastRunResult})
  .pipe(plumber())
  .pipe(rename({
    extname: ".html",
  }))
  .pipe(
    data((file) => {
      const {absolutePath, filePath, srcPath} = htmlPathOptions(file)

      return {
        absolutePath,
        filePath,
        srcPath,
      }
    }),
  )
  .pipe(ejs(JSON_DATA))
  .pipe(
    prettify({
      indent_char: ' ',
      indent_size: 2,
      unformatted: ['a', 'span', 'br'],
    }),
  )
  .pipe(convertEncoding({to: "utf-8"}))
  .pipe(replace('<head(\s\S)*>', '<head>'))
  .pipe(gulp.dest(isProduction ? config.PAGES.PUBLISH : config.PAGES.DIST))

}

// バリデートHTML
// コンパイル後のhtmlのバリデートを行う
function validateHtml() {
  return gulp.src([isProduction ? `${config.PAGES.PUBLISH}**/*.html` : `${config.PAGES.DIST}**/*.html`])
  .pipe(htmlhint({
    "spec-char-escape": false, //特殊文字を使用しているか
    "attr-value-double-quotes": false, //ダブルクォーテーションを使用しているか
    "attr-lowercase": false //Attributeにlowercaseを使用しているか
  }))
  .pipe(htmlhint.reporter());
}

// Sassコンパイル
function styles() {
  return gulp.src([`${config.SCSS.SRC}**/*.scss`,`!${config.SCSS.SRC}**/_*.scss`])
  .pipe(mode.development(sourcemaps.init()))
  .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )//エラーチェック
  .pipe(sass({outputStyle: config.OUTPUT_STYLE}))
  .pipe(
    plumber({
      errorHandler: notify.onError('<%= error.message %>'),
    }),
  )
  .pipe(postcss([mqpacker()]))
  .pipe(postcss([
    flexBugsFixes,
    autoprefixer(
      {
        cascade: false,
        grid: "autoplace"
      }
    ),
  ]))
  .pipe(replace(/@charset "UTF-8";/g, ''))
  .pipe(header('@charset "UTF-8";\n\n'))
  .pipe(mode.development(sourcemaps.write('./_sourcemaps')))
  .pipe(gulp.dest(isProduction ? config.SCSS.PUBLISH : config.SCSS.DIST))
}

// minimageコンパイル
function minimage() {
  const lastRunResult = gulp.lastRun(minimage);
  return gulp.src([`${config.IMAGE.SRC}**/*`], { since: lastRunResult })
  .pipe(
    imagemin(
      [
        imageminMozjpeg({
          quality: 80
        }),
        imageminPngquant(),
        imageminSvgo({
          plugins: [
            {
              removeViewbox: false
            }
          ]
        })
      ],
      {
        verbose: true
      }
    )
  )
  .pipe(gulp.dest(isProduction ? config.IMAGE.PUBLISH : config.IMAGE.DIST))
}

// コンパイルしない静的データ処理
function statics() {
  return gulp.src([`${config.STATIC.SRC}**/*`])
  .pipe(plumber())
  .pipe(gulp.dest(isProduction ? config.STATIC.PUBLISH : config.STATIC.DIST))
}

// jsコンパイル
function jsPack() {
  // webpackStreamの第2引数にwebpackを渡す
  return webpackStream(webpackConfig, webpack)
  .pipe(gulp.dest(isProduction ? config.JS.PUBLISH : config.JS.DIST))
}


//// タスク更新監視
function browserSyncReload(cd) {
  browserSync.reload();
  cd();
}
function watchFiles() {
  gulp.watch([`${config.DATA.SRC}**/*.json`], gulp.series(htmls, browserSyncReload))
  gulp.watch([`${config.PAGES.SRC}**/*.ejs`], gulp.series(htmls, validateHtml, browserSyncReload))
  gulp.watch([`${config.SCSS.SRC}**/*.scss`], gulp.series(styles, browserSyncReload))
  gulp.watch([`${config.IMAGE.SRC}**/*`], gulp.series(minimage, browserSyncReload))
  gulp.watch([`${config.JS.SRC}**/*.js`], gulp.series(jsPack, browserSyncReload))
  gulp.watch([`${config.STATIC.SRC}**/*`], gulp.series(statics, browserSyncReload))
}

// ブラウザ更新
function serve(cb) {
  browserSync.init(config.BSO);

  cb();
}


/*
* タスクの実行
*
*/
exports.default = gulp.series(
  gulp.parallel(statics, htmls, styles, jsPack, minimage),
);
exports.serve = gulp.series(serve, watchFiles);
