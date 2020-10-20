export const elements = {
  importBookmarksButton: document.getElementById('import-bookmarks-button'),
  importBookmarksInput: document.getElementById('import-bookmarks-input'),
  useCaseCheckboxesWrapper: document.getElementsByClassName('usecase__wrapper')[0],
  licenseCheckboxesWrapper: document.getElementsByClassName('license__wrapper')[0],
  sourceCheckboxesWrapper: document.getElementsByClassName('source__wrapper')[0],
  fileTypeCheckboxesWrapper: document.getElementsByClassName('file-type__wrapper')[0],
  imageTypeCheckboxesWrapper: document.getElementsByClassName('image-type__wrapper')[0],
  imageSizeCheckboxesWrapper: document.getElementsByClassName('image-size__wrapper')[0],
  aspectRatioCheckboxesWrapper: document.getElementsByClassName('aspect-ratio__wrapper')[0],
  showMatureContentCheckboxWrapper: document.getElementsByClassName('show-mature-content__wrapper')[0],
  saveFiltersButton: document.getElementById('save-filters'),
  tabsHeader: document.getElementsByClassName('tabs')[0].getElementsByTagName('ul')[0],
  modalBackground: document.getElementsByClassName('modal--background')[0],
  modalBody: document.getElementsByClassName('modal--body')[0],
  modalButton: document.getElementsByClassName('modal--button')[0],
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
