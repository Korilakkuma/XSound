import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import path from 'path';
import packageJson from './package.json' assert { type: 'json' };

const {
  name,
  version,
  author,
  license
} = packageJson;

const dirname = path.resolve('.');

const plugins = [
  new webpack.BannerPlugin({
    banner: `${name} v${version} | ${author} | license: ${license}`
  })
];

const baseConfig = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    filename: 'xsound.js',
    path: `${dirname}/build`,
    publicPath: '/build/',
    library: {
      name: 'xsound',
      type: 'umd'
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.wasm$/,
        type: 'asset/inline'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  // eslint-disable-next-line no-undef
  plugins: process.env.NODE_ENV === 'production' ? plugins : [],
  optimization: {
    // eslint-disable-next-line no-undef
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // eslint-disable-next-line no-undef
            drop_console: process.env.NODE_ENV === 'production'
          },
          keep_classnames: /^.*?Processor$/
        }
      })
    ]
  },
  devtool: 'source-map'
};

const windowConfig = {
  ...baseConfig,
  output: {
    filename: 'xsound.min.js',
    path: `${dirname}/build`,
    publicPath: '/build/',
    library: {
      type: 'window'
    }
  },
  devServer: {
    static: dirname,
    host: '0.0.0.0'
  }
};

export default [baseConfig, windowConfig];
