/* eslint-disable no-param-reassign */
import elements from './base';
import {
  showNotification,
  getLatestSources,
  fetchImageData,
  keyNames,
  activeBookmarkIdContainers,
  activeBookmarkContainers,
} from '../utils';
import { constants } from '../popup/base';

export function restoreFilters(inputElements) {
  for (let i = 0; i < inputElements.length; i += 1) {
    const { id } = inputElements[i];
    chrome.storage.sync.get({ [id]: false }, items => {
      // default value is false
      document.getElementById(id).checked = items[id];
    });
    // chrome.storage.sync.get(null, items => {
    //   console.log('all the storage items');
    //   console.log(items);
    // });
  }
}

function addSourcesToDom(sources) {
  const { sourceWrapper } = elements;
  sourceWrapper.innerText = '';

  Object.keys(sources).forEach(key => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = sources[key];

    const label = document.createElement('label');
    label.setAttribute('for', input.id);
    label.innerText = key;
    label.classList = 'padding-left-smaller';

    const breakLine = document.createElement('br');

    sourceWrapper.appendChild(input);
    sourceWrapper.appendChild(label);
    sourceWrapper.appendChild(breakLine);
  });
  restoreFilters(elements.sourceInputs);
}

export async function init() {
  restoreFilters(elements.useCaseInputs);
  restoreFilters(elements.licenseInputs);
  restoreFilters(elements.fileTypeInputs);
  restoreFilters(elements.imageTypeInputs);
  restoreFilters(elements.imageSizeInputs);
  restoreFilters(elements.aspectRatioInputs);
  const sources = await getLatestSources();
  addSourcesToDom(sources);
}

export function saveSingleFilter(inputElements) {
  for (let i = 0; i < inputElements.length; i += 1) {
    const { id } = inputElements[i];
    const value = inputElements[i].checked;
    chrome.storage.sync.set(
      {
        [id]: value, // using ES6 to use variable as key of object
      },
      () => {
        showNotification('Settings saved!', 'positive', 'snackbar-options');
        // console.log(`${id} has been set to ${value}`);
      },
    );
  }
}

export function saveFiltersOptions() {
  saveSingleFilter(elements.useCaseInputs);
  saveSingleFilter(elements.licenseInputs);
  saveSingleFilter(elements.fileTypeInputs);
  saveSingleFilter(elements.imageTypeInputs);
  saveSingleFilter(elements.imageSizeInputs);
  saveSingleFilter(elements.aspectRatioInputs);
  saveSingleFilter(elements.sourceInputs);
}

export function addBookmarksToStorage(newBookmarksObject, showConfirmation = true) {
  const newKeyNames = keyNames;
  newKeyNames.push('bookmarks'); // also checking for legacy "bookmarks" key
  chrome.storage.sync.get(newKeyNames, items => {
    const bookmarksImageIdsObject = {};
    console.log(activeBookmarkIdContainers);
    activeBookmarkIdContainers.forEach(bookmarksImageIdContainerName => {
      console.log(bookmarksImageIdContainerName);
      const bookmarksImageIdContainer = items[bookmarksImageIdContainerName];
      console.log(bookmarksImageIdContainer);
      Object.keys(bookmarksImageIdContainer).forEach(id => {
        bookmarksImageIdsObject[id] = [bookmarksImageIdContainer[id], bookmarksImageIdContainerName.substring(17)];
      });
    });
    const bookmarksImageIds = Object.keys(bookmarksImageIdsObject);
    // if user tries to import bookmarks before the bookmarks storage data is updated
    if (Array.isArray(items.bookmarks)) {
      showNotification(
        'Error: First please open the extension popup to trigger the automatic update of bookmarks section. It will only take a few minutes',
        'negative',
        'snackbar-options',
      );
      throw new Error('Bookmarks data structures not updated');
    }

    const filteredBookmarksImageIds = [];
    const newBookmarksImageIds = Object.keys(newBookmarksObject);
    console.log(newBookmarksImageIds);
    newBookmarksImageIds.forEach(bookmarkId => {
      if (bookmarksImageIds.indexOf(bookmarkId) === -1) {
        filteredBookmarksImageIds.push(bookmarkId);
      }
    });
    console.log(filteredBookmarksImageIds);

    if (bookmarksImageIds.length + filteredBookmarksImageIds.length > constants.extensionBookmarkLimit) {
      showNotification(
        `Error: Cannot import because bookmark limit of ${constants.extensionBookmarkLimit} would be surpassed`,
        'negative',
        'snackbar-options',
        5000,
      );
      throw new Error('Cannot store bookmarks over bookmark limit');
    }
    let currBookmarkIdx = 0; // points to the bookmark id in filteredBookmarksImageIds

    const bookmarkIdContainerNum = {};

    // adding bookmarks data to bookmark containers
    for (let i = 0; i < activeBookmarkContainers.length; i += 1) {
      let allProcessed = false;
      const bookmarkContainerName = activeBookmarkContainers[i];
      const currContainerLength = items.bookmarksLength[bookmarkContainerName];
      for (let j = currContainerLength; j < constants.bookmarkContainerSize; j += 1) {
        if (currBookmarkIdx === filteredBookmarksImageIds.length) {
          allProcessed = true;
          break;
        }
        const currBookmarkImageId = filteredBookmarksImageIds[currBookmarkIdx];
        items[bookmarkContainerName][currBookmarkImageId] = newBookmarksObject[currBookmarkImageId];
        items.bookmarksLength[bookmarkContainerName] += 1;
        bookmarkIdContainerNum[currBookmarkImageId] = bookmarkContainerName.substring(9);
        currBookmarkIdx += 1;
      }
      if (allProcessed) break;
    }

    currBookmarkIdx = 0;
    // adding bookmarks Image Ids to bookmark Image Ids containers
    for (let i = 0; i < activeBookmarkIdContainers.length; i += 1) {
      const bookmarkIdContainerName = activeBookmarkIdContainers[i];
      while (currBookmarkIdx < filteredBookmarksImageIds.length) {
        if (Object.keys(items[bookmarkIdContainerName]).length >= constants.bookmarkImageIdContainerSize) break;
        const currBookmarkId = filteredBookmarksImageIds[currBookmarkIdx];
        items[bookmarkIdContainerName][currBookmarkId] = bookmarkIdContainerNum[currBookmarkId];
        currBookmarkIdx += 1;
      }
    }

    console.log(items);
    chrome.storage.sync.set(items);

    if (showConfirmation) showNotification('Bookmarks updated!', 'positive', 'snackbar-options');
  });
}

