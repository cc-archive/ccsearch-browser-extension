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
  const { inputText, filters, enableMatureContent, pageNo } = appObject;
  const { useCase, license, source, fileType, imageType, imageSize, aspectRatio } = filters;

  if (useCase.length > 0) {
    return `https://api.creativecommons.engineering/v1/images?q=${inputText}&page=${pageNo}&page_size=20&license_type=${useCase}&source=${source}&extension=${fileType}&categories=${imageType}&size=${imageSize}&aspect_ratio=${aspectRatio}&mature=${enableMatureContent}`;
  }
  return `https://api.creativecommons.engineering/v1/images?q=${inputText}&page=${pageNo}&page_size=20&license=${license}&source=${source}&extension=${fileType}&categories=${imageType}&size=${imageSize}&aspect_ratio=${aspectRatio}&mature=${enableMatureContent}`;
}

/**
 * @desc Returns the url that will be used to fetch images during "search by sources"
 * @return {string}
 */
export function getCollectionsUrl() {
  const { collectionName, pageNo } = appObject;

  return `https://api.creativecommons.engineering/v1/images?source=${collectionName}&page=${pageNo}&page_size=20`;
}
