const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    './firefox/popup/popup': './firefox/popup/popup.js',
    './firefox/options/options': './firefox/options/options.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new CopyPlugin([
      {
        from: 'firefox/*',
        to: 'firefox/',
        flatten: true,
      },
      {
        from: 'firefox/icons/*',
        to: 'firefox/icons/',
        flatten: true,
      },
      {
        from: 'firefox/options/*',
        to: 'firefox/options/',
        flatten: true,
        ignore: ['*.js'],
      },
      {
        from: 'firefox/popup/*',
        to: 'firefox/popup/',
        flatten: true,
        ignore: ['*.js'],
      },
      {
        from: 'firefox/popup/vendors/css/*',
        to: 'firefox/popup/vendors/css/',
        flatten: true,
      },
      {
        from: 'firefox/popup/vendors/js/*',
        to: 'firefox/popup/vendors/js/',
        flatten: true,
      },
      {
        from: 'firefox/popup/img/*',
        to: 'firefox/popup/img/',
        flatten: true,
      },
      {
        from: 'firefox/popup/img/license_logos/*',
        to: 'firefox/popup/img/license_logos/',
        flatten: true,
      },
      {
        from: 'firefox/popup/img/provider_logos/*',
        to: 'firefox/popup/img/provider_logos/',
        flatten: true,
      },
    ]),
  ],
};

// input, outpout, loaders, plugin
