import { elements, appObject, primaryGridMasonryObject } from './base';
import { removeChildNodes, showNotification } from '../utils';
import { removeSpinner } from './spinner';

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
 * @desc Returns the url that will be used to fetch images during "search by image-tag"
 * @return {string}
 */
export function getTagsUrl() {
  const { tagName, pageNo } = appObject;

  return `https://api.creativecommons.engineering/v1/images?tags=${tagName}&page=${pageNo}&page_size=20`;
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

/**
 * @desc Checks if the result-array(the response from the API) is empty or not. If it's empty, then
 * notify the user, and throw Error.
 * @param {Object[]} resultArray
 */
export function checkResultLength(resultArray) {
  if (resultArray.length === 0) {
    showNotification(
      'No Images Found. Please enter a different query.',
      'negative',
      'notification--extension-popup',
      4000,
    );
    removeSpinner(elements.spinnerPlaceholderPrimary);
    removeLoadMoreButton(elements.loadMoreSearchButtonWrapper);
    primaryGridMasonryObject.layout();
    throw new Error('No image found');
  } else {
    // render the "Load More" button if non empty result
    addLoadMoreButton(elements.loadMoreSearchButtonWrapper);
  }
}

/**
 * @desc Checks if API sent a HTTP 400 Bad Request. If yes, then notfiy the user, and throw Error.
 * @param {Object} apiResponse
 */
export function checkHTTP400(apiResponse) {
  if (Object.prototype.hasOwnProperty.call(apiResponse, 'error')) {
    removeLoadMoreButton(elements.loadMoreSearchButtonWrapper);
    removeSpinner(elements.spinnerPlaceholderPrimary);

    if (apiResponse.error === 'InputError') {
      showNotification('Not a valid search query.', 'negative', 'notification--extension-popup');
    } else {
      showNotification(
        'Some error occured. Please try again after some time.',
        'negative',
        'notification--extension-popup',
      );
    }

    throw new Error('400 Bad Request');
  }
}

/* Object that holds license icon class name(according to cc-vocabulary) and brief description about each license. */
export const licenseInfo = {
  by: {
    licenseIcon: 'cc-by',
    licenseDescription: 'Credit the creator.',
  },
  nc: {
    licenseIcon: 'cc-nc',
    licenseDescription: 'Commercial use not permitted',
  },
  sa: {
    licenseIcon: 'cc-sa',
    licenseDescription: 'Share adaptations under the same terms.',
  },
  nd: {
    licenseIcon: 'cc-nd',
    licenseDescription: 'No derivates or modifications permitted.',
  },
  pdm: {
    licenseIcon: 'cc-pd',
    licenseDescription: 'This work is marked as being in the public domain.',
  },
  cc0: {
    licenseIcon: 'cc-zero',
    licenseDescription: 'This work has been marked as dedicated to the public domain.',
  },
};
