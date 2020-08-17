const elements = {
  importBookmarksButton: document.getElementById('import-bookmarks-button'),
  importBookmarksInput: document.getElementById('import-bookmarks-input'),
  useCaseCheckboxesWrapper: document.querySelector('.use-case'),
  licenseCheckboxesWrapper: document.querySelector('.license'),
  sourceCheckboxesWrapper: document.querySelector('.source'),
  useCaseCheckboxes: document.querySelector('.use-case').getElementsByTagName('input'),
  licenseCheckboxes: document.querySelector('.license').getElementsByTagName('input'),
  fileTypeCheckboxes: document.querySelector('.fileType').getElementsByTagName('input'),
  imageTypeCheckboxes: document.querySelector('.imageType').getElementsByTagName('input'),
  imageSizeCheckboxes: document.querySelector('.imageSize').getElementsByTagName('input'),
  aspectRatioCheckboxes: document.querySelector('.aspectRatio').getElementsByTagName('input'),
  sourceCheckboxes: document.querySelector('.source').getElementsByTagName('input'),
  enableMatureContentCheckbox: document.getElementsByClassName('enable-mature-content-checkbox'),
  saveFiltersButton: document.getElementById('save-filters'),
  tabsHeader: document.getElementsByClassName('tabs')[0].getElementsByTagName('ul')[0],
};

export default elements;
