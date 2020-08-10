import { elements } from './base';
import { addLoadMoreButton, removeLoadMoreButton } from './helper';
import { activatePopup } from './infoPopupModule';
import { removeSpinner } from './spinner';
// eslint-disable-next-line import/no-cycle
import toggleBookmark from './bookmarkModule';
import { showNotification, removeChildNodes, restoreInitialContent, activeBookmarkIdContainers } from '../utils';

const Masonry = require('masonry-layout');

export function checkInternetConnection() {
  if (!navigator.onLine) {
    removeSpinner(elements.spinnerPlaceholderPopup);
    showNotification('No Internet Connection', 'negative', 'snackbar-bookmarks', 1500);
    throw new Error('No Internet Connection');
  }
}

export function checkInputError(inputText) {
  if (inputText === '') {
    showNotification('No search query provided', 'negative', 'snackbar-bookmarks');
    // to stop further js execution
    throw new Error('No search query provided');
  }
}

export function removeOldSearchResults() {
  // remove old images for a new search
  const div = document.createElement('div');
  div.classList.add('gutter-sizer');
  removeChildNodes(elements.gridPrimary);
  elements.gridPrimary.appendChild(div);
}

export function getRequestUrl(
  searchQuery,
  userSelectedUseCaseList,
  userSelectedLicenseList,
  userSelectedSourceList,
  userSelectedFileTypeList,
  userSelectedImageTypeList,
  userSelectedImageSizeList,
  userSelectedAspectRatioList,
  page,
  enableMatureContent,
) {
  if (userSelectedUseCaseList.length > 0) {
    return `https://api.creativecommons.engineering/v1/images?q=${searchQuery}&page=${page}&page_size=20&license_type=${userSelectedUseCaseList}&source=${userSelectedSourceList}&extension=${userSelectedFileTypeList}&categories=${userSelectedImageTypeList}&size=${userSelectedImageSizeList}&aspect_ratio=${userSelectedAspectRatioList}&mature=${enableMatureContent}`;
  }
  return `https://api.creativecommons.engineering/v1/images?q=${searchQuery}&page=${page}&page_size=20&license=${userSelectedLicenseList}&source=${userSelectedSourceList}&extension=${userSelectedFileTypeList}&categories=${userSelectedImageTypeList}&size=${userSelectedImageSizeList}&aspect_ratio=${userSelectedAspectRatioList}&mature=${enableMatureContent}`;
}

export function getCollectionsUrl(collectionName, page, enableMatureContent) {
  return `https://api.creativecommons.engineering/v1/images?source=${collectionName}&page=${page}&page_size=20&mature=${enableMatureContent}`;
}

function showNoResultFoundMessage() {
  const sectionContentPrimary = document.querySelector('.section-content--primary');

  const sectionContentInitialInfo = document.querySelector('.section-content--primary .initial-info');

  if (!sectionContentInitialInfo) {
    const paragraph = document.createElement('p');
    paragraph.classList.add('no-image-found-mes');
    paragraph.classList.add('initial-info');
    paragraph.textContent = 'No Images Found. Please enter a different query.';

    removeChildNodes(sectionContentPrimary.querySelector('.row'));
    // remove the "Load More" button.
    removeLoadMoreButton(elements.loadMoreSearchButtonWrapper);
    sectionContentPrimary.querySelector('.row').appendChild(paragraph);
  }
}

export function removeLoaderAnimation() {
  // elements.spinner.classList.remove('spinner');
  removeSpinner(elements.spinnerPlaceholderGrid);
  // TODO: use better logic
}

export function checkResultLength(resultArray) {
  if (resultArray.length === 0) {
    showNoResultFoundMessage();
    removeLoaderAnimation();
    // eslint-disable-next-line no-use-before-define
    msnry.layout();
  } else {
    // render the "Load More" button if non empty result
    addLoadMoreButton(elements.loadMoreSearchButtonWrapper);
  }
}

function appendToGrid(msnry, fragment, divs, grid) {
  grid.appendChild(fragment);
  msnry.appended(divs);
  // eslint-disable-next-line no-undef
  imagesLoaded(grid).on('progress', () => {
    // layout Masonry after each image loads
    msnry.layout();
  });
  removeLoaderAnimation();
  addLoadMoreButton(elements.loadMoreSearchButtonWrapper);
}

// TODO: be more specific
export function checkValidationError(apiResponse) {
  if (Object.prototype.hasOwnProperty.call(apiResponse, 'error_type')) {
    removeLoadMoreButton(elements.loadMoreSearchButtonWrapper);
    elements.gridPrimary.setAttribute('style', 'position: relative; height: 0px;');
    removeLoaderAnimation();
    restoreInitialContent('primary');

    if (apiResponse.error_type === 'InputError') {
      showNotification('Not a valid search query.', 'negative', 'snackbar-bookmarks');
    } else {
      showNotification('Some error occured. Please try again after some time.', 'negative', 'snackbar-bookmarks');
    }

    throw new Error('400 Bad Request');
  }
}

// eslint-disable-next-line no-undef
const msnry = new Masonry(elements.gridPrimary, {
  // options
  itemSelector: '.grid-item',
  columnWidth: '.grid-item',
  gutter: '.gutter-sizer',
  percentPosition: true,
  transitionDuration: '0',
});

