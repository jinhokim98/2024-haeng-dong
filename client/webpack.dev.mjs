import path from 'path';
import {merge} from 'webpack-merge';
import Dotenv from 'dotenv-webpack';
import common from './webpack.common.mjs';
import {fileURLToPath} from 'url';
import TerserPlugin from 'terser-webpack-plugin';
import {WebpackManifestPlugin} from 'webpack-manifest-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = process.env.BRANCH_NAME ? `/${process.env.BRANCH_NAME}/` : '/';

export default merge(common, {
  mode: 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath,
  },
  devtool: 'eval-source-map',
  devServer: {
    port: 3000,
    hot: true,
    publicPath,
    client: {
      overlay: false,
    },
    historyApiFallback: {
      rewrites: [{from: /./, to: '/index.html'}],
    },
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
  },
  plugins: [
    new Dotenv({
      path: '.env.dev',
    }),
    new WebpackManifestPlugin({
      fileName: 'manifest.json',
      basePath: './dist/',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // 가능한 모든 코드를 압축
            drop_console: true, // 콘솔 로그를 제거하여 파일 크기 감소
            drop_debugger: true, // 디버거 코드 제거
            pure_funcs: ['console.info'], // 특정 함수 호출 제거
          },
          mangle: true, // 변수 및 함수 이름을 짧게 변경
          output: {
            comments: false, // 주석을 제거
          },
        },
        extractComments: false, // 별도의 파일로 주석을 추출하지 않음
        parallel: true, // 멀티 프로세스를 사용하여 빌드 속도 향상
      }),
    ],
  },
});