export async function addLegacyBookmarksToStorage(bookmarksArray) {
  const newKeyNames = keyNames;
  newKeyNames.push('bookmarks'); // also checking for legacy "bookmarks" key
  chrome.storage.sync.get(newKeyNames, async items => {
    const bookmarksImageIdsObject = {};
    activeBookmarkIdContainers.forEach(bookmarksImageIdContainerName => {
      const bookmarksImageIdContainer = items[bookmarksImageIdContainerName];
      Object.keys(bookmarksImageIdContainer).forEach(id => {
        bookmarksImageIdsObject[id] = [bookmarksImageIdContainer[id], bookmarksImageIdContainerName.substring(17)];
      });
    });
    const bookmarksImageIds = Object.keys(bookmarksImageIdsObject);
    // const bookmarksObject = items.bookmarks;
    // if user tries to import bookmarks before the bookmarks storage data is updated
    if (Array.isArray(items.bookmarks)) {
      showNotification(
        'Error: First please open the extension popup to trigger the automatic update of bookmarks section. It will only take a few minutes',
        'negative',
        'snackbar-options',
        5500,
      );
      throw new Error('Bookmarks data structures not updated');
    }

    document.querySelector('.notification__options--background').style.display = 'flex';
    document.querySelector('.notification__options--body button').classList.add('is-loading');
    document.querySelector('.notification__options--body button').addEventListener('click', () => {
      document.querySelector('.notification__options--background').style.display = 'none';
    });

    let newBookmarksObject = {};
    let bookmarkBatchCount = 0; // to track the number of bookmarks processed and pushed into newBookmarksObject
    for (let i = 0; i < bookmarksArray.length; i += 1) {
      const bookmarkId = bookmarksArray[i];
      if (bookmarksImageIds.indexOf(bookmarkId) === -1) {
        // eslint-disable-next-line no-await-in-loop
        const res = await fetchImageData(bookmarkId);
        const imageDetailResponse = res[0];
        const responseCode = res[1];
        const imageObject = {};
        if (responseCode === 429) {
          document.querySelector('.notification__options--body p').innerText =
            'The process has stoped due to surpassing the API limit. Some bookmarks have been imported. Refresh and upload the file after 5 minutes to import the rest.';
          throw new Error('API limit reached');
        } else if (responseCode === 200) {
          imageObject.thumbnail = imageDetailResponse.thumbnail
            ? imageDetailResponse.thumbnail
            : imageDetailResponse.url;
          imageObject.license = imageDetailResponse.license;
          console.log(imageObject);
          newBookmarksObject[bookmarkId] = imageObject;
          bookmarkBatchCount += 1;
          // add bookmarks in the batch of 5 to storage
          if (bookmarkBatchCount === 5) {
            addBookmarksToStorage(newBookmarksObject, false);
            bookmarkBatchCount = 0;
            newBookmarksObject = {};
          }
        }
      }
    }
    console.log(newBookmarksObject);
    addBookmarksToStorage(newBookmarksObject); // add left out bookmarks to storage
    document.querySelector('.notification__options--body button').disabled = false;
    document.querySelector('.notification__options--body button').classList.remove('is-loading');
    showNotification('Bookmarks updated!', 'positive', 'snackbar-options');
  });
}

export function toggleAccordion() {
  this.classList.toggle('active');
  this.nextElementSibling.classList.toggle('active');
}
