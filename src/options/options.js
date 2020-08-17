import elements from './base';
import { init, saveFiltersOptions, addBookmarksToStorage, handleLegacyBookmarksFile } from './helper';
import { showNotification, allowCheckingOneTypeOfCheckbox, enableTabSwitching } from '../utils';

document.addEventListener('DOMContentLoaded', init);

elements.saveFiltersButton.addEventListener('click', saveFiltersOptions);

allowCheckingOneTypeOfCheckbox(elements.useCaseCheckboxesWrapper, elements.licenseCheckboxesWrapper);

elements.importBookmarksButton.addEventListener('click', () => {
  const file = elements.importBookmarksInput.files[0];
  if (!file) {
    showNotification('No file choosen', 'negative', 'snackbar-options');
  } else if (file.type !== 'application/json') {
    showNotification('Wrong file type. Choose json file', 'negative', 'snackbar-options');
  } else {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = evt => {
      const fileContents = evt.target.result;
      try {
        const bookmarksObject = JSON.parse(fileContents);
        if (typeof bookmarksObject === 'object') {
          if (Array.isArray(bookmarksObject)) {
            handleLegacyBookmarksFile(bookmarksObject);
          } else if (!(Object.keys(bookmarksObject).length > 0))
            showNotification('Error: No bookmarks found in the file', 'negative', 'snackbar-options');
          else {
            addBookmarksToStorage(bookmarksObject);
          }
        } else {
          showNotification('Error: File contents not in the required format', 'negative', 'snackbar-options');
        }
      } catch (error) {
        showNotification('Error in parsing file', 'negative', 'snackbar-options');
      }
    };
  }
});

elements.tabsHeader.addEventListener('click', enableTabSwitching);
