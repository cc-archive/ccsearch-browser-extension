import { elements, initGlobalObject } from './base';
// eslint-disable-next-line import/no-cycle
import {
  checkInputError,
  removeOldSearchResults,
  getRequestUrl,
  search,
  addSearchThumbnailsToDOM,
  removeLoaderAnimation,
  getCollectionsUrl,
} from './searchModule';
import {
  // licenseAPIQueryStrings,
  // useCaseAPIQueryStrings,
  // makeElementsDisplayNone,
  // removeClassFromElements,
  removeLoadMoreButton,
  // imageTypeAPIQueryStrings,
  // fileTypeAPIQueryStrings,
  // aspectRatioAPIQueryStrings,
  // imageSizeAPIQueryStrings,
} from './helper';
import loadUserDefaults from './filterModule';
import { handleImageAttributionDownload } from './infoPopupModule';
import { addSpinner } from './spinner';
import {
  showNotification,
  removeNode,
  getLatestSources,
  allowCheckingOneTypeOfCheckbox,
  enableTabSwitching,
  removeChildNodes,
  loadFilterCheckboxesFromStorage,
  // activeBookmarkContainers,
} from '../utils';
import { loadBookmarkImages } from './bookmarkModule';
import generateNewStorageSchemaForFilters from './popup.utils';
import { removeActiveClassFromNavLinks, bookmarksGridMasonryObject } from './bookmarkModule.utils';
import { primaryGridMasonryObject, checkInternetConnection } from './searchModule.utils';

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
  // remove eventlisteners from download buttons to avoid multiple downloads.
  for (let i = 0; i < elements.downloadImageAttributionButton.length; i += 1) {
    elements.downloadImageAttributionButton[i].removeEventListener('click', handleImageAttributionDownload);
  }

  // making reuse tab active for later
  const imageDetailNavTabs = elements.imageDetailNav.getElementsByTagName('li');
  for (let i = 0; i < 3; i += 1) {
    imageDetailNavTabs[i].classList.remove('is-active');
    elements.imageDetailTabsPanels[i].classList.remove('is-active');
  }
  elements.reuseTab.classList.add('is-active');
  elements.reusePanel.classList.add('is-active');

  // share tab
  removeChildNodes(elements.richTextAttributionPara);
  removeChildNodes(elements.htmlAttributionTextArea);
  removeChildNodes(elements.plainTextAttributionPara);
  removeChildNodes(elements.licenseDescriptionDiv);

  // information tab
  removeChildNodes(elements.imageDimensionPara);
  removeChildNodes(elements.imageSourcePara);
  removeChildNodes(elements.imageLicensePara);

  // image tags
  elements.imageTagsDivs.forEach(imageTagDiv => {
    removeChildNodes(imageTagDiv);
  });

  // related images
  const div = document.createElement('div');
  div.classList.add('gutter-sizer');
  removeChildNodes(elements.gridRelatedImages);
  elements.gridRelatedImages.appendChild(div);

  elements.header.classList.remove('display-none');
  // elements.bookmarksSection.classList.add('display-none');
  elements.sectionMain.classList.remove('display-none');
  elements.imageDetailSection.classList.add('display-none');

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

async function populateSourceList() {
  console.log('popuplate source list called');

  if (elements.sourceCheckboxesWrapper.children.length === 1) {
    window.appObject.sourceAPIQueryStrings = await getLatestSources();

    const sourceDisplayNames = Object.keys(window.appObject.sourceAPIQueryStrings);

    for (let i = 0; i < sourceDisplayNames.length; i += 1) {
      const checkboxElement = document.createElement('input');
      checkboxElement.type = 'checkbox';
      checkboxElement.id = window.appObject.sourceAPIQueryStrings[sourceDisplayNames[i]];

      const labelElement = document.createElement('label');
      labelElement.setAttribute('for', checkboxElement.id);
      labelElement.innerText = sourceDisplayNames[i];

      const breakElement = document.createElement('br');

      elements.sourceCheckboxesWrapper.appendChild(checkboxElement);
      elements.sourceCheckboxesWrapper.appendChild(labelElement);
      elements.sourceCheckboxesWrapper.appendChild(breakElement);
    }
    loadFilterCheckboxesFromStorage(elements.sourceCheckboxesWrapper);
  }
}

