import elements from './base';
import { init, saveFiltersOptions, toggleAccordion, addBookmarksToStorage } from './helper';
import { showNotification, fetchImageData } from '../utils';

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

async function addLegacyBookmarksToStorage(bookmarksArray) {
  console.log('adding legacy to storage');
  chrome.storage.sync.get({ bookmarks: {} }, async items => {
    const bookmarksObject = items.bookmarks;
    // if user tries to import bookmarks before the bookmarks storage data is updated
    if (Array.isArray(bookmarksObject)) {
      showNotification(
        'Error: First please open the extension popup to trigger the automatic update of bookmarks section. It will only take a few minutes',
        'negative',
        'snackbar-options',
      );
      throw new Error('Bookmarks data structures not updated');
    }

    let count = 0;
    for (let i = 0; i < bookmarksArray.length; i += 1) {
      count += 1;
      console.log(count);
      const bookmarkId = bookmarksArray[i];
      if (!Object.prototype.hasOwnProperty.call(bookmarksObject, bookmarkId)) {
        // eslint-disable-next-line no-await-in-loop
        const res = await fetchImageData(bookmarkId);
        const imageDetailResponse = res[0];
        const responseCode = res[1];
        console.log(bookmarkId);
        console.log(imageDetailResponse);
        console.log(responseCode);
        const imageObject = {};
        if (responseCode === 429) {
          document.querySelector('.notification__options--body p').innerText =
            'The process has stoped due to surpassing the API limit. Some bookmarks have been imported. Refresh and upload the file after 5 minutes to import the rest.';
          throw new Error('API limit reached');
        }
        if (responseCode === 200) {
          if (!imageDetailResponse.thumbnail) {
            console.log(imageDetailResponse.source);
          }
          imageObject.thumbnail = imageDetailResponse.thumbnail
            ? imageDetailResponse.thumbnail
            : imageDetailResponse.url;
          imageObject.license = imageDetailResponse.license;
          bookmarksObject[bookmarkId] = imageObject;
        }
        chrome.storage.sync.set({ bookmarks: bookmarksObject }, () => {
          console.log('intermediate write');
        });
      }
    }
    document.querySelector('.notification__options--body p').innerText = 'Bookmarks imported';
  });
}

function handleLegacyBookmarksFile(bookmarksArray) {
  try {
    console.log(bookmarksArray);
    console.log(typeof bookmarksArray);
    if (!bookmarksArray.length > 0) {
      showNotification('Error: No bookmarks found in the file', 'negative', 'snackbar-options');
    } else {
      console.log('calling legacy');
      document.querySelector('.notification__options--background').style.display = 'flex';
      addLegacyBookmarksToStorage(bookmarksArray);
    }
  } catch (error) {
    showNotification('Error in parsing file', 'negative', 'snackbar-options');
  }
}

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
        console.log(bookmarksObject);
        console.log(typeof bookmarksObject);
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
