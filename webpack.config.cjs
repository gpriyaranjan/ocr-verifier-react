const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const tsDir = path.resolve(__dirname, 'src/ts'); 

function getEntryPoints(dir) {
  const entries = {};
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      Object.assign(entries, getEntryPoints(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const relativePath = path.relative(tsDir, filePath);
      const name = relativePath.replace(/\.(ts|tsx)$/, '');
      entries[name] = filePath;
    }
  });
  return entries;
}

const entries = getEntryPoints(tsDir);
console.log(entries);

module.exports = {
  mode: 'development',
  entry: {
    ...entries
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // @ts-ignore
    publicPath: ''
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },

    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/top_panel_react.html',
      filename: 'top_plan_react.html',
      chunks: ['app.react.js']
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/top_panel_react.css',
          to: path.resolve(__dirname, 'dist/top_panel_react.css'),
        }
      ],
    }),
  ],
  
  optimization: {
    splitChunks: false,
    minimize: false
  },

  target: 'electron-renderer',
}