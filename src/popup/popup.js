import { elements, appObject } from './base';
import {
  checkInputError,
  removeOldSearchResults,
  getRequestUrl,
  search,
  addSearchThumbnailsToDOM,
  getCollectionsUrl,
  getTagsUrl,
} from './searchModule';
import { removeLoadMoreButton, clearFilters } from './helper';
import loadUserDefaults from './filterModule';
import { fillImageDetailSection, resetImageDetailSection } from './infoPopupModule';
import { addSpinner, removeSpinner } from './spinner';
import {
  showNotification,
  getLatestSources,
  allowCheckingOneTypeOfCheckbox,
  enableTabSwitching,
  loadFilterCheckboxesFromStorage,
  checkInternetConnection,
} from '../utils';
import { loadBookmarkImages } from './bookmarkModule';
import { confirmBookmarkSchemaInSync, confirmFilterSchemaInSync } from './popup.utils';
import { removeActiveClassFromNavLinks, bookmarksGridMasonryObject } from './bookmarkModule.utils';
import primaryGridMasonryObject from './searchModule.utils';

// eslint-disable-next-line no-undef
const clipboard = new ClipboardJS('.btn-copy');

clipboard.on('success', e => {
  e.clearSelection();
  showNotification('Copied', 'positive', 'notification--extension-popup');
});

elements.imageDetailNav.getElementsByTagName('ul')[0].addEventListener('click', enableTabSwitching);
elements.attributionTab.firstElementChild.getElementsByTagName('ul')[0].addEventListener('click', enableTabSwitching);

elements.closeImageDetailLink.addEventListener('click', () => {
  resetImageDetailSection();
  if (appObject.clickedImageTag) {
    appObject.imageDetailStack.clear();
    appObject.clickedImageTag = false;
  } else appObject.imageDetailStack.pop();

  if (appObject.imageDetailStack.isEmpty()) {
    elements.header.classList.remove('display-none');
    elements.sectionMain.classList.remove('display-none');
    elements.imageDetailSection.classList.add('display-none');
  } else {
    elements.buttonBackToTop.click();
    fillImageDetailSection(appObject.imageDetailStack.top());
  }

  // lays out images in masonry grid again
  bookmarksGridMasonryObject.layout();
  primaryGridMasonryObject.layout();
});

// Activate the click event on pressing enter.
elements.inputField.addEventListener('keydown', event => {
  if (event.keyCode === 13) {
    elements.searchButton.click();
  }
});

async function addSourceFilterCheckboxes() {
  if (elements.sourceCheckboxesWrapper.children.length === 1) {
    appObject.sourcesFromAPI = await getLatestSources();

    const sourceNames = Object.keys(appObject.sourcesFromAPI);

    for (let i = 0; i < sourceNames.length; i += 1) {
      const checkboxElement = document.createElement('input');
      checkboxElement.type = 'checkbox';
      checkboxElement.id = sourceNames[i];

      const labelElement = document.createElement('label');
      labelElement.setAttribute('for', checkboxElement.id);
      labelElement.innerText = appObject.sourcesFromAPI[sourceNames[i]];

      const breakElement = document.createElement('br');

      elements.sourceCheckboxesWrapper.appendChild(checkboxElement);
      elements.sourceCheckboxesWrapper.appendChild(labelElement);
      elements.sourceCheckboxesWrapper.appendChild(breakElement);
    }
    loadFilterCheckboxesFromStorage(elements.sourceCheckboxesWrapper);
    showNotification('Fetched latest sources succcessfully.', 'positive', 'notification--extension-popup');
  }
}

elements.filterButton.onclick = () => {
  appObject.activeSection = 'filter';
  elements.primarySection.classList.add('display-none');
  elements.filterSection.classList.remove('display-none');
};

setTimeout(addSourceFilterCheckboxes, 2000);

elements.closeFiltersLink.onclick = () => {
  appObject.activeSection = 'search';
  elements.primarySection.classList.remove('display-none');
  elements.filterSection.classList.add('display-none');
};

allowCheckingOneTypeOfCheckbox(elements.licenseCheckboxesWrapper, elements.useCaseCheckboxesWrapper);

elements.clearFiltersButton.addEventListener('click', () => {
  clearFilters();
  // close the filters section and make a search
  primaryGridMasonryObject.layout();
  elements.closeFiltersLink.click();
  elements.searchButton.click();
});

function getCheckedCheckboxes(checkboxesWrapper) {
  const checkboxes = checkboxesWrapper.querySelectorAll('input[type=checkbox]');

  const checkedCheckboxes = [];
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) checkedCheckboxes.push(checkbox.id);
  });

  return checkedCheckboxes;
}

