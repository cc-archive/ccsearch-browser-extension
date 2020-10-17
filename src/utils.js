export function showNotification(message, context, notificationWrapperClass, timeout) {
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
  }, timeout || 1500);
}

export function checkInternetConnection() {
  if (!navigator.onLine) {
    showNotification('No Internet Connection', 'negative', 'notification--extension-popup');
    throw new Error('No Internet Connection');
  }
}

export async function fetchSources() {
  const getSourceURL = 'https://api.creativecommons.engineering/v1/sources';
  const data = await fetch(getSourceURL);

  return data.json();
}

export async function getLatestSources() {
  try {
    // get raw data from the API
    const result = await fetchSources();

    // store key-value pairs : <source_name, display_name>
    const sources = {};
    result.forEach(source => {
      sources[source.source_name] = source.display_name;
    });

    return sources;
  } catch (error) {
    checkInternetConnection();
    showNotification(
      'Unable to fetch sources. Please try again after some time.',
      'negative',
      'notification--extension-popup',
      3500,
    );
    throw new Error('Error connecting to the API');
  }
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

export function loadFilterCheckboxesFromStorage(wrapperElement) {
  /* use case filter is stored in storage as an object, like:
      useCaseFilter: {
        commercial: false,
        modification: true,
      }
   */
  // for usecase, filterStorageKey is useCaseFilter
  const filterStorageKey = wrapperElement.dataset.storageKeyName;

  chrome.storage.sync.get(filterStorageKey, items => {
    const filterCheckboxIds = Object.keys(items[filterStorageKey]);
    // iterating over the input checkboxes of current filter (for usecase -> commercial and modification)
    // and marking them checked if value in storage is true
    filterCheckboxIds.forEach(filterCheckboxId => {
      const filterCheckbox = wrapperElement.querySelector(`#${filterCheckboxId}`);
      filterCheckbox.checked = items[filterStorageKey][filterCheckboxId];
    });
  });
}

export const activeBookmarkIdContainers = [
  'bookmarksImageIds0',
  'bookmarksImageIds1',
  'bookmarksImageIds2',
  'bookmarksImageIds3',
];

export const keyNames = [
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

export const activeBookmarkContainers = [
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
