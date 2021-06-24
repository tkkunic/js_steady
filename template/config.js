// path
const PATH_ROOT = {
  SRC : "./src/",
  DIST: "./dist/",
  PUBLISH: "./publish/",
};
const PAGES = {
  SRC: `${PATH_ROOT.SRC}pages/`,
  DIST: `${PATH_ROOT.DIST}`,
  PUBLISH: `${PATH_ROOT.PUBLISH}`,
};
const DATA = {
  SRC: `${PATH_ROOT.SRC}data/`,
  DIST: `${PATH_ROOT.DIST}`,
  PUBLISH: `${PATH_ROOT.PUBLISH}`,
};
const STATIC = {
  SRC: `${PATH_ROOT.SRC}static/`,
  DIST: `${PATH_ROOT.DIST}`,
  PUBLISH: `${PATH_ROOT.PUBLISH}`,
};
const SCSS = {
  // SRC: `${PATH_ROOT.SRC}dynamic/**/css/**/`,
  SRC: `${PATH_ROOT.SRC}scss/**/`,
  DIST: `${PATH_ROOT.DIST}`,
  PUBLISH: `${PATH_ROOT.PUBLISH}`,
};
const IMAGE = {
  // SRC: `${PATH_ROOT.SRC}dynamic/**/images/**/`,
  SRC: `${PATH_ROOT.SRC}images/**/`,
  DIST: `${PATH_ROOT.DIST}`,
  PUBLISH: `${PATH_ROOT.PUBLISH}`,
};
const JS = {
  // SRC: `${PATH_ROOT.SRC}dynamic/**/js/**/`,
  SRC: `${PATH_ROOT.SRC}scripts/**/`,
  DIST: `${PATH_ROOT.DIST}`,
  PUBLISH: `${PATH_ROOT.PUBLISH}`,
};

// Post CSS用
const AUTO_PREFIXER_OPTION = {
  grid: true,
};

const OUTPUT_EXTENDED  = 'expanded';
const OUTPUT_COMPRESSED  = 'compressed';
const OUTPUT_STYLE = OUTPUT_EXTENDED

// ページ確認用 browserSyncオプション
const BSO = {
  port: 8080,
  server: {
    baseDir: PATH_ROOT.DIST,
    index: 'index.html',
  },
  reloadOnRestart: true,
};


// exports
exports.PATH_ROOT = PATH_ROOT;
exports.PAGES = PAGES;
exports.DATA = DATA;
exports.STATIC = STATIC;
exports.SCSS = SCSS;
exports.IMAGE = IMAGE;
exports.JS = JS;
exports.AUTO_PREFIXER_OPTION = AUTO_PREFIXER_OPTION;
exports.OUTPUT_STYLE = OUTPUT_STYLE;
exports.BSO = BSO;
