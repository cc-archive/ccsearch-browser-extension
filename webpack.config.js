const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

if (!process.env.TARGET) {
  throw Error("Please specify env var TARGET, 'chrome', 'firefox' or 'opera'.");
} else if (
  !(
    process.env.TARGET === 'chrome' ||
    process.env.TARGET === 'firefox' ||
    process.env.TARGET === 'opera' ||
    process.env.TARGET === 'edge'
  )
) {
  throw Error("TARGET can only be 'chrome', 'firefox', 'opera' or 'edge'.");
} else {
  console.info(`\x1b[1;32mBuilding for ${process.env.TARGET}...\x1b[m`);
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  devtool: 'cheap-module-source-map',
  entry: {
    './popup/popup': './popup/popup.js',
    './options/options': './options/options.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist', process.env.TARGET),
    filename: '[name].js',
  },
  node: {
    global: false,
  },
  plugins: [
    new CopyPlugin([
      {
        from: `./manifest.${process.env.TARGET}.json`,
        to: './manifest.json',
      },
      {
        from: './icons/*',
        to: './icons',
        flatten: true,
      },
      {
        from: './options/*',
        to: './options/',
        flatten: true,
        ignore: ['*.js'],
      },
      {
        from: './popup/*',
        to: './popup/',
        flatten: true,
        ignore: ['*.js'],
      },
      {
        from: './popup/vendors/js/*',
        to: './popup/vendors/js/',
        flatten: true,
      },
      {
        from: './popup/img/*',
        to: './popup/img/',
        flatten: true,
      },
      {
        from: './popup/img/license_logos/*',
        to: './popup/img/license_logos/',
        flatten: true,
      },
      {
        from: './popup/img/source_logos/*',
        to: './popup/img/source_logos/',
        flatten: true,
      },
    ]),
    new webpack.DefinePlugin({
      global: 'window', // Placeholder for global used in any node_modules
    }),
  ],
};
