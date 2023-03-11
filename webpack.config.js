require("webpack")
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/ruuvi.js',
  output: {
    filename: 'ruuvi.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      scriptLoading: 'blocking',
      inject: 'head',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/favicon.ico') },
        { from: path.resolve(__dirname, 'src/jquery-3.5.1.js') },
        {
          from: path.resolve(__dirname, 'src/crypto-js-4.0.0/core.js'),
          to: path.resolve(__dirname, 'build/crypto-js-4.0.0/core.js')
        },
        {
          from: path.resolve(__dirname, 'src/crypto-js-4.0.0/md5.js'),
          to: path.resolve(__dirname, 'build/crypto-js-4.0.0/md5.js')
        },
        {
          from: path.resolve(__dirname, 'src/crypto-js-4.0.0/sha256.js'),
          to: path.resolve(__dirname, 'build/crypto-js-4.0.0/sha256.js')
        },
        {
          from: path.resolve(__dirname, 'src/crypto-js-4.0.0/enc-base64.js'),
          to: path.resolve(__dirname, 'build/crypto-js-4.0.0/enc-base64.js')
        },
        { from: path.resolve(__dirname, 'src/crypto_browserify.js') },
        {
          from: path.resolve(__dirname, 'src/css/style.css'),
          to: path.resolve(__dirname, 'build/css/')
        },
        {
          from: path.resolve(__dirname, 'src/assets/fonts/'),
          to: path.resolve(__dirname, 'build/assets/fonts/')
        },
      ],
    }),
  ]
}