elements.filterButton.onclick = () => {
  window.appObject.activeSection = 'filter';
  elements.primarySection.classList.add('display-none');
  elements.filterSection.classList.remove('display-none');
  populateSourceList();
};

elements.closeFiltersLink.onclick = () => {
  window.appObject.activeSection = 'search';
  elements.primarySection.classList.remove('display-none');
  elements.filterSection.classList.add('display-none');
};

allowCheckingOneTypeOfCheckbox(elements.licenseCheckboxesWrapper, elements.useCaseCheckboxesWrapper);

// function clearAllUserSelectedFilterLists() {
//   window.appObject.allUserSelectedFilterLists.forEach(element => {
//     console.log(`element name ${element}`);
//     console.log(`it's value ${window.appObject.element}`);
//     console.log(
//       `usersselesourcelist window.appObject.userSelectedSourcesList ${window.appObject.userSelectedSourcesList}`,
//     );
//     window.appObject.element = [];
//   });
//   // console.log(window.appObject.allUserSelectedFilterLists);
// }

// TODO: divide the steps into functions
elements.clearFiltersButton.addEventListener('click', () => {
  // the filter is not activated anymore
  // elements.filterButton.classList.remove('activate-filter');

  const checkboxesWrappers = [
    elements.useCaseCheckboxesWrapper,
    elements.licenseCheckboxesWrapper,
    elements.sourceCheckboxesWrapper,
    elements.fileTypeCheckboxesWrapper,
    elements.imageTypeCheckboxesWrapper,
    elements.imageSizeCheckboxesWrapper,
    elements.aspectRatioCheckboxesWrapper,
  ];

  checkboxesWrappers.forEach(checkboxesWrapper => {
    const checkboxes = checkboxesWrapper.querySelectorAll('input[type=checkbox]');

    for (let i = 0; i < checkboxes.length; i += 1) {
      checkboxes[i].checked = false;
    }
  });

  // clear the datastructures and make a fresh search
  window.appObject.userSelectedUseCaseList = [];
  window.appObject.userSelectedLicensesList = [];
  window.appObject.userSelectedSourcesList = [];
  window.appObject.userSelectedFileTypeList = [];
  window.appObject.userSelectedImageTypeList = [];
  window.appObject.userSelectedImageSizeList = [];
  window.appObject.userSelectedAspectRatioList = [];
  // console.log(window.appObject.userSelectedUseCaseList);
  // clearAllUserSelectedFilterLists();
  // console.log(window.appObject.userSelectedUseCaseList);

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
  elements.closeFiltersLink.click();
  elements.searchButton.click();
});

elements.searchButton.addEventListener('click', () => {
  window.appObject.inputText = elements.inputField.value.trim().replace('/[ ]+/g', ' ');
  window.appObject.pageNo = 1;
  window.appObject.searchByCollectionActivated = false;

  checkInputError(window.appObject.inputText);
  // checkIfSourceFilterIsRendered();
  checkInternetConnection();
  removeNode('no-image-found-mes');
  removeOldSearchResults();
  removeLoaderAnimation();
  // applyFilters();

  // enable spinner
  addSpinner(elements.spinnerPlaceholderGrid, 'original');
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

async function nextRequest(page) {
  let result = [];
  let url;
  if (window.appObject.searchByCollectionActivated) {
    url = getCollectionsUrl(window.appObject.collectionName, page, window.appObject.enableMatureContent);
  } else {
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

    console.log(url);
    const response = await fetch(url);
    const json = await response.json();
    result = json.results;
  }
  // console.log(result);
  addSearchThumbnailsToDOM(primaryGridMasonryObject, result, elements.gridPrimary);
  window.appObject.pageNo += 1;
}

elements.loadMoreSearchButton.addEventListener('click', () => {
  removeLoadMoreButton(elements.loadMoreSearchButtonWrapper);
  addSpinner(elements.spinnerPlaceholderGrid, 'for-bottom');
  nextRequest(window.appObject.pageNo);
});

elements.loadMoreBookmarkButton.addEventListener('click', () => {
  removeLoadMoreButton(elements.loadMoreBookmarkButtonkWrapper);
  addSpinner(elements.spinnerPlaceholderGrid, 'for-bottom');
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

generateNewStorageSchemaForFilters();
