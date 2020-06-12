import elements from './base';
import { init, saveFiltersOptions, updateBookmarks, toggleAccordion } from './helper';
import { showNotification } from '../utils';

document.addEventListener('DOMContentLoaded', init);

elements.saveFiltersButton.addEventListener('click', saveFiltersOptions);

// Making sure that only license or use-case is selected at the same time
Array.prototype.forEach.call(elements.useCaseInputs, element => {
  element.addEventListener('click', e => {
    if (e.target.checked) {
      Array.prototype.forEach.call(elements.licenseInputs, licenseElement => {
        // eslint-disable-next-line no-param-reassign
        licenseElement.checked = false;
      });
    }
  });
});

Array.prototype.forEach.call(elements.licenseInputs, element => {
  element.addEventListener('click', e => {
    if (e.target.checked) {
      Array.prototype.forEach.call(elements.useCaseInputs, licenseElement => {
        // eslint-disable-next-line no-param-reassign
        licenseElement.checked = false;
      });
    }
  });
});

elements.enableSearchStorageCheckbox.addEventListener('click', () => {
  chrome.storage.sync.set({ enableSearchStorage: elements.enableSearchStorageCheckbox.checked }, () => {
    showNotification('Settings Saved', 'positive', 'snackbar-options');
  });

  // Clear Saved Search If user selects the option to not save their search.
  if (!elements.enableSearchStorageCheckbox.checked) localStorage.clear();
});

// Mark the checkboxes in the "Other Settings" tab according to the local storage values
function initOtherSettingsCheckboxes() {
  chrome.storage.sync.get(['enableSearchStorage'], res => {
    elements.enableSearchStorageCheckbox.checked = res.enableSearchStorage;
  });
  chrome.storage.sync.get(['enableSearchClearConfirm'], res => {
    elements.enableSearchClearConfirmCheckbox.checked = res.enableSearchClearConfirm;
  });
  chrome.storage.sync.get(['enableMatureContent'], res => {
    elements.enableMatureContentCheckbox.checked = res.enableMatureContent;
  });
}

initOtherSettingsCheckboxes();

elements.enableSearchClearConfirmCheckbox.addEventListener('click', () => {
  chrome.storage.sync.set(
    {
      enableSearchClearConfirm: elements.enableSearchClearConfirmCheckbox.checked,
    },
    () => {
      showNotification('Settings Saved', 'positive', 'snackbar-options');
    },
  );
});

elements.enableMatureContentCheckbox.addEventListener('click', () => {
  chrome.storage.sync.set(
    {
      enableMatureContent: elements.enableMatureContentCheckbox.checked,
    },
    () => {
      showNotification('Settings Saved', 'positive', 'snackbar-options');
    },
  );
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
    reader.onload = evt => {
      const fileContents = evt.target.result;
      try {
        const bookmarksArray = JSON.parse(fileContents);
        if (Array.isArray(bookmarksArray)) {
          if (!bookmarksArray.length > 0)
            showNotification('No bookmark ids found in file', 'negative', 'snackbar-options');
          else {
            updateBookmarks(bookmarksArray);
          }
        } else {
          showNotification('Contents not in valid format of ["id1", "id2", ...]', 'negative', 'snackbar-options');
        }
      } catch (error) {
        showNotification('This is not a valid JSON', 'negative', 'snackbar-options');
      }
    };
  }
});

// tab switching logic
elements.tabsHeader.addEventListener('click', e => {
  console.log(e.target);
  console.log(e.target.parentElement);
  // removing active class
  if (e.target.parentElement.classList.contains('tab')) {
    Array.prototype.forEach.call(e.currentTarget.getElementsByClassName('is-active'), element => {
      element.classList.remove('is-active');
      console.log('this is inner element');
      console.log(element);
    });

    // add active class to the clicked tab header
    e.target.parentElement.classList.add('is-active');

    const tabNo = e.target.parentElement.getAttribute('data-tab-no');
    let targetContentDiv;

    // removing active class from any tab content div
    Array.prototype.forEach.call(document.getElementById('tabs-content').children, element => {
      element.classList.remove('is-active');
      if (element.getAttribute('data-content-no') === tabNo) {
        // saving the target content div
        targetContentDiv = element;
      }
    });

    // adding active class to target content div
    targetContentDiv.classList.add('is-active');
  }
});

// to toggle FAQ page links
elements.accordionItems.forEach(item => item.addEventListener('click', toggleAccordion));
