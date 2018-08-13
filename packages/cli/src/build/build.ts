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
        exclude: /node_modules/,
        test: /\.graphql$/,
        use: 'raw-loader',
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: false
          }
        },
      }
    ]
  },
  optimization: {
    nodeEnv: false
  },
  output: {
    filename: 'server.js',
    path: path.resolve(process.cwd(), 'lib'),
  },
  resolve: {
    extensions: [ '.ts', '.js', '.html' ]
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

const testConfig = merge(commonConfig, {
  devtool: 'inline-source-map',
  entry: './src/test.ts',
  mode: 'development',
  output: {
    filename: 'test.js',
  }
});

export function build(watch: boolean, mode: 'dev'|'prod'|'test') {
  let compiler;
  switch (mode) {
    case 'dev':
      compiler = webpack(devConfig);
      break;
    case 'prod':
      compiler = webpack(prodConfig);
      break;
    case 'test':
      compiler = webpack(testConfig);
      break;
    default:
      throw new Error('Given mode is incorrect. It should be dev, prod or test.');
  }
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
