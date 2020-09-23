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
3. Please create a separate branch for each issue that you're working on. Do not make changes to the default branch (e.g. master) of your fork.
4. Make changes to the code and commit to issue branch you created. Please Write descriptive commits.
5. [Load the extension](https://github.com/creativecommons/ccsearch-browser-extension#installation-from-source) and check/confirm your changes.
6. Run `npm run lint` to make sure there are no syntax or linter errors.
7. Run unit tests by typing `npm run test`.
8. Push the changes to your fork and submit a Pull Request.

### Development Flow

The following are some general steps that you can take to make your development flow more intuitive and smooth.

#### Working with JavaScript files:

- Run `npm run webpack-watch:<browser>` to let webpack build and watch for changes. `<browser>` can be `chrome`, `firefox` or `opera`.
- Load the extension in the browser and test your code without worrying to build every time you make some change.

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

#### Code Formatting

- The project uses [prettier](https://prettier.io/) as the code-formatter. You can format the code in two ways.

  ##### Using command line

  - Running `npm run prettier:check` will check if files in `src` and `tests` directories follow the prettier formatting.
  - Running `npm run prettier:format` will format files in `src` and `tests` directories.
  - _Note_: It may happen that the above commands gives an error and terminate. Most often than not it is due to incorrect code that prettier cannot format. In this case, you can use the warning message to debug the issue.

  ##### Using Editor plugin (convenient)

  - You can install the prettier plugin for your faviourite editor (eg: [prettier for vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)). It should automatically read the config file and work. You can also go ahead and enable formatting on save.
  - _Note_: Make sure that you configure your editor to use prettier for formatting (atleast for this project).

#### Recommendation

- It is recommended that you install the [eslint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) as well as [prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) in your editor and let them do the heavy lifting, while you focus on writting good code.
