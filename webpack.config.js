const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // Entry points for your extension scripts
  entry: {
    background: './src/background.ts',
    popup: './src/popup.ts',
    options: './src/options.ts',
    types: './src/types.ts'
  },

  // Enable source maps for easier debugging
  devtool: 'source-map',

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[file].map' // This ensures source maps are generated
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
      },
      { enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },

  // Plugins for copying static assets
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'src/icons', to: 'icons' }, // Icons folder
        { from: 'src/popup.html', to: 'popup.html' }, // Popup HTML
        { from: 'src/options.html', to: 'options.html' }, // Options HTML
        { from: 'src/styles/custom.css', to: 'custom.css' }, // Custom CSS
        { from: 'src/fonts', to: 'fonts' }, // Fonts folder
        { from: 'src/styles/fonts.css', to: 'fonts.css'}
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],

  // Production mode
  mode: 'development'
};