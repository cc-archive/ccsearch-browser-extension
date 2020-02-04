const elements = {
  importBookmarksButton: document.getElementById('import-bookmarks-button'),
  importBookmarksInput: document.getElementById('import-bookmarks-input'),
  useCaseInputs: document.querySelector('.use-case').getElementsByTagName('input'),
  licenseInputs: document.querySelector('.license').getElementsByTagName('input'),
  providerInputs: document.querySelector('.provider').getElementsByTagName('input'),
  providerWrapper: document.querySelector('.provider'),
  saveFiltersButton: document.getElementById('save-filters'),
  accordionItems: document.querySelectorAll('.accordion .accordion-link'),
  enableSearchStorageCheckbox: document.getElementById('enable-search-storage-checkbox'),
};

export default elements;
