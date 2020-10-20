import { elements } from './base';
import { init, saveFilters, addBookmarksToStorage, addLegacyBookmarksToStorage } from './helper';
import { showNotification, allowCheckingOneTypeOfCheckbox, enableTabSwitching } from '../utils';

document.addEventListener('DOMContentLoaded', init);
elements.saveFiltersButton.addEventListener('click', saveFilters);
elements.tabsHeader.addEventListener('click', enableTabSwitching);

elements.importBookmarksButton.addEventListener('click', () => {
  const file = elements.importBookmarksInput.files[0];
  if (!file) {
    showNotification('No file choosen', 'negative', 'notification--options');
  } else if (file.type !== 'application/json') {
    showNotification('Wrong file type. Choose json file', 'negative', 'notification--options');
  } else {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = evt => {
      const fileContents = evt.target.result;
      try {
        const bookmarksObject = JSON.parse(fileContents);
        // if the file contains an array, then it's legacy bookmarkmarks file. They had
        // an array of image ids
        if (Array.isArray(bookmarksObject)) {
          if (bookmarksObject.length > 0) addLegacyBookmarksToStorage(bookmarksObject);
          else showNotification('No bookmarks found in the file', 'negative', 'notification--options');
        } else if (!Object.keys(bookmarksObject).length > 0) {
          showNotification('No bookmarks found in the file', 'negative', 'notification--options');
        } else addBookmarksToStorage(bookmarksObject);
      } catch (error) {
        showNotification('Error in parsing file', 'negative', 'notification--options');
        console.log(`Error: ${error}`);
      }
    };
  }
});

allowCheckingOneTypeOfCheckbox(elements.useCaseCheckboxesWrapper, elements.licenseCheckboxesWrapper);
