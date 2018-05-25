import * as path from 'path';

import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as nodeExternals from 'webpack-node-externals';

const commonConfig = {
  entry: './src/index.ts',
  externals: [ nodeExternals() ],
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      }
    ]
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'lib'),
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  target: 'node',
};

const devConfig = merge(commonConfig, {
  devtool: 'inline-source-map',
  mode: 'development',
});

const prodConfig = merge(commonConfig, {
  devtool: 'source-map',
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin([ 'lib' ]),
  ],
});

export function build(watch: boolean, mode: 'dev'|'prod') {
  const compiler = webpack(mode === 'dev' ? devConfig : prodConfig);
  if (!watch) {
    compiler.run((err, stats) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(stats.toString({
        chunks: false,  // Makes the build much quieter
        colors: true    // Shows colors in the console
      }));
    });
  } else {
    compiler.watch({}, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(stats.toString({
        chunks: false,  // Makes the build much quieter
        colors: true    // Shows colors in the console
      }));
    });
  }
}
