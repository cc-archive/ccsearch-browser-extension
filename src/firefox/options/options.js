import elements from './base';
import { init, saveFilters, updateBookmarks } from './helper';
import { showNotification } from '../utils';

const download = require('downloadjs');

document.addEventListener('DOMContentLoaded', init);

elements.saveButton.addEventListener('click', saveFilters);

// Making sure that only license or use-case is selected at the same time
Array.prototype.forEach.call(elements.useCaseInputs, (element) => {
  element.addEventListener('click', (e) => {
    console.log(`${e.target} clicked`);
    if (e.target.checked) {
      Array.prototype.forEach.call(elements.licenseInputs, (licenseElement) => {
        // eslint-disable-next-line no-param-reassign
        licenseElement.checked = false;
      });
    }
  });
});

Array.prototype.forEach.call(elements.licenseInputs, (element) => {
  element.addEventListener('click', (e) => {
    console.log(`${e.target} clicked`);
    if (e.target.checked) {
      Array.prototype.forEach.call(elements.useCaseInputs, (licenseElement) => {
        // eslint-disable-next-line no-param-reassign
        licenseElement.checked = false;
      });
    }
  });
});

elements.exportBookmarksButton.addEventListener('click', () => {
  chrome.storage.local.get({ bookmarks: [] }, (items) => {
    const bookmarksArray = items.bookmarks;
    console.log(bookmarksArray);
    const bookmarksString = JSON.stringify(bookmarksArray);
    download(bookmarksString, 'bookmarks.json', 'text/plain');
  });
});

elements.importBookmarksButton.addEventListener('click', () => {
  const file = elements.importBookmarksInput.files[0];
  if (!file) {
    showNotification('No file choosen', 'negative', 'snackbar-options');
  } else if (file.type !== 'application/json') {
    showNotification('Wrong file type. Choose json file', 'negative', 'snackbar-options');
  } else {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (evt) => {
      const fileContents = evt.target.result;
      // TODO: handle JSON parsing errors
      const bookmarksArray = JSON.parse(fileContents);
      if (Array.isArray(bookmarksArray)) {
        if (!bookmarksArray.length > 0) showNotification('No bookmark ids found in file', 'negative', 'snackbar-options');
        else {
          updateBookmarks(bookmarksArray);
        }
      } else {
        showNotification(
          'Contents not in valid format of ["id1", "id2", ...]',
          'negative',
          'snackbar-options',
        );
      }
    };
  }
});
