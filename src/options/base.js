const elements = {
  importBookmarksButton: document.getElementById('import-bookmarks-button'),
  importBookmarksInput: document.getElementById('import-bookmarks-input'),
  useCaseInputs: document.querySelector('.use-case').getElementsByTagName('input'),
  licenseInputs: document.querySelector('.license').getElementsByTagName('input'),
  sourceInputs: document.querySelector('.source').getElementsByTagName('input'),
  sourceWrapper: document.querySelector('.source'),
  saveFiltersButton: document.getElementById('save-filters'),
  accordionItems: document.querySelectorAll('.accordion .accordion-link'),
  enableSearchStorageCheckbox: document.getElementById('enable-search-storage-checkbox'),
  enableSearchClearConfirmCheckbox: document.getElementById('enable-search-clear-confirm-checkbox'),
  tabsHeader: document.getElementsByClassName('tabs')[0].getElementsByTagName('ul')[0],
};

export default elements;
