/* eslint-disable @typescript-eslint/no-var-requires */
const webpack      = require('webpack');
const packageJson  = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');
const path         = require('path');
/* eslint-enable @typescript-eslint/no-var-requires */

const {
  name,
  version,
  author,
  license
} = packageJson;

const dirname = path.resolve('.');

const plugins = [
  new webpack.BannerPlugin({
    banner: `${name} v${version} | ${author} | license: ${license}`
  })
];

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    filename: 'xsound.js',
    library: 'XSound',
    libraryTarget: 'umd',
    path: `${dirname}/build`,
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: process.env.NODE_ENV === 'production' ? plugins : [],
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: process.env.NODE_ENV === 'production'
          }
        }
      })
    ]
  },
  devtool: 'source-map',
  devServer: {
    static: dirname,
    host: '0.0.0.0'
  }
};
