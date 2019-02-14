const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    megumi: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'source', 'js'),
    filename: '[name].min.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory',
      },
    ],
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
