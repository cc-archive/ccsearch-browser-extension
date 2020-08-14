const elements = {
  importBookmarksButton: document.getElementById('import-bookmarks-button'),
  importBookmarksInput: document.getElementById('import-bookmarks-input'),
  useCaseInputsWrapper: document.querySelector('.use-case'),
  licenseInputsWrapper: document.querySelector('.license'),
  useCaseInputs: document.querySelector('.use-case').getElementsByTagName('input'),
  licenseInputs: document.querySelector('.license').getElementsByTagName('input'),
  fileTypeInputs: document.querySelector('.fileType').getElementsByTagName('input'),
  imageTypeInputs: document.querySelector('.imageType').getElementsByTagName('input'),
  imageSizeInputs: document.querySelector('.imageSize').getElementsByTagName('input'),
  aspectRatioInputs: document.querySelector('.aspectRatio').getElementsByTagName('input'),
  sourceInputs: document.querySelector('.source').getElementsByTagName('input'),
  sourceWrapper: document.querySelector('.source'),
  saveFiltersButton: document.getElementById('save-filters'),
  accordionItems: document.querySelectorAll('.accordion .accordion-link'),
  enableSearchClearConfirmCheckbox: document.getElementById('enable-search-clear-confirm-checkbox'),
  enableMatureContentCheckbox: document.getElementById('enable-mature-content-checkbox'),
  tabsHeader: document.getElementsByClassName('tabs')[0].getElementsByTagName('ul')[0],
};

export default elements;
