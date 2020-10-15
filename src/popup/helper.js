import { elements, appObject } from './base';

export function clearFilters() {
  const checkboxesWrappers = [
    elements.useCaseCheckboxesWrapper,
    elements.licenseCheckboxesWrapper,
    elements.sourceCheckboxesWrapper,
    elements.fileTypeCheckboxesWrapper,
    elements.imageTypeCheckboxesWrapper,
    elements.imageSizeCheckboxesWrapper,
    elements.aspectRatioCheckboxesWrapper,
    elements.showMatureContentCheckboxWrapper,
  ];

  // unchecking all the filter checkboxes
  checkboxesWrappers.forEach(checkboxesWrapper => {
    const checkboxes = checkboxesWrapper.querySelectorAll('input[type=checkbox]');

    for (let i = 0; i < checkboxes.length; i += 1) {
      checkboxes[i].checked = false;
    }
  });

  appObject.resetFilters();
}

// convert Unicode sequence To String. credit: https://stackoverflow.com/a/22021709/10425980
export function unicodeToString(string) {
  if (typeof string === 'string') {
    return string.replace(/\\u[\dA-F]{4}/gi, match => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)));
  }
  return '';
}

export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function addLoadMoreButton(loadMoreButtonWrapper) {
  loadMoreButtonWrapper.classList.remove('display-none');
}

export function removeLoadMoreButton(loadMoreButtonWrapper) {
  loadMoreButtonWrapper.classList.add('display-none');
}
