const merge = require('webpack-merge').merge; //webpack.common.jsと結合させるため
const config = require('./webpack.config.js'); //共通の読み込みのパスを記載する

module.exports = merge(config, {  // commonの情報を読み込んだ上で以下を読み込む
  mode: 'development', //開発者モードで作成を行う
  devtool: 'inline-source-map', //jsのソースマップの生成
  output: {
    // 出力ファイル名
    path: `${__dirname}/dist`,
  },
});