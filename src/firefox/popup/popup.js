/* eslint-disable no-shadow */
import { elements } from './base';
import {
  checkInputError,
  removeInitialContent,
  removeOldSearchResults,
  getRequestUrl,
  checkResultLength,
  addThumbnailsToDOM,
  removeLoaderAnimation,
} from './searchModule';
import {
  isObjectEmpty,
  licensesList,
  usecasesList,
  licenseAPIQueryStrings,
  useCaseAPIQueryStrings,
  backupProviderAPIQueryStrings,
  makeElementsDisplayNone,
  removeClassFromElements,
} from './helper';
import { populateProviderList, resetLicenseDropDown, loadUserDefaults } from './filterModule';
import { handleImageAttributionDownload, handleImageDownload } from './infoPopupModule';
import { addSpinner } from './spinner';

let inputText;
let pageNo;

// List to hold providers selected by the user from the drop down.
let userSelectedProvidersList = [];

// List to hold user selected licenses
let userSelectedLicensesList = [];

// List to hold user selected use case
let userSelectedUseCaseList = [];

// object to map Provider display names to valid query names.
let providerAPIQueryStrings = {};

// eslint-disable-next-line no-undef
const clipboard = new ClipboardJS('.btn-copy');

clipboard.on('success', (e) => {
  e.clearSelection();
  e.trigger.textContent = 'Copied';
  setTimeout(() => {
    e.trigger.textContent = 'Copy';
  }, 1000);
});

elements.popupCloseButton.addEventListener('click', () => {
  elements.popup.style.opacity = 0;
  elements.popup.style.visibility = 'hidden';
  elements.popupMain.style.opacity = 0;
  elements.popupMain.style.visibility = 'hidden';

  // remove eventlisteners from download buttons to avoid multiple downloads.
  elements.downloadImageButton.removeEventListener('click', handleImageDownload);
  elements.downloadImageAttributionButton.removeEventListener(
    'click',
    handleImageAttributionDownload,
  );
});

elements.popup.addEventListener('click', (e) => {
  if (e.target.classList.contains('popup')) {
    // popup.style.opacity = 0;
    // popup.style.visibility = 'hidden';
    elements.popupCloseButton.click();
  }
});

Array.prototype.forEach.call(elements.popupTabLinks, (element) => {
  element.addEventListener('click', (e) => {
    const targetElement = e.target;
    const targetElementText = e.target.textContent;
    console.log(targetElementText);

    makeElementsDisplayNone(elements.popupTabContent);
    removeClassFromElements(elements.popupTabLinks, 'popup__tab-links-active');

    document.getElementById(targetElementText.toLowerCase()).style.display = 'block';
    targetElement.classList.add('popup__tab-links-active');
  });
});

// Activate the click event on pressing enter.
elements.inputField.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    elements.searchIcon.click();
  }
});

function fetchProviders() {
  const getProviderURL = 'https://api.creativecommons.engineering/statistics/image';

  if (isObjectEmpty(providerAPIQueryStrings)) {
    console.log('inside provider fetch');
    fetch(getProviderURL)
      .then(data => data.json())
      .then((res) => {
        res.forEach((provider) => {
          providerAPIQueryStrings[provider.display_name] = provider.provider_name;
        });
        populateProviderList(providerAPIQueryStrings);
      })
      .catch((error) => {
        console.log(error);
        providerAPIQueryStrings = backupProviderAPIQueryStrings;
        populateProviderList(providerAPIQueryStrings);
      });
  }
}

fetchProviders();

elements.filterIcon.addEventListener('click', () => {
  elements.filterSection.classList.toggle('section-filter--active');
});

