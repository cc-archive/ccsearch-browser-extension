[![CircleCI](https://circleci.com/gh/creativecommons/ccsearch-browser-extension/tree/master.svg?style=shield)](https://circleci.com/gh/creativecommons/ccsearch-browser-extension/tree/master)

# CC Browser Extension

This is a Cross-Browser Extension which you can use to search content in the public domain and under Creative Commons licenses.
The project is in initial phase and any help in the form of bug reports, feature requests, discussion, patches, etc is appreciated.

## Development
You can test and develop the extension locally on your system.

**NOTE**: Right now the focus is on Firefox Browser so the extension might show some unexpected behavior in Chrome.
1. Clone the repo: `git clone https://github.com/creativecommons/ccsearch-browser-extension.git`.

### Load the extension in Firefox
1. Open Firefox browser and navigate to _about:debugging_.

2. Click "Load Temporary Add-on"

3. From the file browser, choose `ccsearch-browser-extension/src/firefox/manifest.json`.

### Using `web-ext` for development
You can also use node-based command line utility [web-ext](https://github.com/mozilla/web-ext) by Mozilla to speed up the development process. It adds automatic extension reloading out of the box.

1. Install: `npm install --global web-ext`

2. `cd` into `ccsearch-browser-extension/src/firefox/`.

3. Run: `web-ext run` 

You can read more about `web-ext` [here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext)

## License
See [LICENSE](https://github.com/creativecommons/ccsearch-browser-extension/blob/master/LICENSE).

