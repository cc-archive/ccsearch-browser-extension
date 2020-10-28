import { elements, filterCheckboxWrappers } from './base';
import {
  showNotification,
  getLatestSources,
  allBookmarkKeyNames,
  bookmarkIdContainers,
  bookmarkContainers,
  markDefaultFilters,
  fetchImage,
} from '../utils';
import { appConfig } from '../popup/base';

/**
 * @desc Makes input checkboxes for the latest sources and adds them in the filter section.
 */
function addSourcesToDom(sources) {
  const { sourceCheckboxesWrapper } = elements;
  sourceCheckboxesWrapper.innerText = '';

  Object.keys(sources).forEach(source => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = source;

    const label = document.createElement('label');
    label.setAttribute('for', input.id);
    label.innerText = source;
    label.classList = 'padding-left-smaller';

    const breakLine = document.createElement('br');

    sourceCheckboxesWrapper.appendChild(input);
    sourceCheckboxesWrapper.appendChild(label);
    sourceCheckboxesWrapper.appendChild(breakLine);
  });
  markDefaultFilters(elements.sourceCheckboxesWrapper);
}

/**
 * @desc Uses the checkboxes that lies inside the passed DOM wrapper element to
 * update the preferences for that particual filters in the sync store.
 * @param {HTMLElement} wrapperElement
 */
function saveSingleFilter(wrapperElement) {
  const filterStorageKey = wrapperElement.dataset.storageKeyName;
  const filterCheckboxElements = wrapperElement.getElementsByTagName('input');

  chrome.storage.sync.get(filterStorageKey, items => {
    for (const checkbox of filterCheckboxElements) {
      // eslint-disable-next-line no-param-reassign
      items[filterStorageKey][checkbox.id] = checkbox.checked;
    }

    chrome.storage.sync.set(items, () => {
      showNotification('Settings saved!', 'positive', 'notification--options');
    });
  });
}

export async function init() {
  filterCheckboxWrappers.forEach(wrapper => {
    if (wrapper !== elements.sourceCheckboxesWrapper) markDefaultFilters(wrapper);
  });
  const sources = await getLatestSources();
  addSourcesToDom(sources);
}

export function saveFilters() {
  filterCheckboxWrappers.forEach(wrapper => {
    saveSingleFilter(wrapper);
  });
}

/**
 * @desc Parses the sync storage object and returns an array of all the image
 * ids present in sync store.
 * @param {Object} items
 * @returns {string[]}
 */
function getAllImageIds(items) {
  let allImageIds = [];
  bookmarkIdContainers.forEach(container => {
    allImageIds = [...Object.keys(items[container]), ...allImageIds];
  });

  return allImageIds;
}

/**
 * @desc Adds bookmark images to sync storage.
 * @param {Object} newBookmarks - Bookmarks that needs to be added to sync store.
 * @param {bool} showConfirmation=true - whether to show the notification of completion to user or not.
 */
