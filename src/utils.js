/**
 * @desc Shows a notification to the user.
 * @param {string} message - The message to show.
 * @param {string} context - positive or negative.
 * @param {HTMLElement} notificationWrapperClass
 * @param {number} timeout=1500 - The time(in milisecond) for the notification should be seen
 */
export function showNotification(message, context, notificationWrapperClass, timeout = 1500) {
  const notificationWrapperDiv = document.getElementsByClassName(notificationWrapperClass)[0];
  const notificationContainer = notificationWrapperDiv.getElementsByClassName('notification-container')[0];
  const notificationPara = notificationContainer.getElementsByTagName('p')[0];

  notificationContainer.classList.remove('has-background-success-light');
  notificationContainer.classList.remove('has-background-danger-light');

  notificationPara.innerText = message;
  notificationWrapperDiv.classList.remove('display-none');
  if (context === 'positive') notificationContainer.classList.add('has-background-success-light');
  else if (context === 'negative') notificationContainer.classList.add('has-background-danger-light');

  setTimeout(() => {
    notificationPara.innerText = '';
    notificationWrapperDiv.classList.add('display-none');
    notificationContainer.classList.remove('has-background-success-light');
    notificationContainer.classList.remove('has-background-danger-light');
  }, timeout);
}

export function checkInternetConnection() {
  if (!navigator.onLine) {
    showNotification('No Internet Connection', 'negative', 'notification--extension-popup');
    throw new Error('No Internet Connection');
  }
}

/**
 * @desc Confirm the success status of the API response(HTTP 200). If not, then shows
 * notification and throws error.
 * @param {Object} response
 * @param {string} context - The context in which the API request was made (default search,
 * search by image-tag, search by sources)
 */
function checkAPIResponse(response, context) {
  if (response.status !== 200) {
    let message;
    if (context === 'sources') message = 'Unable to fetch sources. Please try again after some time.';
    else if (context === 'images') message = 'Some error occured while fetching images. Please try after some time.';
    else if (context === 'image')
      message = 'Some error occured while fetching information of this image. Please try again after some time.';

    showNotification(message, 'negative', 'notification--extension-popup', 3000);
    throw new Error(`API Error. Response: ${response}`);
  }
}

export async function fetchSources() {
  const requestUrl = 'https://api.creativecommons.engineering/v1/sources';
  const response = await fetch(requestUrl);
  checkAPIResponse(response, 'sources');
  return response.json();
}

export async function fetchImage(requestUrl) {
  const response = await fetch(requestUrl);
  checkAPIResponse(response, 'image');
  const data = await response.json();
  return data;
}

export async function fetchImages(requestUrl) {
  const response = await fetch(requestUrl);
  checkAPIResponse(response, 'images');
  const data = await response.json();
  return data.results;
}

/**
 * @desc Parses the latest sources after fetching them from the API to returns
 * an object containing <source_name, display_name>
 * @returns {Object}
 */
export async function getLatestSources() {
  checkInternetConnection();

  // get raw data from the API
  const result = await fetchSources();

  // store key-value pairs : <source_name, display_name>
  const sources = {};
  result.forEach(source => {
    sources[source.source_name] = source.display_name;
  });

  return sources;
}

export function removeChildNodes(targetNode) {
  while (targetNode.lastChild) {
    targetNode.removeChild(targetNode.lastChild);
  }
}

export async function fetchImageData(imageId) {
  const url = `https://api.creativecommons.engineering/v1/images/${imageId}`;
  const data = await fetch(url);
  const responseCode = data.status;
  const res = await data.json();

  return [res, responseCode];
}

/**
 * @desc Makes the checkboxes of two checkbox-wrapper to never be checked at the same time.
 * @param {HTMLElement} checkboxesWrapper1
 * @param {HTMLElement} checkboxesWrapper2
 */
