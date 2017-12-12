const webpack            = require('webpack');
const ExtracktTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: ['./src/main.js', './src/main.css'],
  output: {
    filename: 'app.js',
    path: `${__dirname}/public`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtracktTextPlugin.extract({
          use: [
            'css-loader',
            'postcss-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        config : {
          path: './postcss.config.js'
        }
      }
    }),
    new ExtracktTextPlugin('./app.css')
  ],
  devtool: 'source-map'
};
