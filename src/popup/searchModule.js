import { appObject } from './base';
import { showNotification } from '../utils';

export function checkInputError(inputText) {
  if (inputText === '') {
    showNotification('No search query provided', 'negative', 'notification--extension-popup');
    // to stop further js execution
    throw new Error('No search query provided');
  }
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
