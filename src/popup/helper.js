import { elements, appObject } from './base';
import { removeChildNodes } from '../utils';

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

/**
 * @desc Removes everything, including images(grid-items), from inside the given HTML element and
 * inserts a div with the class 'gutter-sizer' which is used by masonry in case new images are inserted.
 * @param {HTMLElement} gridDiv
 */
export function removeImagesFromGrid(gridDiv) {
  const div = document.createElement('div');
  div.classList.add('gutter-sizer');
  removeChildNodes(gridDiv);
  gridDiv.appendChild(div);
}

/**
 * @desc Returns true if the given object is empty.
 * @param {Object} obj
 * @returns {bool}
 */
export function isObjectEmpty(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function addLoadMoreButton(loadMoreButtonWrapper) {
  loadMoreButtonWrapper.classList.remove('display-none');
}

export function removeLoadMoreButton(loadMoreButtonWrapper) {
  loadMoreButtonWrapper.classList.add('display-none');
}
