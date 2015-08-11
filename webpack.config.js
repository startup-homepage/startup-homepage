var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin  = require('extract-text-webpack-plugin'),
    StaticHtmlWebpackPlugin = require('./plugins/static-html-webpack-plugin'),
    StaticSiteWebpackPlugin = require('static-site-generator-webpack-plugin'),
    srcPath = path.join(__dirname, 'src');


module.exports = {

  entry: {
    index: [path.join(srcPath, 'index.js')],
  },
  module: {
    loaders: [
      { test: /[\.js|\.jsx]$/, loaders: ['babel'], include: srcPath},
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass')},
      { test: /\.(woff)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff2" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  debug: true,
  plugins: [
    new ExtractTextPlugin("main.css"),
    new StaticHtmlWebpackPlugin('index.js', ['/', '/login/', '/signup/'])
  ]

}
