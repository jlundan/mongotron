import { AureliaPlugin } from 'aurelia-webpack-plugin';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import * as merge from 'webpack-merge';
import * as WriteFilePlugin from 'write-file-webpack-plugin';
import {ProvidePlugin} from "webpack";
import {ExtractTextPlugin} from 'extract-text-webpack-plugin';

const isDevServer = process.argv.some(v => v.includes('webpack-dev-server'));
const appRoot = process.cwd();
const extractCss = false;
const cssRules = [
  { loader: 'css-loader' },
  {
    loader: 'postcss-loader',
    options: { plugins: () => [require('autoprefixer')({ browsers: ['last 2 versions'] })]}
  }
];

function getBundleAnalyzerPlugin(entryPoints: webpack.Entry): BundleAnalyzerPlugin {
  return new BundleAnalyzerPlugin({
    reportFilename: `bundle-report-${Object.keys(entryPoints)[0]}.html`,
    analyzerMode: 'static',
    openAnalyzer: false
  });
}

function when(condition: boolean, ...whenTrue: webpack.Plugin[]): webpack.Plugin[] {
  return condition ? whenTrue : [];
}

const commonConfig: ({ production }) => webpack.Configuration = (
  { production } = { production: false }
) => ({
  mode: production ? 'production' : 'development',
  devtool: production ? 'source-map' : 'inline-source-map',
  output: { libraryTarget: 'commonjs2' },
  optimization: {
    minimize: production,
    // Aurelia doesn't like this enabled
    concatenateModules: false
  },
  performance: { hints: false },
  resolve: {
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.js'],
    modules: ['src', 'node_modules'].map(x => path.resolve(x))
  },
  module: {
    rules: [
      {
        test: /require_optional/,
        use: 'null-loader'
      },
      {
        // Relocates assets that are located dynamically at runtime and rewrites
        // their location. This is particularly helpful for node binaries
        // located via the bindings or node-pre-gyp libraries
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
          loader: '@zeit/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'assets'
          }
        }
      },
      {
        test: /\.css$/i,
        issuer: [{ not: [{ test: /\.html$/i }] }],
        use: extractCss ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssRules,
        }) : ['style-loader', ...cssRules],
      },
      {
        test: /\.css$/i,
        issuer: [{ test: /\.html$/i }],
        // CSS required in templates cannot be extracted safely
        // because Aurelia would try to require it again in runtime
        use: cssRules,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        issuer: /\.[tj]s$/i
      },
      {
        test: /\.scss$/,
        use: ['css-loader', 'sass-loader'],
        issuer: /\.html?$/i
      },
      { test: /\.ts$/i, use: 'awesome-typescript-loader' },
      { test: /\.html$/i, use: 'html-loader' },
      {
        // Includes .node binaries in the output
        test: /\.node$/,
        loader: 'awesome-node-loader'
      },
      {
        // Ensures our output sourcemap includes sourcemaps from dependencies
        test: /\.js$/,
        use: 'source-map-loader',
        enforce: 'pre',
        exclude: [/reflect-metadata/]
      },
      { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
      // load these fonts normally, as files:
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' },
    ]
  },
  plugins: [
    new webpack.WatchIgnorePlugin(['node_modules', 'old', "dist", ".idea"]),
    new webpack.DefinePlugin({
      'process.env.production': JSON.stringify(production)
    }),
    new ProvidePlugin({
      'Promise': 'bluebird',
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'] // Bootstrap 4 Dependency.
    }),
    ...when(production, new CleanWebpackPlugin(['dist'], { root: appRoot, verbose: false }))
  ],
  node: {
    __dirname: false,
    __filename: false,
    process: false
  },
  externals: ['electron'],
  watch: true,
  watchOptions: {
    ignored: ['**/*.js', 'node_modules', 'old/**/*', "dist/**/*", ".idea/**/*"]
  }
});

const main = (entryPoints: webpack.Entry) => ({ production } = { production: false }) =>
  merge.smart(commonConfig({ production }), {
    entry: entryPoints,
    target: 'electron-main',
    plugins: [
      ...when(production, getBundleAnalyzerPlugin(entryPoints)),
      new CopyWebpackPlugin(['package.json'])
    ]
  });

const preload = (entryPoints: webpack.Entry) => ({ production } = { production: false }) =>
  merge.smart(commonConfig({ production }), {
    entry: entryPoints,
    target: 'electron-renderer',
    plugins: [...when(production, getBundleAnalyzerPlugin(entryPoints))]
  });

const renderer = (entryPoints: webpack.Entry, nodeIntegration: boolean = true) => (
  { production } = { production: false }
) =>
  merge.smart(commonConfig({ production }), {
    entry: entryPoints,
    target: nodeIntegration ? 'electron-renderer' : 'web',
    output: { libraryTarget: nodeIntegration ? 'commonjs2' : 'this' },
    plugins: [
      new AureliaPlugin({ aureliaApp: undefined, features: { polyfills: 'esnext' } }),
      ...when(production, getBundleAnalyzerPlugin(entryPoints)),
      ...when(isDevServer, new webpack.HotModuleReplacementPlugin(), new WriteFilePlugin()),
      // Create an HTML file for each entry point
      ...Object.keys(entryPoints).map(
        entry => new HtmlWebpackPlugin({ title: '', filename: `${entry}.html`, chunks: [entry], template: 'build/resources/renderer.html' })
      )
    ]
  });

export = [
  main({ main: path.resolve(appRoot, 'src/main'), vendor: ['bluebird', 'jquery', 'bootstrap'] }),
  renderer({
    renderer: path.resolve(appRoot, 'src/renderer')
    // Add multiple renderer entry points that can be opened in other windows
    // page2: path.resolve(appRoot, 'src/page2')
  })
  // Bundle for a renderer with nodeIntegration disabled
  // renderer({ renderer: path.resolve(appRoot, 'src/renderer') }, false),
  //
  // Add an extra entry point for a preload script
  // preload({ preload: path.resolve(appRoot, 'src/preload') })
];
