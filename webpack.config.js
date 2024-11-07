import path from 'path';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default function (a, wp) {
  const isDev = wp.mode === 'development';
  const destPath = path.resolve(__dirname, './docs');
  return {
    entry: './src/index.jsx',
    output: {
      // have no idea why dev server is so flaky but this works:
      publicPath: isDev ? '/' : './',
      path: destPath
    },
    // eslint-disable-next-line no-undefined
    devtool: isDev ? 'source-map' : undefined,
    devServer: {
      compress: true,
      port: 9000,
      static: {
        directory: path.join(__dirname, './static')
      }
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: 'index.html'
      }),
      new CopyWebpackPlugin({
        patterns: [ {
          from: path.resolve(__dirname, './static'),
          to: destPath
        } ]
      }),
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                // '@babel/preset-env',
                '@babel/preset-react'
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        }
      ]
    }
  };
};
