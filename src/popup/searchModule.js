import { elements, appObject } from './base';
import { addLoadMoreButton, removeLoadMoreButton } from './helper';
import { removeSpinner } from './spinner';
import primaryGridMasonryObject from './searchModule.utils';
import { showNotification, removeChildNodes } from '../utils';
// eslint-disable-next-line import/no-cycle
import { addImagesToDOM } from './localUtils';

export function checkInputError(inputText) {
  if (inputText === '') {
    showNotification('No search query provided', 'negative', 'notification--extension-popup');
    // to stop further js execution
    throw new Error('No search query provided');
  }
}

export function removeOldSearchResults() {
  // remove old images for a new search
  const div = document.createElement('div');
  div.classList.add('gutter-sizer');
  removeChildNodes(elements.gridPrimary);
  elements.gridPrimary.appendChild(div);
}

/**
 * @desc Returns the url that will be used to fetch images during default search
 * @return {string}
 */
export function getRequestUrl() {
  const {
    inputText,
    useCaseFilters,
    licenseFilters,
    sourceFilters,
    fileTypeFilters,
    imageTypeFilters,
    imageSizeFilters,
    aspectRatioFilters,
    enableMatureContent,
    pageNo,
  } = appObject;

  if (useCaseFilters.length > 0) {
    return `https://api.creativecommons.engineering/v1/images?q=${inputText}&page=${pageNo}&page_size=20&license_type=${useCaseFilters}&source=${sourceFilters}&extension=${fileTypeFilters}&categories=${imageTypeFilters}&size=${imageSizeFilters}&aspect_ratio=${aspectRatioFilters}&mature=${enableMatureContent}`;
  }
  return `https://api.creativecommons.engineering/v1/images?q=${inputText}&page=${pageNo}&page_size=20&license=${licenseFilters}&source=${sourceFilters}&extension=${fileTypeFilters}&categories=${imageTypeFilters}&size=${imageSizeFilters}&aspect_ratio=${aspectRatioFilters}&mature=${enableMatureContent}`;
}

/**
 * @desc Returns the url that will be used to fetch images during "search by sources"
 * @return {string}
 */
export function getCollectionsUrl() {
  const { collectionName, pageNo } = appObject;

  return `https://api.creativecommons.engineering/v1/images?source=${collectionName}&page=${pageNo}&page_size=20`;
}

/**
 * @desc Returns the url that will be used to fetch images during "search by image-tag"
 * @return {string}
 */
export function getTagsUrl() {
  const { tagName, pageNo } = appObject;

  return `https://api.creativecommons.engineering/v1/images?tags=${tagName}&page=${pageNo}&page_size=20`;
}

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

export function checkValidationError(apiResponse) {
  if (Object.prototype.hasOwnProperty.call(apiResponse, 'error_type')) {
    removeLoadMoreButton(elements.loadMoreSearchButtonWrapper);
    removeSpinner(elements.spinnerPlaceholderPrimary);

    if (apiResponse.error_type === 'InputError') {
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

export function search(url) {
  fetch(url)
    .then(data => data.json())
    .then(res => {
      checkValidationError(res);
      const resultArray = res.results;

      checkResultLength(resultArray);
      addImagesToDOM(primaryGridMasonryObject, resultArray, elements.gridPrimary);

      appObject.pageNo += 1;
    });
}
