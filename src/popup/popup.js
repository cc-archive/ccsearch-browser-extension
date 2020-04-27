import { elements } from './base';
import {
  checkInputError,
  removeOldSearchResults,
  getRequestUrl,
  checkResultLength,
  addThumbnailsToDOM,
  removeLoaderAnimation,
  checkInternetConnection,
  checkValidationError,
} from './searchModule';
import {
  licensesList,
  usecasesList,
  licenseAPIQueryStrings,
  useCaseAPIQueryStrings,
  makeElementsDisplayNone,
  removeClassFromElements,
  removeLoadMoreButton,
} from './helper';
import { loadSourcesToDom, resetLicenseDropDown, loadUserDefaults } from './filterModule';
import { handleImageAttributionDownload, handleImageDownload } from './infoPopupModule';
import { addSpinner } from './spinner';
import { showNotification, removeNode, getLatestSources, restoreInitialContent, showModal } from '../utils';

let inputText;
let pageNo;
// List to hold  selected by the user from the drop down.
let userSelectedSourcesList = [];

// List to hold user selected licenses
let userSelectedLicensesList = [];

// List to hold user selected use case
let userSelectedUseCaseList = [];

// object to map source display names to valid query names.
let sourceAPIQueryStrings = {};

// Store Wheather Search Storage is enabled or not
let enableSearchStorageOption = true;

// Search Storage
const storeSearch = {};

// eslint-disable-next-line no-undef
const clipboard = new ClipboardJS('.btn-copy');

clipboard.on('success', e => {
  e.clearSelection();
  showNotification('Copied', 'positive', 'snackbar-bookmarks');
});

elements.modal.classList.add('display-none');

elements.popupCloseButton.addEventListener('click', () => {
  elements.popup.style.opacity = 0;
  elements.popup.style.visibility = 'hidden';
  elements.popupMain.style.opacity = 0;
  elements.popupMain.style.visibility = 'hidden';

  // remove eventlisteners from download buttons to avoid multiple downloads.
  elements.downloadImageButton.removeEventListener('click', handleImageDownload);
  elements.downloadImageAttributionButton.removeEventListener('click', handleImageAttributionDownload);
});

elements.popup.addEventListener('click', e => {
  if (e.target.classList.contains('popup')) {
    // popup.style.opacity = 0;
    // popup.style.visibility = 'hidden';
    elements.popupCloseButton.click();
  }
});

Array.prototype.forEach.call(elements.popupTabLinks, element => {
  element.addEventListener('click', e => {
    const targetElement = e.target;
    const targetElementText = e.target.textContent;

    makeElementsDisplayNone(elements.popupTabContent);
    removeClassFromElements(elements.popupTabLinks, 'popup__tab-links-active');

    document.getElementById(targetElementText.toLowerCase()).style.display = 'block';
    targetElement.classList.add('popup__tab-links-active');
  });
});

// Activate the click event on pressing enter.
elements.inputField.addEventListener('keydown', event => {
  if (event.keyCode === 13) {
    elements.searchIcon.click();
  }
});

async function populateSourceList() {
  sourceAPIQueryStrings = await getLatestSources();

  let count = 0;
  const sourcesList = [];

  // iterating over source object
  Object.keys(sourceAPIQueryStrings).forEach(key => {
    sourcesList[count] = {
      id: sourceAPIQueryStrings[key],
      title: key,
    };
    count += 1;
  });

  loadSourcesToDom(sourcesList, enableSearchStorageOption && localStorage.length !== 0);
}

elements.filterIcon.addEventListener('click', () => {
  elements.filterSection.classList.toggle('section-filter--active');
  populateSourceList();
});

// TODO: divide the steps into functions
elements.filterResetButton.addEventListener('click', () => {
  // reset values
  elements.useCaseChooser.value = '';
  elements.licenseChooser.value = '';
  elements.sourceChooser.value = '';

  // array of dropdown container elements
  const dropdownElementsList = [
    elements.sourceChooserWrapper,
    elements.licenseChooserWrapper,
    elements.useCaseChooserWrapper,
  ];

  dropdownElementsList.forEach(dropdown => {
    const dropdownContainer = dropdown.querySelector('.comboTreeDropDownContainer');
    const inputCheckboxes = dropdownContainer.getElementsByTagName('input');
    // unchecking all the options
    for (let i = 0; i < inputCheckboxes.length; i += 1) {
      // using click to uncheck the box as setting checked=false also works visually
      if (inputCheckboxes[i].checked) {
        inputCheckboxes[i].click();
      }
    }
  });

  // the filter is not activated anymore
  elements.filterIcon.classList.remove('activate-filter');

  // clear the datastructures and make a fresh search
  userSelectedLicensesList = [];
  userSelectedSourcesList = [];
  userSelectedUseCaseList = [];
  elements.searchIcon.click();
});

