import elements from './base';
import { showNotification, getLatestProviders } from '../utils';

export function restoreFilters(inputElements) {
  for (let i = 0; i < inputElements.length; i += 1) {
    const { id } = inputElements[i];
    chrome.storage.local.get({ [id]: false }, (items) => {
      // default value is false
      document.getElementById(id).checked = items[id];
    });
    chrome.storage.local.get(null, (items) => {
      console.log('all the storage items');
      console.log(items);
    });
  }
}

function addProvidersToDom(providers) {
  const { providerWrapper } = elements;
  providerWrapper.innerText = '';

  Object.keys(providers).forEach((key) => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = providers[key];

    const label = document.createElement('label');
    console.log(input.id);
    label.setAttribute('for', input.id);
    label.innerText = key;

    const breakLine = document.createElement('br');

    providerWrapper.appendChild(input);
    providerWrapper.appendChild(label);
    providerWrapper.appendChild(breakLine);
  });
  restoreFilters(elements.providerInputs);
}

export async function init() {
  restoreFilters(elements.useCaseInputs);
  restoreFilters(elements.licenseInputs);
  restoreFilters(elements.darkModeInput);
  const providers = await getLatestProviders();
  addProvidersToDom(providers);
}

export function saveSingleFilter(inputElements) {
  for (let i = 0; i < inputElements.length; i += 1) {
    const { id } = inputElements[i];
    const value = inputElements[i].checked;
    chrome.storage.local.set(
      {
        [id]: value, // using ES6 to use variable as key of object
      },
      () => {
        const { status } = elements;
        status.textContent = 'Saved!';
        setTimeout(() => {
          status.textContent = '';
        }, 1000);
        console.log(`${id} has been set to ${value}`);
      },
    );
  }
}

export function saveFiltersOptions() {
  saveSingleFilter(elements.useCaseInputs);
  saveSingleFilter(elements.licenseInputs);
  saveSingleFilter(elements.providerInputs);
}

export function saveDarkModeOptions() {
  saveSingleFilter(elements.darkModeInput);
}

export function updateBookmarks(newBookmarksids) {
  chrome.storage.local.get({ bookmarks: [] }, (items) => {
    const bookmarksArray = items.bookmarks;
    newBookmarksids.forEach((bookmarkId) => {
      if (bookmarksArray.indexOf(bookmarkId) === -1) {
        bookmarksArray.push(bookmarkId);
        console.log(bookmarksArray);
        chrome.storage.local.set({ bookmarks: bookmarksArray }, () => {
          console.log('bookmarks updated');
        });
      }
    });
    showNotification('Bookmarks updated!', 'positive', 'snackbar-options');
  });
}
