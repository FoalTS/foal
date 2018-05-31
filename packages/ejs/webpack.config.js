const fs = require('fs');
const path = require('path');

const { BannerPlugin } = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.ts',
  externals: [ nodeExternals() ],
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(process.cwd(), 'lib'),
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  target: 'node',
  devtool: 'source-map',
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin([ 'lib' ]),
    new BannerPlugin(fs.readFileSync('../../header.txt', 'utf8'))
  ],
};