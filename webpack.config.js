const webpack     = require('webpack');
const packageJson = require('./package.json');

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
    })
  ] : [],
  devtool: 'source-map'
};
