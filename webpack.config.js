module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'xsound.js',
    path: `${__dirname}/build`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};
