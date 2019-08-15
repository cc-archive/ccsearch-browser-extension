const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

if (!process.env.TARGET) {
  throw Error("Please specify env var TARGET, 'chrome' or 'firefox'.");
} else if (!(process.env.TARGET === 'chrome' || process.env.TARGET === 'firefox')) {
  throw Error("TARGET can only be 'chrome' or 'firefox'.");
} else {
  console.info(`\x1b[1;32mBuilding for target ${process.env.TARGET}...\x1b[m`);
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    './popup/popup': './popup/popup.js',
    './options/options': './options/options.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist', process.env.TARGET),
    filename: '[name].js',
  },
  plugins: [
    new CopyPlugin([
      {
        from: './*',
        to: './',
        flatten: true,
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
        from: './popup/vendors/css/*',
        to: './popup/vendors/css/',
        flatten: true,
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
        from: './popup/img/provider_logos/*',
        to: './popup/img/provider_logos/',
        flatten: true,
      },
    ]),
  ],
};
