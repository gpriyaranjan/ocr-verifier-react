const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');


function getEntryPoints(dir) {
  const entries = {};
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      Object.assign(entries, getEntryPoints(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const relativePath = path.relative(tsRendererDir, filePath);
      const name = relativePath.replace(/\.(ts|tsx)$/, '');
      const basename = path.basename(name);
      if (!exported.includes(basename))
        entries[name] = filePath;
    }
  });
  return entries;
}

const tsRendererDir = path.resolve(__dirname, 'src/ts', 'renderer');
const exported = ['app.react'];
let rendererEntries = getEntryPoints(tsRendererDir);
rendererEntries = {
  ...rendererEntries,
  'app.react': path.join(tsRendererDir, 'app.react.tsx')
}
console.log(rendererEntries);

const tsMainDir = path.resolve(__dirname, 'src/ts', 'main');
const tsMainEntries = getEntryPoints(tsMainDir);

module.exports = [
  {
    target: 'electron-renderer',

    mode: 'development',
    entry: rendererEntries,

    output: {
      path: path.resolve(__dirname, 'dist/renderer'),
      filename: '[name].js', // @ts-ignore
      publicPath: ''
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              module: 'esnext',
              moduleResolution: 'bundler',
              jsx: "react-jsx",
            }            
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
        filename: 'top_panel_react.html',
        chunks: ['app.react.js']
      }),
    ],
  
    optimization: {
      splitChunks: false,
      minimize: false
    },

  },

  {
    target: 'electron-main',

    mode: 'development',
    entry: tsMainEntries,

    output: {
      path: path.resolve(__dirname, 'dist/main'),
      filename: '[name].cjs', // @ts-ignore
      publicPath: ''
    },
    
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              module: 'commonjs',  
            }            
          }
        },

      ],
    },
    
    resolve: {
      extensions: ['.js', '.ts'],
    },

    optimization: {
      splitChunks: false,
      minimize: false
    },

  }
]