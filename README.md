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

<p align="center">
  <img src="https://i.imgur.com/KOgFgWU.png" width="900px">
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

<p align="center">
  <img src="https://i.imgur.com/Dh7wczv.png">
</p>

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

## Contribution
Checkout [CONTRIBUTING.md](https://github.com/creativecommons/ccsearch-browser-extension/blob/master/CONTRIBUTING.md) for general guidelines for contributing code to CC Open Source.

For contribution guidelines and development instructions specific to this particular project, please checkout [INSTRUCTIONS.md](https://github.com/creativecommons/ccsearch-browser-extension/blob/master/INSTRUCTIONS.md).

## License
See [LICENSE](https://github.com/creativecommons/ccsearch-browser-extension/blob/master/LICENSE).

