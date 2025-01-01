const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // Entry points for your extension scripts
  entry: {
    background: './src/background.ts',
    content: './src/content.ts',
    popup: './src/popup.ts',
    options: './src/options.ts'
  },

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  // Resolve file extensions for imports
  // This makes it so you don't need to specify the file extension for every import statement
  resolve: {
    extensions: ['.ts', '.js']
  },

  // Module rules for handling TypeScript files
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        exclude: /node_modules/
      }
    ]
  },

  // Plugins for copying static assets
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/icons', to: 'icons' }, // Icons folder
        { from: 'src/popup.html', to: 'popup.html' }, // Popup HTML
        { from: 'src/options.html', to: 'options.html' }, // Options HTML
        { from: 'src/styles/custom.css', to: 'custom.css' } // Custom CSS
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],

  // Enable source maps for easier debugging
  devtool: 'inline-source-map',

  // Production mode
  mode: 'production'
};