function applyFilters() {
  appObject.useCaseFilters = getCheckedCheckboxes(elements.useCaseCheckboxesWrapper);
  appObject.userSelectedLicensesList = getCheckedCheckboxes(elements.licenseCheckboxesWrapper);
  appObject.userSelectedSourcesList = getCheckedCheckboxes(elements.sourceCheckboxesWrapper);
  appObject.fileTypeFilters = getCheckedCheckboxes(elements.fileTypeCheckboxesWrapper);
  appObject.imageTypeFilters = getCheckedCheckboxes(elements.imageTypeCheckboxesWrapper);
  appObject.imageSizeFilters = getCheckedCheckboxes(elements.imageSizeCheckboxesWrapper);
  appObject.aspectRatioFilters = getCheckedCheckboxes(elements.aspectRatioCheckboxesWrapper);
  appObject.enableMatureContent = getCheckedCheckboxes(elements.showMatureContentCheckboxWrapper).length > 0;
}

elements.applyFiltersButton.addEventListener('click', () => {
  applyFilters();
  primaryGridMasonryObject.layout();
  elements.closeFiltersLink.click();
  elements.searchButton.click();
});

elements.searchButton.addEventListener('click', () => {
  appObject.inputText = elements.inputField.value.trim().replace('/[ ]+/g', ' ');
  appObject.pageNo = 1;
  appObject.searchContext = 'default';

  checkInputError(appObject.inputText);
  checkInternetConnection();

  if (elements.sourceCheckboxesWrapper.children.length === 1) {
    showNotification(
      'Extension is fetching latest sources. Please wait a sec.',
      'negative',
      'notification--extension-popup',
      3000,
    );
    throw new Error('Sources not yet fetched');
  }

  removeOldSearchResults();
  removeSpinner(elements.spinnerPlaceholderPrimary);
  applyFilters();

  // enable spinner
  addSpinner(elements.spinnerPlaceholderPrimary, 'original');

  const url = getRequestUrl(
    appObject.inputText,
    appObject.useCaseFilters,
    appObject.userSelectedLicensesList,
    appObject.userSelectedSourcesList,
    appObject.fileTypeFilters,
    appObject.imageTypeFilters,
    appObject.imageSizeFilters,
    appObject.aspectRatioFilters,
    appObject.pageNo,
    appObject.enableMatureContent,
  );

  search(url);
});

function restoreAppObjectVariables() {
  chrome.storage.sync.get(['enableMatureContent'], res => {
    appObject.enableMatureContent = res.enableMatureContent === true;
  });
}

restoreAppObjectVariables();
loadUserDefaults();

async function nextRequest() {
  let result = [];
  let url;
  if (appObject.searchContext === 'collection') {
    url = getCollectionsUrl(appObject.collectionName, appObject.pageNo);
  } else if (appObject.searchContext === 'default') {
    url = getRequestUrl(
      appObject.inputText,
      appObject.useCaseFilters,
      appObject.userSelectedLicensesList,
      appObject.userSelectedSourcesList,
      appObject.fileTypeFilters,
      appObject.imageTypeFilters,
      appObject.imageSizeFilters,
      appObject.aspectRatioFilters,
      appObject.pageNo,
      appObject.enableMatureContent,
    );
  } else if (appObject.searchContext === 'image-tag') {
    url = getTagsUrl(appObject.tagName, appObject.pageNo);
  }

  console.log(url);
  const response = await fetch(url);
  const json = await response.json();
  result = json.results;
  addSearchThumbnailsToDOM(primaryGridMasonryObject, result, elements.gridPrimary);
  appObject.pageNo += 1;
}

elements.loadMoreSearchButton.addEventListener('click', () => {
  removeLoadMoreButton(elements.loadMoreSearchButtonWrapper);
  addSpinner(elements.spinnerPlaceholderPrimary, 'for-bottom');
  nextRequest(appObject.pageNo);
});

elements.loadMoreBookmarkButton.addEventListener('click', () => {
  removeLoadMoreButton(elements.loadMoreBookmarkButtonkWrapper);
  addSpinner(elements.spinnerPlaceholderPrimary, 'for-bottom');
  loadBookmarkImages(10, appObject.isEditViewEnabled);
});

elements.navSettingsLink.addEventListener('click', () => {
  // visually marking settings link as active
  removeActiveClassFromNavLinks();
  elements.navSettingsLink.classList.add('active');

  chrome.runtime.openOptionsPage();
});

elements.navInvertColorsIcon.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.documentElement.classList.toggle('dark');

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
    document.documentElement.classList.add('dark');
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

confirmBookmarkSchemaInSync();
confirmFilterSchemaInSync();
