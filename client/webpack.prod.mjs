import path from 'path';
import {merge} from 'webpack-merge';
import Dotenv from 'dotenv-webpack';
import common from './webpack.common.mjs';
import {fileURLToPath} from 'url';
import {sentryWebpackPlugin} from '@sentry/webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  devtool: 'source-map',
  plugins: [
    new Dotenv({
      path: '.env.prod',
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      hash: true,
      favicon: path.resolve(__dirname, 'public/favicon.ico'),
    }),
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'wtc-o6',
      project: 'javascript-react',
      sourcemaps: {
        filesToDeleteAfterUpload: ['**/*.js.map', '**/*.css.map', '**/*.LICENSE.txt'],
      },
    }),
  ],
});
