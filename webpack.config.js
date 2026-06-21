const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
  // Target only the booking-related features
  entry: {
    booking: './src/booking.ts' // We'll create this file to handle the booking process
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/booking'),
    publicPath: '/booking/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/booking-template.html', // We'll create this template
      filename: 'index.html',
    }),
    new DotenvWebpackPlugin(), // Load environment variables from .env file
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],// Development server configuration (used only for testing the booking process)
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 8080,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  // Use separate config to keep Vite as the main build tool
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};