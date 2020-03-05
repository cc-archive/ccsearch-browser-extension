## Contributing Guidelines
Hi! Thanks for your interest in helping to make this project more awesome by contributing.

Contribution can be anything like (but not limited to) improving documentation, reporting bugs, feature requests, contributing code.

### Reporting Bugs
1. First make sure that the bug has not already been [reported](https://github.com/creativecommons/ccsearch-browser-extension/issues).
2. Create a bug report [issue](https://github.com/creativecommons/ccsearch-browser-extension/issues/new?template=bug_report.md).

### Feature Requests
1. First make sure that the feature has not already been [requested](https://github.com/creativecommons/ccsearch-browser-extension/issues).
2. Create a feature request [issue](https://github.com/creativecommons/ccsearch-browser-extension/issues/new?template=feature_request.md).

### Contributing code
1. Pick up an [issue](https://github.com/creativecommons/ccsearch-browser-extension/issues) (or [create one](https://github.com/creativecommons/ccsearch-browser-extension/issues/new/choose)) on which you want to work. You
can take help of labels to filter them down.
2. Tell beforehand that you are working on the issue. This helps in making sure that multiple contributors are not working on the same issue.

### Development
1. Fork the repository and clone it locally.
2. Install the dependencies by running `npm install`.
3. Make changes to the code and commit to master. Write descriptive commits.
4. [Load the extension](https://github.com/creativecommons/ccsearch-browser-extension#installation-from-source) and check/confirm your changes.
5. Run `npm run lint` to make sure there are no syntax or linter errors.
6. Run unit tests by typing `npm run lint`.
7. Push the changes to your fork and submit a Pull Request.

### Development Flow
The following are some general steps that you can take to make your development flow more intuitive and smooth.

#### Working with JavaScript files:
- Run `npm run webpack-watch:<browser>` to let webpack build and watch for changes. `<browser>` can be `chrome`, `firefox` or `opera`.
- Load the extension in the browser and test your code without worrying to build every time you make some change. 
- Instead of running the above command for all the browsers simultaneously, target and test on any one browser first and later move to others. Thanks to [WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions), other browsers will pick up the changes with little to no modification in code.

#### Working with SCSS files:
- For the two main sections of the extension: _popup_ and _options_, `scss` files are compiled to _two_ `css` files.
- Run `compile-sass-<target>:watch` to watch for changes. `<target>` can be `popup` or `options`.
- The above commands will only compile `scss` to `css`. To include them in the build, also run `npm run webpack-watch:<browser>` in a different terminal session.
- Load the extension in the browser and test your styles without worrying to build every time you make some change.

### Coding Style

#### Editorconfig
- The repository has a [.editorconfig](https://github.com/creativecommons/ccsearch-browser-extension/blob/master/.editorconfig) file at the root. It defines some general rules for the editor.
- The plugin for editorconfig will pickup the defaults automatically. In case your editor does not have the plugin, Download it from [here](https://editorconfig.org/#download).

#### Linter
- The project uses eslint. Running `npm run lint` will show linter errors in the code, if any.
- If you are using vscode, installing [eslint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) will show linter errors and warnings in real time.
- You can go one step ahead and install [prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for vscode. After [enabling eslint integration](https://github.com/prettier/prettier-vscode#vscode-eslint-and-tslint-integration), prettier will format the code according to the linter rules.

#### Misc
- Column width: 120 charachters.
