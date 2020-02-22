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
  devtool: 'source-map'
};
