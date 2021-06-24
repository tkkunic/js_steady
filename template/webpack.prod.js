const merge = require('webpack-merge').merge; //webpack.common.jsと結合させるため
const config = require('./webpack.config.js'); //共通の読み込みのパスを記載する

module.exports = merge(config, { // commonの情報を読み込んだ上で以下を読み込む
  mode: "production", //本番アップ用
  output: {
    // 出力ファイル名
    path: `${__dirname}/publish`,
  },
})