// block to disable license dropdown, when atleast one of use-case checkboxes are checked
elements.useCaseChooserWrapper.addEventListener(
  'click',
  event => {
    const useCaseDropDownContainer = elements.useCaseChooserWrapper.querySelector('.comboTreeDropDownContainer');
    const inputCheckboxes = useCaseDropDownContainer.getElementsByTagName('input');

    let flag = 0;
    if (event.target.classList.contains('comboTreeItemTitle')) {
      // only checking checkbox elements
      if (!event.target.querySelector('input').checked) {
        // if the clicked checkbox is unchecked
        resetLicenseDropDown();
        // clear the datastructures and make a fresh search
        userSelectedLicensesList = [];
        // disable the license dropdown (as atleast one checkbox is checked)
        elements.licenseChooser.disabled = true;
        flag = 1;
      }
    }
    for (let i = 0; i < inputCheckboxes.length; i += 1) {
      // iterating all the checkboxes of use-case dropdown
      if (inputCheckboxes[i] !== event.target.querySelector('input')) {
        // excluding the current checkbox
        if (inputCheckboxes[i].checked) {
          // if atleast one checkbox is checked, disable the license dropdown
          resetLicenseDropDown();
          elements.licenseChooser.disabled = true;
          flag = 1;
        }
      }
    }
    if (!flag) {
      // if none of the checkbox is checked
      if (elements.licenseChooser.disabled) {
        // enable the license dropdown if it is not already.
        elements.licenseChooser.disabled = false;
      }
    }
  },
  true, // needed to make the event trigger during capturing phase
  // (https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)
);

function applyFilters() {
  //  reset filter data structures
  userSelectedSourcesList = [];
  userSelectedLicensesList = [];
  userSelectedUseCaseList = [];

  if (elements.sourceChooser.value) {
    const userInputSourcesList = elements.sourceChooser.value.split(', ');
    userInputSourcesList.forEach(element => {
      userSelectedSourcesList.push(sourceAPIQueryStrings[element]);
    });
  }

  if (elements.licenseChooser.value) {
    const userInputLicensesList = elements.licenseChooser.value.split(', ');
    userInputLicensesList.forEach(element => {
      userSelectedLicensesList.push(licenseAPIQueryStrings[element]);
    });
  }

  if (elements.useCaseChooser.value) {
    const userInputUseCaseList = elements.useCaseChooser.value.split(', ');
    userInputUseCaseList.forEach(element => {
      userSelectedUseCaseList.push(useCaseAPIQueryStrings[element]);
    });
  }

  // "activate" filter icon if some filters are applied
  if (userSelectedSourcesList.length > 0 || userSelectedLicensesList.length > 0 || userSelectedUseCaseList.length > 0) {
    elements.filterIcon.classList.add('activate-filter');
  } else {
    elements.filterIcon.classList.remove('activate-filter');
  }
}

elements.filterApplyButton.addEventListener('click', () => {
  applyFilters();
  elements.searchIcon.click();
});

elements.searchIcon.addEventListener('click', () => {
  inputText = elements.inputField.value.trim().replace('/[ ]+/g', ' ');
  pageNo = 1;

  checkInputError(inputText);
  checkInternetConnection();
  removeNode('primary__initial-info');
  removeNode('no-image-found');
  removeOldSearchResults();
  removeLoaderAnimation();
  applyFilters();

  localStorage.clear(); // clear the old results

  // enable spinner
  addSpinner(elements.spinnerPlaceholderGrid, 'original');
  // elements.spinner.classList.add('spinner');

  const url = getRequestUrl(
    inputText,
    userSelectedUseCaseList,
    userSelectedLicensesList,
    userSelectedSourcesList,
    pageNo,
  );

  // console.log(url);
  // pageNo += 1;

  fetch(url)
    .then(data => data.json())
    .then(res => {
      checkValidationError(res);
      const resultArray = res.results;

      checkResultLength(resultArray);
      addThumbnailsToDOM(resultArray);

      // Store Data to local storage
      if (resultArray.length !== 0) {
        localStorage.clear(); // clear the old results
        storeSearch.title = inputText;
        localStorage.setItem('usecaseDropdownValues', elements.useCaseChooser.value);
        localStorage.setItem('sourceDropdownValues', elements.sourceChooser.value);
        localStorage.setItem('licenseDropdownValues', elements.licenseChooser.value);
        storeSearch.page = { ...resultArray };
        localStorage.setItem('title', storeSearch.title);
        localStorage.setItem(pageNo, JSON.stringify(storeSearch.page));

        console.log(localStorage);
      }

      pageNo += 1;
    });
  elements.clearSearchButton[0].classList.remove('display-none');
});

elements.modal.addEventListener('click', () => {
  elements.modalCancel.click();
});

elements.modalBody.addEventListener('click', e => {
  e.stopPropagation();
});

