const webpack            = require('webpack');
const ExtracktTextPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: ['./src/main.js', './src/main.css'],
  output: {
    filename: 'app.js',
    path: `${__dirname}`
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
        use: [
          ExtracktTextPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.png$/,
        use: 'url-loader'
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
    new ExtracktTextPlugin({
      filename: './app.css'
    })
  ],
  devtool: 'source-map'
};
