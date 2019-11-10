import elements from './base';
import { showNotification, getLatestProviders } from '../utils';

export function restoreFilters(inputElements) {
  for (let i = 0; i < inputElements.length; i += 1) {
    const { id } = inputElements[i];
    chrome.storage.sync.get({ [id]: false }, (items) => {
      // default value is false
      document.getElementById(id).checked = items[id];
    });
    // chrome.storage.sync.get(null, (items) => {
    //   console.log('all the storage items');
    //   console.log(items);
    // });
  }
}

function addProvidersToDom(providers) {
  const { providerWrapper } = elements;
  providerWrapper.innerText = '';

  Object.keys(providers).forEach((key) => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = providers[key];
    input.classList = 'vocab choice-field magenta-colored small-sized';

    const label = document.createElement('label');
    label.setAttribute('for', input.id);
    label.innerText = key;
    label.classList = 'padding-left-smaller';

    const breakLine = document.createElement('br');

    providerWrapper.appendChild(input);
    providerWrapper.appendChild(label);
    providerWrapper.appendChild(breakLine);
  });
  restoreFilters(elements.providerInputs);
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
        if (chrome.runtime.lastError) {
          showNotification('Too many changes! Please try again after some time', 'negative', 'snackbar-options');
        } else {
          showNotification('Settings saved!', 'positive', 'snackbar-options');
          // console.log(`${id} has been set to ${value}`);
        }
      },
    );
  }
}

export function saveFiltersOptions() {
  saveSingleFilter(elements.useCaseInputs);
  saveSingleFilter(elements.licenseInputs);
  saveSingleFilter(elements.providerInputs);
}

export function delayedSaveFiltersOptions() {
  setTimeout(saveFiltersOptions, 2000);
}

export function saveDarkModeOptions() {
  saveSingleFilter(elements.darkModeInput);
}

export async function init() {
  restoreFilters(elements.useCaseInputs);
  restoreFilters(elements.licenseInputs);
  restoreFilters(elements.darkModeInput);
  const providers = await getLatestProviders();
  addProvidersToDom(providers);
  [...elements.useCaseInputs].map((x) => {
    x.addEventListener('change', delayedSaveFiltersOptions);
    return x;
  });
  [...elements.licenseInputs].map((x) => {
    x.addEventListener('change', delayedSaveFiltersOptions);
    return x;
  });
  [...elements.providerInputs].map((x) => {
    x.addEventListener('change', delayedSaveFiltersOptions);
    return x;
  });
}

export function updateBookmarks(newBookmarksids) {
  chrome.storage.sync.get({ bookmarks: [] }, (items) => {
    const bookmarksArray = items.bookmarks;
    newBookmarksids.forEach((bookmarkId) => {
      if (bookmarksArray.indexOf(bookmarkId) === -1) {
        bookmarksArray.push(bookmarkId);
        chrome.storage.sync.set({ bookmarks: bookmarksArray }, () => {
          // console.log('bookmarks updated');
        });
      }
    });
    showNotification('Bookmarks updated!', 'positive', 'snackbar-options');
  });
}
