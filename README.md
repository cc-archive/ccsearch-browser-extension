<p align="center">
  <img src="https://mirrors.creativecommons.org/presskit/icons/cc.xlarge.png" height="150">
  <h2 align="center">CC Search Browser Extension</h2>
  <p align="center">A Cross-Browser Extension which lets you search and filter content in the public domain and under Creative Commons licenses.<p>
  <p align="center">
    <a href="https://github.com/creativecommons/ccsearch-browser-extension/blob/master/LICENSE">
      <img alt="MIT License" src="https://img.shields.io/github/license/creativecommons/ccsearch-browser-extension.svg?color=brightgreen" />
    </a>
    <a href="https://circleci.com/gh/creativecommons/ccsearch-browser-extension/tree/master">
    	<img src="https://circleci.com/gh/creativecommons/ccsearch-browser-extension/tree/master.svg?style=shield" alt="platforms" />
    </a>
    <a href="https://github.com/creativecommons/ccsearch-browser-extension/blob/master/CONTRIBUTING.md">
	    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="prs welcome">
    </a>
  </p>
</p>

## Features
- Search and filter CC Licensed content.  <img src="https://i.imgur.com/pzh4yiv.png" alt="Firefox" width="16px" height="16px" /> <img src="https://i.imgur.com/Iqv3Wxs.png" alt="Chrome" width="16px" height="16px" /> <img src="https://i.imgur.com/S85lDyi.png" alt="Opera" width="16px" height="16px" />
- One click attribution. <img src="https://i.imgur.com/pzh4yiv.png" alt="Firefox" width="16px" height="16px" /> <img src="https://i.imgur.com/Iqv3Wxs.png" alt="Chrome" width="16px" height="16px" /> <img src="https://i.imgur.com/S85lDyi.png" alt="Opera" width="16px" height="16px" />
- Download images (and attribution). <img src="https://i.imgur.com/pzh4yiv.png" alt="Firefox" width="16px" height="16px" /> <img src="https://i.imgur.com/Iqv3Wxs.png" alt="Chrome" width="16px" height="16px" /> <img src="https://i.imgur.com/S85lDyi.png" alt="Opera" width="16px" height="16px" />
- Bookmark images. <img src="https://i.imgur.com/pzh4yiv.png" alt="Firefox" width="16px" height="16px" /> <img src="https://i.imgur.com/Iqv3Wxs.png" alt="Chrome" width="16px" height="16px" /> <img src="https://i.imgur.com/S85lDyi.png" alt="Opera" width="16px" height="16px" />
- Export and import bookmarks. <img src="https://i.imgur.com/pzh4yiv.png" alt="Firefox" width="16px" height="16px" /> <img src="https://i.imgur.com/Iqv3Wxs.png" alt="Chrome" width="16px" height="16px" /> <img src="https://i.imgur.com/S85lDyi.png" alt="Opera" width="16px" height="16px" />
- Sync your custom setting and bookmarks across devices. <img src="https://i.imgur.com/pzh4yiv.png" alt="Firefox" width="16px" height="16px" /> <img src="https://i.imgur.com/Iqv3Wxs.png" alt="Chrome" width="16px" height="16px" />
- Options-UI for custom settings. <img src="https://i.imgur.com/pzh4yiv.png" alt="Firefox" width="16px" height="16px" /> <img src="https://i.imgur.com/Iqv3Wxs.png" alt="Chrome" width="16px" height="16px" /> <img src="https://i.imgur.com/S85lDyi.png" alt="Opera" width="16px" height="16px" />
- Dark Mode. <img src="https://i.imgur.com/pzh4yiv.png" alt="Firefox" width="16px" height="16px" /> <img src="https://i.imgur.com/Iqv3Wxs.png" alt="Chrome" width="16px" height="16px" /> <img src="https://i.imgur.com/S85lDyi.png" alt="Opera" width="16px" height="16px" />

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
      - From the file explorer, choose `ccsearch-browser-extension/dist/chrome`.
    - **Opera**
      - Navigate to _about://extensions_.
      - Click on "Load Unpacked" button (make sure you have enabled the _Developer mode_).
      - From the file explorer, choose `ccsearch-browser-extension/dist/opera`.

### Using `web-ext` for development
You can use node-based command line utility [web-ext](https://github.com/mozilla/web-ext) by Mozilla to speed up the development process. It adds automatic extension reloading out of the box.

1. Install: `npm install --global web-ext`

2. `cd` into `ccsearch-browser-extension/src/firefox/`.

3. Run: `web-ext run` 

You can read more about `web-ext` [here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext)

## License
See [LICENSE](https://github.com/creativecommons/ccsearch-browser-extension/blob/master/LICENSE).