elements.clearSearchButton[0].addEventListener('click', () => {
  const modalText = 'Do you really want to clear the search?';
  function onModalConfirm() {
    // Restore Initial Content
    elements.clearSearchButton[0].classList.add('display-none');
    elements.inputField.value = '';
    removeOldSearchResults();
    removeLoadMoreButton(elements.loadMoreButtonWrapper);
    elements.gridPrimary.setAttribute('style', 'position: relative; height: 0px;');
    localStorage.clear();
    restoreInitialContent('primary');
    applyFilters();
    elements.modal.classList.add('display-none');
  }
  function onModalClose() {
    elements.modal.classList.add('display-none');
  }
  chrome.storage.sync.get('enableSearchClearConfirm', items => {
    if (items.enableSearchClearConfirm) {
      showModal(modalText, onModalConfirm, onModalClose);
    } else {
      onModalConfirm();
    }
  });
});

// applying comboTree (see https://github.com/kirlisakal/combo-tree)
$('#choose-usecase').comboTree({
  source: usecasesList,
  isMultiple: true,
});

$('#choose-license').comboTree({
  source: licensesList,
  isMultiple: true,
});

function setEnableSearchStorageOptionVariable(enableSearchStorage) {
  if (enableSearchStorage === undefined) {
    // enable the feature by default (on startup, enableSearchStorage key will by undefined)
    enableSearchStorageOption = true;
    chrome.storage.sync.set({ enableSearchStorage: enableSearchStorageOption });
  } else enableSearchStorageOption = enableSearchStorage;
}

function loadStoredContentToUI() {
  inputText = localStorage.getItem('title');
  elements.inputField.value = inputText;
  elements.sourceChooser.value = localStorage.getItem('sourceDropdownValues');
  elements.useCaseChooser.value = localStorage.getItem('usecaseDropdownValues');
  elements.licenseChooser.value = localStorage.getItem('licenseDropdownValues');

  pageNo = 1;
  if (localStorage.getItem(pageNo)) {
    removeNode('primary__initial-info');
    const pageData = Object.values(JSON.parse(localStorage.getItem(pageNo)));
    addThumbnailsToDOM(pageData);
    pageNo = Number(pageNo) + 1;
  }
  elements.clearSearchButton[0].classList.remove('display-none');
}

async function loadStoredSearch() {
  if (localStorage.length !== 0) {
    loadStoredContentToUI();
  } else {
    removeNode('no-image-found');
    restoreInitialContent('primary');
    elements.clearSearchButton[0].classList.add('display-none');
  }
}

async function loadStoredSearchOnInit() {
  await chrome.storage.sync.get(['enableSearchStorage'], res => {
    setEnableSearchStorageOptionVariable(res.enableSearchStorage);

    if (localStorage.length !== 0 && enableSearchStorageOption) {
      loadStoredContentToUI();

      if (elements.sourceChooser.value || elements.useCaseChooser.value || elements.licenseChooser.value) {
        elements.filterIcon.classList.add('activate-filter');
      }
    } else {
      elements.clearSearchButton[0].classList.add('display-none');
      loadUserDefaults();
    }
  });
}

loadStoredSearchOnInit();

async function nextRequest(page) {
  let result = [];
  if (localStorage.getItem(pageNo)) {
    result = Object.values(JSON.parse(localStorage.getItem(pageNo)));
  } else {
    const url = getRequestUrl(
      inputText,
      userSelectedUseCaseList,
      userSelectedLicensesList,
      userSelectedSourcesList,
      page,
    );

    // console.log(url);
    const response = await fetch(url);
    const json = await response.json();
    result = json.results;

    if (enableSearchStorageOption) {
      // Update Local Storage Data
      storeSearch.page = { ...result };
      localStorage.setItem(pageNo, JSON.stringify(storeSearch.page));
    }
  }
  // console.log(result);
  addThumbnailsToDOM(result);
  pageNo += 1;
}

// global varialbe to check the status if user is viewwing the bookmarks section
window.isBookmarksActive = false;

elements.homeIcon.addEventListener('click', loadStoredSearch);

elements.loadMoreButton.addEventListener('click', () => {
  removeLoadMoreButton(elements.loadMoreButtonWrapper);
  addSpinner(elements.spinnerPlaceholderGrid, 'for-bottom');
  nextRequest(pageNo);
});

document.getElementById('settings-icon').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById('invert_colors-icon').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  chrome.storage.sync.get('darkmode', items => {
    const value = !items.darkmode;
    chrome.storage.sync.set({
      darkmode: value, // using ES6 to use variable as key of object
    });
  });
});

chrome.storage.sync.get('darkmode', items => {
  if (items.darkmode) {
    document.body.classList.add('dark');
  }
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    elements.buttonBackToTop.classList.add('show');
  } else {
    elements.buttonBackToTop.classList.remove('show');
  }
});

elements.buttonBackToTop.addEventListener('click', () => window.scrollTo(0, 0));
