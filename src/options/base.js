export const elements = {
  importBookmarksButton: document.getElementById('import-bookmarks-button'),
  importBookmarksInput: document.getElementById('import-bookmarks-input'),
  useCaseCheckboxesWrapper: document.querySelector('.usecase__wrapper'),
  licenseCheckboxesWrapper: document.querySelector('.license__wrapper'),
  sourceCheckboxesWrapper: document.querySelector('.source__wrapper'),
  fileTypeCheckboxesWrapper: document.querySelector('.file-type__wrapper'),
  imageTypeCheckboxesWrapper: document.querySelector('.image-type__wrapper'),
  imageSizeCheckboxesWrapper: document.querySelector('.image-size__wrapper'),
  aspectRatioCheckboxesWrapper: document.querySelector('.aspect-ratio__wrapper'),
  showMatureContentCheckboxWrapper: document.querySelector('.show-mature-content__wrapper'),
  saveFiltersButton: document.getElementById('save-filters'),
  tabsHeader: document.querySelector('.tabs').getElementsByTagName('ul')[0],
  modalBackground: document.querySelector('.modal--background'),
  modalBody: document.querySelector('.modal--body'),
  modalButton: document.querySelector('.modal--button'),
};

export const filterCheckboxWrappers = [
  elements.useCaseCheckboxesWrapper,
  elements.licenseCheckboxesWrapper,
  elements.fileTypeCheckboxesWrapper,
  elements.imageTypeCheckboxesWrapper,
  elements.imageSizeCheckboxesWrapper,
  elements.aspectRatioCheckboxesWrapper,
  elements.sourceCheckboxesWrapper,
  elements.showMatureContentCheckboxWrapper,
];