// TODO: divide the steps into functions
elements.filterResetButton.addEventListener('click', () => {
  // reset values
  elements.useCaseChooser.value = '';
  elements.licenseChooser.value = '';
  elements.providerChooser.value = '';

  // array of dropdown container elements
  const dropdownElementsList = [
    elements.providerChooserWrapper,
    elements.licenseChooserWrapper,
    elements.useCaseChooserWrapper,
  ];

  dropdownElementsList.forEach((dropdown) => {
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

  // clear the datastructures and make a fresh search
  userSelectedLicensesList = [];
  userSelectedProvidersList = [];
  userSelectedUseCaseList = [];
  elements.searchIcon.click();
});

// block to disable license dropdown, when atleast one of use-case checkboxes are checked
elements.useCaseChooserWrapper.addEventListener(
  'click',
  (event) => {
    console.log('capture event occured');
    const useCaseDropDownContainer = elements.useCaseChooserWrapper.querySelector(
      '.comboTreeDropDownContainer',
    );
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
  userSelectedProvidersList = [];
  userSelectedLicensesList = [];
  userSelectedUseCaseList = [];

  if (elements.providerChooser.value) {
    const userInputProvidersList = elements.providerChooser.value.split(', ');
    userInputProvidersList.forEach((element) => {
      userSelectedProvidersList.push(providerAPIQueryStrings[element]);
    });
  }

  if (elements.licenseChooser.value) {
    const userInputLicensesList = elements.licenseChooser.value.split(', ');
    userInputLicensesList.forEach((element) => {
      console.log(element);
      userSelectedLicensesList.push(licenseAPIQueryStrings[element]);
    });
    console.log(userSelectedLicensesList);
  }

  if (elements.useCaseChooser.value) {
    const userInputUseCaseList = elements.useCaseChooser.value.split(', ');
    userInputUseCaseList.forEach((element) => {
      console.log(element);
      userSelectedUseCaseList.push(useCaseAPIQueryStrings[element]);
    });
    console.log(userSelectedUseCaseList);
  }
}

elements.filterApplyButton.addEventListener('click', () => {
  applyFilters();
  elements.searchIcon.click();
});

elements.searchIcon.addEventListener('click', () => {
  inputText = elements.inputField.value;
  pageNo = 1;

  checkInputError(inputText, 'error-message');
  removeInitialContent();
  removeOldSearchResults();
  removeLoaderAnimation();
  applyFilters();

  // enable spinner
  addSpinner(elements.spinnerPlaceholderGrid);
  // elements.spinner.classList.add('spinner');

  const url = getRequestUrl(
    inputText,
    userSelectedUseCaseList,
    userSelectedLicensesList,
    userSelectedProvidersList,
    pageNo,
  );

  console.log(url);
  pageNo += 1;

  fetch(url)
    .then(data => data.json())
    .then((res) => {
      const resultArray = res.results;
      console.log(resultArray);

      checkResultLength(resultArray);
      addThumbnailsToDOM(resultArray);
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
loadUserDefaults();

let processing;

async function nextRequest(page) {
  const url = getRequestUrl(
    inputText,
    userSelectedUseCaseList,
    userSelectedLicensesList,
    userSelectedProvidersList,
    page,
  );

  console.log(url);
  const response = await fetch(url);
  const json = await response.json();
  const result = json.results;
  console.log(result);
  addThumbnailsToDOM(result);
  pageNo += 1;
  processing = false;
}

// global varialbe to check the status if user is viewwing the bookmarks section
window.isBookmarksActive = false;

// Trigger nextRequest when we reach bottom of the page
// credit: https://stackoverflow.com/a/10662576/10425980
$(document).ready(() => {
  $(document).scroll(() => {
    if (processing) return false;

    if (
      $(window).scrollTop() >= $(document).height() - $(window).height() - 700
      && !window.isBookmarksActive
    ) {
      processing = true;

      nextRequest(pageNo);
    }
    return undefined;
  });
});

document.getElementById('settings-icon').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById('invert_colors-icon').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// eslint-disable-next-line no-undef
chrome.storage.local.get('darkmode', (items) => {
  if (items.darkmode) {
    document.body.classList.add('dark');
  }
});