export function allowCheckingOneTypeOfCheckbox(checkboxesWrapper1, checkboxesWrapper2) {
  const checkboxesFirst = checkboxesWrapper1.querySelectorAll('input[type=checkbox]');
  const checkboxesSecond = checkboxesWrapper2.querySelectorAll('input[type=checkbox]');

  [
    [checkboxesFirst, checkboxesSecond],
    [checkboxesSecond, checkboxesFirst],
  ].forEach(item => {
    Array.prototype.forEach.call(item[0], element => {
      element.addEventListener('click', e => {
        if (e.target.checked) {
          Array.prototype.forEach.call(item[1], licenseElement => {
            // eslint-disable-next-line no-param-reassign
            licenseElement.checked = false;
          });
        }
      });
    });
  });
}

// tab switching logic
export function enableTabSwitching(e) {
  // removing active class
  if (e.target.parentElement.classList.contains('tab')) {
    Array.prototype.forEach.call(e.currentTarget.getElementsByClassName('is-active'), element => {
      element.classList.remove('is-active');
    });

    // add active class to the clicked tab header
    e.target.parentElement.classList.add('is-active');

    const tabsDiv = e.target.parentElement.parentElement.parentElement;
    const tabsContentDiv = tabsDiv.nextElementSibling;
    const tabNo = e.target.parentElement.getAttribute('data-tab-no');

    let targetPanelDiv;

    // removing active class from any tab content div
    Array.prototype.forEach.call(tabsContentDiv.children, element => {
      element.classList.remove('is-active');
      if (element.getAttribute('data-content-no') === tabNo) {
        // saving the target content div
        targetPanelDiv = element;
      }
    });

    // adding active class to target content div
    targetPanelDiv.classList.add('is-active');
  }
}

/**
 * @desc Mark the user default for the provided filter wrapper after fetching
 * them from the sync storage.
 * @param {HTMLElement} checkboxWrapper
 */
export function markDefaultFilters(checkboxWrapper) {
  // eg: for usecase, filterStorageKey is useCaseFilter
  const filterStorageKey = checkboxWrapper.dataset.storageKeyName;

  chrome.storage.sync.get(filterStorageKey, items => {
    const filterCheckboxIds = Object.keys(items[filterStorageKey]);
    // iterating over the input checkboxes of current filter (eg: usecase has: commercial
    // and modification) and marking them checked if value in storage is true
    filterCheckboxIds.forEach(filterCheckboxId => {
      const filterCheckbox = checkboxWrapper.querySelector(`#${filterCheckboxId}`);
      filterCheckbox.checked = items[filterStorageKey][filterCheckboxId];
    });
  });
}

/* The following are the arrays containing names of keys that stores the data related to the
  bookmark sections and workflows in the sync storage. More about them in 'popup.utils.js'
 */

// bookmark id containers are objects that contains <image-id, bookmark container no.> pairs.
export const bookmarkIdContainers = [
  'bookmarksImageIds0',
  'bookmarksImageIds1',
  'bookmarksImageIds2',
  'bookmarksImageIds3',
];

// bookmark containers are objects that contains image-id, license, thumbnail.
export const bookmarkContainers = [
  'bookmarks0',
  'bookmarks1',
  'bookmarks2',
  'bookmarks3',
  'bookmarks4',
  'bookmarks5',
  'bookmarks6',
  'bookmarks7',
  'bookmarks8',
  'bookmarks9',
];

// all the sync storage keys that are required for the bookmarks section and related workflows.
export const allBookmarkKeyNames = [
  'bookmarks0',
  'bookmarks1',
  'bookmarks2',
  'bookmarks3',
  'bookmarks4',
  'bookmarks5',
  'bookmarks6',
  'bookmarks7',
  'bookmarks8',
  'bookmarks9',
  'bookmarksImageIds0',
  'bookmarksImageIds1',
  'bookmarksImageIds2',
  'bookmarksImageIds3',
  'bookmarksLength',
];
