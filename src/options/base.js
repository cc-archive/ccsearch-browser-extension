const elements = {
  exportBookmarksButton: document.getElementById('export-bookmarks-button'),
  exportSpecificBookmarksButton: document.getElementById('export-specific-bookmarks-button'),
  exportSpecificBookmarksChoice: document.getElementsByClassName('export-specific-bookmark-choice'),
  exportSpecificBookmarksNow: document.getElementById('export-specific-bookmarks-button-now'),
  exportBookmark: document.getElementsByClassName('export-bookmark'),
  importBookmarksButton: document.getElementById('import-bookmarks-button'),
  importBookmarksInput: document.getElementById('import-bookmarks-input'),
  useCaseInputs: document.querySelector('.use-case').getElementsByTagName('input'),
  licenseInputs: document.querySelector('.license').getElementsByTagName('input'),
  providerInputs: document.querySelector('.provider').getElementsByTagName('input'),
  providerWrapper: document.querySelector('.provider'),
  saveFiltersButton: document.getElementById('save-filters'),
};

export default elements;
