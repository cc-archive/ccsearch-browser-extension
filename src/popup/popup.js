import {
  elements,
  appObject,
  primaryGridMasonryObject,
  bookmarksGridMasonryObject,
  filterCheckboxWrappers,
} from './base';
import { checkInputError, getRequestUrl, getCollectionsUrl } from './searchModule';
import { removeLoadMoreButton, clearFilters, removeImagesFromGrid, getTagsUrl, checkResultLength } from './helper';
import { fillImageDetailSection, resetImageDetailSection } from './imageDetailModule';
import { addSpinner, removeSpinner } from './spinner';
import {
  showNotification,
  allowCheckingOneTypeOfCheckbox,
  enableTabSwitching,
  markDefaultFilters,
  checkInternetConnection,
  fetchImages,
} from '../utils';
import loadBookmarkImages from './bookmarkModule';
import checkSyncStorageSchema from './popup.utils';
import { removeActiveClassFromNavLinks } from './bookmarkModule.utils';
import { addImagesToDOM, search } from './localUtils';
import { addSourceFilterCheckboxes, toggleFilterSection } from './filterModule';

/* *********************** Search Section *********************** */

elements.searchButton.addEventListener('click', () => {
  appObject.inputText = elements.inputField.value.trim().replace('/[ ]+/g', ' ');
  appObject.pageNo = 1;
  appObject.searchContext = 'default';

  checkInputError(appObject.inputText);
  checkInternetConnection();

  // If the latest sources are still not fetched from the API and loaded in the
  // filters section, notify the user and terminate search.
  if (elements.sourceCheckboxesWrapper.children.length === 1) {
    showNotification(
      'Extension is fetching latest sources. Please wait a sec.',
      'negative',
      'notification--extension-popup',
      3000,
    );
    throw new Error('Sources not yet fetched');
  }

  removeImagesFromGrid(elements.gridPrimary);
  removeSpinner(elements.spinnerPlaceholderPrimary);
  appObject.updateFilters();
  addSpinner(elements.spinnerPlaceholderPrimary, 'original');

  const url = getRequestUrl();
  search(url);
});

elements.inputField.addEventListener('keydown', event => {
  // "Click" the Search Button when pressing "Enter".
  if (event.key === 'Enter') {
    elements.searchButton.click();
  }
});

/**
 * @desc Fetches next bunch of images from the API and calls "addImagesToDOM" to make
 * image-components and render them on the search grid.
 */
async function nextRequest() {
  // deciding the API request url based on the current search-context
  let url;
  const { searchContext } = appObject;
  if (searchContext === 'collection') {
    url = getCollectionsUrl();
  } else if (searchContext === 'default') {
    url = getRequestUrl();
  } else if (searchContext === 'image-tag') {
    url = getTagsUrl();
  }
  console.log(url);

  const images = await fetchImages(url);
  checkResultLength(images, 'forNextRequest');
  addImagesToDOM(primaryGridMasonryObject, images, elements.gridPrimary);
  appObject.pageNo += 1;
}

elements.loadMoreSearchButton.addEventListener('click', () => {
  removeLoadMoreButton(elements.loadMoreSearchButtonWrapper);
  addSpinner(elements.spinnerPlaceholderPrimary, 'for-bottom');
  nextRequest();
});

/* *********************** Filters Section *********************** */

elements.filterButton.addEventListener('click', toggleFilterSection);
elements.closeFiltersLink.addEventListener('click', toggleFilterSection);

allowCheckingOneTypeOfCheckbox(elements.licenseCheckboxesWrapper, elements.useCaseCheckboxesWrapper);
setTimeout(addSourceFilterCheckboxes, 2000);

filterCheckboxWrappers.forEach(wrapper => {
  if (wrapper !== elements.sourceCheckboxesWrapper) markDefaultFilters(wrapper);
});

elements.clearFiltersButton.addEventListener('click', () => {
  clearFilters();

  // close the filters section and make a search
  primaryGridMasonryObject.layout();
  elements.closeFiltersLink.click();
  elements.searchButton.click();
});

elements.applyFiltersButton.addEventListener('click', () => {
  appObject.updateFilters();
  primaryGridMasonryObject.layout();
  elements.closeFiltersLink.click();
  elements.searchButton.click();
});

/* *********************** Bookmarks Section *********************** */
elements.loadMoreBookmarkButton.addEventListener('click', () => {
  removeLoadMoreButton(elements.loadMoreBookmarkButtonkWrapper);
  addSpinner(elements.spinnerPlaceholderPrimary, 'for-bottom');
  loadBookmarkImages(10, appObject.isEditViewEnabled);
});

/* *********************** Image Detail Section *********************** */

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

// add tab switching functionality to image-detail nav and attribution tab.
elements.imageDetailNav.getElementsByTagName('ul')[0].addEventListener('click', enableTabSwitching);
elements.attributionTab.firstElementChild.getElementsByTagName('ul')[0].addEventListener('click', enableTabSwitching);

/* *********************** Misc *********************** */

elements.navSettingsLink.addEventListener('click', () => {
  // visually marking settings link as active
  removeActiveClassFromNavLinks();
  elements.navSettingsLink.classList.add('active');

  chrome.runtime.openOptionsPage();
});

elements.navInvertColorsIcon.addEventListener('click', () => {
  // toggling dark-mode
  document.body.classList.toggle('dark');
  document.documentElement.classList.toggle('dark');

  // saving the user preferrence in sync storage.
  chrome.storage.sync.get('darkmode', items => {
    const value = !items.darkmode;
    chrome.storage.sync.set({
      darkmode: value,
    });
  });
});

// Set the user preferrence of dark mode.
chrome.storage.sync.get('darkmode', items => {
  if (items.darkmode) {
    document.body.classList.add('dark');
    document.documentElement.classList.add('dark');
  }
});

// back to top button
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    elements.buttonBackToTop.classList.add('show');
  } else {
    elements.buttonBackToTop.classList.remove('show');
  }
});
elements.buttonBackToTop.addEventListener('click', () => window.scrollTo(0, 0));

checkSyncStorageSchema();
