import { elements, initGlobalObject } from './base';
// eslint-disable-next-line import/no-cycle
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
  // activeBookmarkContainers,
} from '../utils';
import { loadBookmarkImages } from './bookmarkModule';
import { confirmBookmarkSchemaInSync, confirmFilterSchemaInSync } from './popup.utils';
import { removeActiveClassFromNavLinks, bookmarksGridMasonryObject } from './bookmarkModule.utils';
import primaryGridMasonryObject from './searchModule.utils';

initGlobalObject();

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
  if (window.appObject.clickedImageTag) {
    window.appObject.imageDetailStack.clear();
    window.appObject.clickedImageTag = false;
  } else window.appObject.imageDetailStack.pop();

  if (window.appObject.imageDetailStack.isEmpty()) {
    elements.header.classList.remove('display-none');
    // elements.bookmarksSection.classList.add('display-none');
    elements.sectionMain.classList.remove('display-none');
    elements.imageDetailSection.classList.add('display-none');
  } else {
    elements.buttonBackToTop.click();
    fillImageDetailSection(window.appObject.imageDetailStack.top());
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
    window.appObject.sourcesFromAPI = await getLatestSources();

    const sourceNames = Object.keys(window.appObject.sourcesFromAPI);

    for (let i = 0; i < sourceNames.length; i += 1) {
      const checkboxElement = document.createElement('input');
      checkboxElement.type = 'checkbox';
      checkboxElement.id = sourceNames[i];

      const labelElement = document.createElement('label');
      labelElement.setAttribute('for', checkboxElement.id);
      labelElement.innerText = window.appObject.sourcesFromAPI[sourceNames[i]];

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
  window.appObject.activeSection = 'filter';
  elements.primarySection.classList.add('display-none');
  elements.filterSection.classList.remove('display-none');
};

setTimeout(addSourceFilterCheckboxes, 2000);

elements.closeFiltersLink.onclick = () => {
  window.appObject.activeSection = 'search';
  elements.primarySection.classList.remove('display-none');
  elements.filterSection.classList.add('display-none');
};

allowCheckingOneTypeOfCheckbox(elements.licenseCheckboxesWrapper, elements.useCaseCheckboxesWrapper);

elements.clearFiltersButton.addEventListener('click', () => {
  // the filter is not activated anymore
  // elements.filterButton.classList.remove('activate-filter');

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
  window.appObject.userSelectedUseCaseList = getCheckedCheckboxes(elements.useCaseCheckboxesWrapper);
  window.appObject.userSelectedLicensesList = getCheckedCheckboxes(elements.licenseCheckboxesWrapper);
  window.appObject.userSelectedSourcesList = getCheckedCheckboxes(elements.sourceCheckboxesWrapper);
  window.appObject.userSelectedFileTypeList = getCheckedCheckboxes(elements.fileTypeCheckboxesWrapper);
  window.appObject.userSelectedImageTypeList = getCheckedCheckboxes(elements.imageTypeCheckboxesWrapper);
  window.appObject.userSelectedImageSizeList = getCheckedCheckboxes(elements.imageSizeCheckboxesWrapper);
  window.appObject.userSelectedAspectRatioList = getCheckedCheckboxes(elements.aspectRatioCheckboxesWrapper);
  window.appObject.enableMatureContent = getCheckedCheckboxes(elements.showMatureContentCheckboxWrapper).length > 0;

  // "activate" filter icon if some filters are applied
  // if (
  //   window.appObject.userSelectedSourcesList.length > 0 ||
  //   window.appObject.userSelectedLicensesList.length > 0 ||
  //   window.appObject.userSelectedUseCaseList.length > 0 ||
  //   window.appObject.userSelectedFileTypeList.length > 0 ||
  //   window.appObject.userSelectedImageTypeList.length > 0 ||
  //   window.appObject.userSelectedImageSizeList.length > 0 ||
  //   window.appObject.userSelectedAspectRatioList.length > 0
  // ) {
  //   elements.filterButton.classList.add('activate-filter');
  // } else {
  //   elements.filterButton.classList.remove('activate-filter');
  // }
}

elements.applyFiltersButton.addEventListener('click', () => {
  applyFilters();
  primaryGridMasonryObject.layout();
  elements.closeFiltersLink.click();
  elements.searchButton.click();
});

elements.searchButton.addEventListener('click', () => {
  window.appObject.inputText = elements.inputField.value.trim().replace('/[ ]+/g', ' ');
  window.appObject.pageNo = 1;
  window.appObject.activeSearchContext = 'normal';

  checkInputError(window.appObject.inputText);
  // checkIfSourceFilterIsRendered();
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
  // elements.spinner.classList.add('spinner');

  const url = getRequestUrl(
    window.appObject.inputText,
    window.appObject.userSelectedUseCaseList,
    window.appObject.userSelectedLicensesList,
    window.appObject.userSelectedSourcesList,
    window.appObject.userSelectedFileTypeList,
    window.appObject.userSelectedImageTypeList,
    window.appObject.userSelectedImageSizeList,
    window.appObject.userSelectedAspectRatioList,
    window.appObject.pageNo,
    window.appObject.enableMatureContent,
  );

  console.log(url);

  // console.log(window.appObject.userSelectedUseCaseList);
  // console.log(window.appObject.userSelectedSourcesList);
  search(url);
  // console.log(url);
  // pageNo += 1;
  // elements.clearSearchButton[0].classList.remove('display-none');
});

function restoreAppObjectVariables() {
  chrome.storage.sync.get(['enableMatureContent'], res => {
    window.appObject.enableMatureContent = res.enableMatureContent === true;
  });
}

restoreAppObjectVariables();
loadUserDefaults();

async function nextRequest() {
  let result = [];
  let url;
  if (window.appObject.activeSearchContext === 'collection') {
    url = getCollectionsUrl(window.appObject.collectionName, window.appObject.pageNo);
  } else if (window.appObject.activeSearchContext === 'normal') {
    url = getRequestUrl(
      window.appObject.inputText,
      window.appObject.userSelectedUseCaseList,
      window.appObject.userSelectedLicensesList,
      window.appObject.userSelectedSourcesList,
      window.appObject.userSelectedFileTypeList,
      window.appObject.userSelectedImageTypeList,
      window.appObject.userSelectedImageSizeList,
      window.appObject.userSelectedAspectRatioList,
      window.appObject.pageNo,
      window.appObject.enableMatureContent,
    );
  } else if (window.appObject.activeSearchContext === 'tag') {
    url = getTagsUrl(window.appObject.tagName, window.appObject.pageNo);
  }

  console.log(url);
  const response = await fetch(url);
  const json = await response.json();
  result = json.results;
  // console.log(result);
  addSearchThumbnailsToDOM(primaryGridMasonryObject, result, elements.gridPrimary);
  window.appObject.pageNo += 1;
}

elements.loadMoreSearchButton.addEventListener('click', () => {
  removeLoadMoreButton(elements.loadMoreSearchButtonWrapper);
  addSpinner(elements.spinnerPlaceholderPrimary, 'for-bottom');
  nextRequest(window.appObject.pageNo);
});

elements.loadMoreBookmarkButton.addEventListener('click', () => {
  removeLoadMoreButton(elements.loadMoreBookmarkButtonkWrapper);
  addSpinner(elements.spinnerPlaceholderPrimary, 'for-bottom');
  loadBookmarkImages(10, window.appObject.bookmarksEditViewEnabled);
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
