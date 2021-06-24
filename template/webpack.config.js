module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  // mode: "production",

  // ローカル開発用環境を立ち上げる
  // 実行時にブラウザが自動的に localhost を開く
  // devServer: {
  //   contentBase: "dist",
  //   open: true // 自動的にブラウザが立ち上がる
  // },

  // メインとなるJavaScriptファイル（エントリーポイント）
  // keyを階層で指定すると、outputでそのとおりに排出される
  entry: {
    "./assets/js/main": `./src/scripts/js/index.js`,
    // jquery: `./src/assets/js/jquery.js`,
  },

  // babel
  module: {
    rules: [
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        use: [
          {
            // Babel を利用する
            loader: 'babel-loader',
            // Babel のオプションを指定する
            options: {
              presets: [
                // プリセットを指定することで、ES2020 を ES5 に変換
                '@babel/preset-env',
              ]
            }
          }
        ]
      }
    ]
  },
  // webpack5から必要
  target: ["web", "es5"],
  // ファイルの出力設定
  output: {
    // path: `${__dirname}/publish`,
    // 出力ファイル名
    filename: '[name].js',
  },

};