[![CircleCI](https://circleci.com/gh/creativecommons/ccsearch-browser-extension/tree/master.svg?style=shield)](https://circleci.com/gh/creativecommons/ccsearch-browser-extension/tree/master)

# CC Browser Extension

A Cross-Browser Extension which lets you search and filter content in the public domain and under Creative Commons licenses.

## Features
- Search and filter CC Licensed content.
- One click attribution.
- Download images (and attribution).
- Bookmark images to preserve them across sessions.
- Export and import bookmarks in JSON.
- Options-ui for custom settings.
- Dark Mode.

## Installation from source
You can install the extension directly from the source. Follow the following steps:

1. Clone the repo: `git clone https://github.com/creativecommons/ccsearch-browser-extension.git`.

2. Run: `npm install`.

3. Run: `npm run dev`. This would compile SASS to CSS and bundle JS. The compiled version will be in dist folder.

4. Load the extension to the browser:
    - **Mozilla Firefox**
      - Navigate to _about:debugging_.
      - Click on "Load Temporary Add-on" button.
      - From the file explorer, choose `ccsearch-browser-extension/dist/firefox/manifest.json`.
    - **Google Chrome**
      - Navigate to _chrome://extensions_.
      - Click on "Load Unpacked" button (make sure you have enabled the _Developer mode_).
      - From the file explorer, choose `ccsearch-browser-extension/dist/firefox`.

### Using `web-ext` for development
You can use node-based command line utility [web-ext](https://github.com/mozilla/web-ext) by Mozilla to speed up the development process. It adds automatic extension reloading out of the box.

1. Install: `npm install --global web-ext`

2. `cd` into `ccsearch-browser-extension/src/firefox/`.

3. Run: `web-ext run` 

You can read more about `web-ext` [here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext)

## License
See [LICENSE](https://github.com/creativecommons/ccsearch-browser-extension/blob/master/LICENSE).