export function addSearchThumbnailsToDOM(resultArray) {
  const divs = [];
  const fragment = document.createDocumentFragment();

  chrome.storage.sync.get(activeBookmarkIdContainers, items => {
    let allBookmarksImageIdsObject = {};
    activeBookmarkIdContainers.forEach(bookmarkIdContainerName => {
      allBookmarksImageIdsObject = { ...allBookmarksImageIdsObject, ...items[bookmarkIdContainerName] };
    });
    const allBookmarksImageIds = Object.keys(allBookmarksImageIdsObject);

    resultArray.forEach(element => {
      const thumbnail = element.thumbnail ? element.thumbnail : element.url;
      const { license, id } = element;
      const licenseArray = license.split('-'); // split license in individual characteristics

      // make an image element
      const imgElement = document.createElement('img');
      imgElement.setAttribute('src', thumbnail);
      imgElement.setAttribute('class', 'image-thumbnail');
      imgElement.setAttribute('id', id);

      const bookmarkIconDiv = document.createElement('div');
      bookmarkIconDiv.classList.add('bookmark-icon');

      const licenseDiv = document.createElement('div');
      licenseDiv.classList.add('image-icons');

      // Array to hold license image elements
      const licenseIconElementsArray = [];

      // Add the default cc icon
      let licenseIconElement = document.createElement('i');
      licenseIconElement.classList.add('icon', 'has-background-white', 'cc-logo');
      licenseIconElementsArray.push(licenseIconElement);

      // make and push license image elements
      licenseArray.forEach(name => {
        licenseIconElement = document.createElement('i');
        licenseIconElement.classList.add('icon', 'has-background-white', `cc-${name}`);
        licenseIconElementsArray.push(licenseIconElement);
      });

      licenseIconElementsArray.forEach(licenseIcon => {
        licenseDiv.appendChild(licenseIcon);
      });

      const bookmarkIcon = document.createElement('i');
      bookmarkIcon.classList.add('icon');
      bookmarkIcon.id = 'bookmark-icon';
      bookmarkIcon.setAttribute('data-image-id', id);
      bookmarkIcon.setAttribute('data-image-thumbnail', thumbnail);
      bookmarkIcon.setAttribute('data-image-license', license);
      bookmarkIcon.addEventListener('click', toggleBookmark);

      bookmarkIconDiv.appendChild(bookmarkIcon);

      // console.log(allBookmarksImageIds);
      // console.log(id);
      if (allBookmarksImageIds.indexOf(id) === -1) {
        bookmarkIcon.classList.add('bookmark-regular');
        bookmarkIcon.title = 'Bookmark image';
      } else {
        bookmarkIcon.classList.add('bookmark-solid');
        bookmarkIcon.title = 'Remove Bookmark';
      }

      // make a div element to encapsulate image element
      const divElement = document.createElement('div');
      divElement.classList.add('image', 'is-compact');

      // adding event listener to open popup.
      divElement.addEventListener('click', e => {
        if (e.target.classList.contains('image-thumbnail')) {
          checkInternetConnection();
          activatePopup(e.target);
        }
      });

      divElement.appendChild(imgElement);
      divElement.appendChild(bookmarkIconDiv);
      divElement.appendChild(licenseDiv);

      // div to act as grid itemj
      const gridItemDiv = document.createElement('div');
      gridItemDiv.setAttribute('class', 'grid-item');

      gridItemDiv.appendChild(divElement);

      fragment.appendChild(gridItemDiv);
      divs.push(gridItemDiv);

      // console.log(gridItemDiv);
    });

    appendToGrid(msnry, fragment, divs, elements.gridPrimary);
  });
}

export function search(url) {
  fetch(url)
    .then(data => data.json())
    .then(res => {
      checkValidationError(res);
      const resultArray = res.results;

      checkResultLength(resultArray);
      addSearchThumbnailsToDOM(resultArray);

      // Store Data to local storage
      if (resultArray.length !== 0) {
        localStorage.clear(); // clear the old results
        if (window.appObject.searchByCollectionActivated) {
          localStorage.setItem('searchByCollectionActivated', true);
          localStorage.setItem('collectionName', window.appObject.collectionName);
        } else {
          localStorage.setItem('searchByCollectionActivated', false);
        }
        window.appObject.storeSearch.title = window.appObject.inputText;
        localStorage.setItem('usecaseDropdownValues', elements.useCaseChooser.value);
        localStorage.setItem('sourceDropdownValues', elements.sourceChooser.value);
        localStorage.setItem('licenseDropdownValues', elements.licenseChooser.value);
        localStorage.setItem('fileTypeDropdownValues', elements.fileTypeChooser.value);
        localStorage.setItem('imageTypeDropdownValues', elements.imageTypeChooser.value);
        localStorage.setItem('imageSizeDropdownValues', elements.imageSizeChooser.value);
        localStorage.setItem('aspectRatioDropdownValues', elements.aspectRatioChooser.value);
        window.appObject.storeSearch.page = { ...resultArray };
        localStorage.setItem('title', window.appObject.storeSearch.title);
        localStorage.setItem(window.appObject.pageNo, JSON.stringify(window.appObject.storeSearch.page));

        // console.log(localStorage);
      }

      window.appObject.pageNo += 1;
    });
}
