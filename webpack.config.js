const webpack           = require('webpack');
const packageJson       = require('./package.json');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const {
  name,
  version,
  author,
  license
} = packageJson;

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'xsound.js',
    path: `${__dirname}/build`,
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: process.env.NODE_ENV === 'production' ? [
    new webpack.BannerPlugin({
      banner: `${name} v${version} | ${author} | license: ${license}`
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/main.d.ts', to: './xsound.d.ts' }
      ]
    })
  ] : [],
  devtool: 'source-map'
};
