/* eslint-disable no-undef */
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  entry: {
    'megumi': './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'source', 'js'),
    filename: '[name].min.js',
    publicPath: '/'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js']
  },
  module: {
    strictExportPresence: true,
    rules: [{
      test: /\.js$/,
      use: [{
        loader: require.resolve('babel-loader'),
        options: {
          compact: true,
          presets: ['env']
        }
      }]
    }]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: false
        }
      })
    ]
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  }
};
