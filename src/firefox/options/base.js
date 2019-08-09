const elements = {
  exportBookmarksButton: document.querySelector('.export-bookmarks-button'),
  importBookmarksButton: document.querySelector('.import-bookmarks-button'),
  importBookmarksInput: document.getElementById('import-bookmarks-input'),
  useCaseInputs: document.querySelector('.use-case').getElementsByTagName('input'),
  licenseInputs: document.querySelector('.license').getElementsByTagName('input'),
  providerInputs: document.querySelector('.provider').getElementsByTagName('input'),
  darkModeInput: document.querySelector('.dark-mode').getElementsByTagName('input'),
  providerWrapper: document.querySelector('.provider'),
  status: document.getElementById('status'),
  saveButton: document.getElementById('save'),
};

export default elements;