export function addBookmarksToStorage(newBookmarks, showConfirmation = true) {
  chrome.storage.sync.get(allBookmarkKeyNames, items => {
    // for storing id's of all the bookmarks already present in sync storage
    const allImageIds = getAllImageIds(items);
    // for storing id's of the bookmarks that are not already present in the sync store.
    const newImageIds = [];

    Object.keys(newBookmarks).forEach(bookmarkId => {
      if (allImageIds.indexOf(bookmarkId) === -1) {
        newImageIds.push(bookmarkId);
      }
    });

    if (allImageIds.length + newImageIds.length > appConfig.extensionBookmarkLimit) {
      showNotification(
        `Error: Cannot import because bookmark limit of ${appConfig.extensionBookmarkLimit} would be surpassed`,
        'negative',
        'notification--options',
        5000,
      );
      throw new Error('Cannot store bookmarks over bookmark limit');
    }

    let currIdx = 0; // points to the first unprocessed bookmark id in newImageIds
    const bookmarkIdContainerNum = {};

    // adding bookmarks data to bookmark containers
    for (const bookmarkContainerName of bookmarkContainers) {
      let allProcessed = false;
      const currContainerLength = items.bookmarksLength[bookmarkContainerName];

      for (let j = currContainerLength; j < appConfig.bookmarkContainerSize; j += 1) {
        if (currIdx === newImageIds.length) {
          allProcessed = true;
          break;
        }
        const currImageId = newImageIds[currIdx];
        // eslint-disable-next-line no-param-reassign
        items[bookmarkContainerName][currImageId] = newBookmarks[currImageId];
        // eslint-disable-next-line no-param-reassign
        items.bookmarksLength[bookmarkContainerName] += 1;
        bookmarkIdContainerNum[currImageId] = bookmarkContainerName.substring(9);
        currIdx += 1;
      }
      if (allProcessed) break;
    }

    currIdx = 0;

    // adding new bookmarks-ids to bookmark-id containers
    for (const bookmarkIdContainerName of bookmarkIdContainers) {
      while (currIdx < newImageIds.length) {
        if (Object.keys(items[bookmarkIdContainerName]).length >= appConfig.bookmarkIdContainerSize) break;
        const currBookmarkId = newImageIds[currIdx];
        // eslint-disable-next-line no-param-reassign
        items[bookmarkIdContainerName][currBookmarkId] = bookmarkIdContainerNum[currBookmarkId];
        currIdx += 1;
      }
    }

    chrome.storage.sync.set(items);

    if (showConfirmation) showNotification('Bookmarks updated!', 'positive', 'notification--options');
  });
}

/**
 * @desc Parses the content stored in the legacy bookmark file(ie: image-ids) and converts it into
 * the required structure. Adds these bookmarks to sync storage by calling 'addBookmarksToStorage'.
 * @param {string[]} bookmarksArray - An array of image ids.
 */
export async function addLegacyBookmarksToStorage(bookmarksArray) {
  chrome.storage.sync.get(allBookmarkKeyNames, async items => {
    // for storing id's of all the bookmarks already present in sync storage
    const allImageIds = getAllImageIds(items);

    // Open the modal which tells the user that importing may take some time
    // because the data is being fetched from the API
    elements.modalBackground.style.display = 'flex';
    elements.modalBody.classList.add('is-loading');
    elements.modalButton.addEventListener('click', () => {
      elements.modalBackground.style.display = 'none';
    });

    let newBookmarksObject = {};
    // tracks the number of bookmarks processed and pushed into newBookmarksObject
    let bookmarkBatchCount = 0;

    for (const imageId of bookmarksArray) {
      // only import the current bookmarks if it's not already present.
      if (allImageIds.indexOf(imageId) === -1) {
        // eslint-disable-next-line no-await-in-loop
        const [image, responseCode] = await fetchImage(
          `https://api.creativecommons.engineering/v1/images/${imageId}`,
          true,
        );

        if (responseCode === 429) {
          // surpased API rate limit.
          elements.modalBody.getElementsByTagName('p')[0].innerText =
            'The process has stoped due to surpassing the API limit. Some bookmarks have been imported. Refresh and upload the file after 5 minutes to import the rest.';
          throw new Error('API limit reached');
        } else if (responseCode === 200) {
          // stores the data in the required format
          newBookmarksObject[imageId] = {
            thumbnail: image.thumbnail ? image.thumbnail : image.url,
            license: image.license,
          };
          bookmarkBatchCount += 1;
          // add bookmarks in the batch of 10 to storage. This allows completting
          // the process without surpassing the sync storage write limit.
          if (bookmarkBatchCount === 10) {
            addBookmarksToStorage(newBookmarksObject, false);
            bookmarkBatchCount = 0;
            newBookmarksObject = {};
          }
        } else {
          showNotification('Error occured while connecting with the API', 'negative', 'notification--options');
          console.log(`Error: ${responseCode}`);
        }
      }
    }
    addBookmarksToStorage(newBookmarksObject); // add the rest of the bookmarks to storage

    elements.modalButton.disabled = false;
    elements.modalButton.classList.remove('is-loading');
    showNotification('Bookmarks updated!', 'positive', 'notification--options');
  });
}
