const elements = {
  exportBookmarksButton: document.getElementById('export-bookmarks-button'),
  importBookmarksButton: document.getElementById('import-bookmarks-button'),
  importBookmarksInput: document.getElementById('import-bookmarks-input'),
  useCaseInputs: document.querySelector('.use-case').getElementsByTagName('input'),
  licenseInputs: document.querySelector('.license').getElementsByTagName('input'),
  providerInputs: document.querySelector('.provider').getElementsByTagName('input'),
  darkModeInput: document.querySelector('.dark-mode').getElementsByTagName('input'),
  providerWrapper: document.querySelector('.provider'),
  saveFiltersButton: document.getElementById('save-filters'),
  saveDarkModeButton: document.getElementById('save-dark-mode'),
};

export default elements;
