import elements from './base';
import { showNotification, getLatestSources } from '../utils';

export function restoreFilters(inputElements) {
  for (let i = 0; i < inputElements.length; i += 1) {
    const { id } = inputElements[i];
    chrome.storage.sync.get({ [id]: false }, items => {
      // default value is false
      document.getElementById(id).checked = items[id];
    });
    // chrome.storage.sync.get(null, (items) => {
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
  saveSingleFilter(elements.sourceInputs);
}

export function updateBookmarks(newBookmarksids) {
  chrome.storage.sync.get({ bookmarks: [] }, items => {
    const bookmarksArray = items.bookmarks;
    newBookmarksids.forEach(bookmarkId => {
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

export function toggleAccordion() {
  this.classList.toggle('active');
  this.nextElementSibling.classList.toggle('active');
}
