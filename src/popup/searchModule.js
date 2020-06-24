import { elements } from './base';
import { addLoadMoreButton, removeLoadMoreButton } from './helper';
import { activatePopup } from './infoPopupModule';
import { removeSpinner } from './spinner';
// eslint-disable-next-line import/no-cycle
import toggleBookmark from './bookmarkModule';
import { showNotification, removeChildNodes, restoreInitialContent } from '../utils';

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
    elements.loadMoreButtonWrapper.classList.add('removeLoadMore');
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
    // render the "Load More" button if non emtpy result
    elements.loadMoreButtonWrapper.classList.remove('removeLoadMore');
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
  addLoadMoreButton(elements.loadMoreButtonWrapper);
}

// TODO: be more specific
export function checkValidationError(apiResponse) {
  if (Object.prototype.hasOwnProperty.call(apiResponse, 'error_type')) {
    removeLoadMoreButton(elements.loadMoreButtonWrapper);
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

export function addThumbnailsToDOM(resultArray) {
  const divs = [];
  const fragment = document.createDocumentFragment();

  chrome.storage.sync.get({ bookmarks: [] }, items => {
    const bookmarksArray = items.bookmarks;

    resultArray.forEach(element => {
      const thumbnail = element.thumbnail ? element.thumbnail : element.url;
      const { license, id } = element;
      const licenseArray = license.split('-'); // split license in individual characteristics

      // make an image element
      const imgElement = document.createElement('img');
      imgElement.setAttribute('src', thumbnail);
      imgElement.setAttribute('class', 'image-thumbnails');
      imgElement.setAttribute('id', id);

      // make a span to hold the license icons
      const spanLicenseElement = document.createElement('span');
      spanLicenseElement.setAttribute('class', 'image-license');

      // make a link to license description
      const licenseLinkElement = document.createElement('a');
      licenseLinkElement.setAttribute('href', `https://creativecommons.org/licenses/${license}/2.0/`);
      licenseLinkElement.setAttribute('target', '_blank'); // open link in new tab
      licenseLinkElement.setAttribute('title', license); // open link in new tab

      // Array to hold license image elements
      const licenseIconElementsArray = [];

      // Add the default cc icon
      let licenseIconElement = document.createElement('img');
      licenseIconElement.setAttribute('src', 'img/license_logos/cc_icon.svg');
      licenseIconElement.setAttribute('alt', 'cc_icon');
      licenseIconElementsArray.push(licenseIconElement);

      // make and push license image elements
      licenseArray.forEach(name => {
        licenseIconElement = document.createElement('img');
        licenseIconElement.setAttribute('src', `img/license_logos/cc-${name}_icon.svg`);
        licenseIconElement.setAttribute('alt', `cc-${name}_icon`);
        licenseIconElementsArray.push(licenseIconElement);
      });

      licenseIconElementsArray.forEach(licenseIcon => {
        licenseLinkElement.appendChild(licenseIcon);
      });

      const bookmarkIcon = document.createElement('i');
      bookmarkIcon.classList.add('fa');
      bookmarkIcon.classList.add('bookmark-icon');
      bookmarkIcon.id = 'bookmark-icon';
      bookmarkIcon.setAttribute('data-image-id', id);
      bookmarkIcon.setAttribute('data-image-thumbnail', thumbnail);
      bookmarkIcon.setAttribute('data-image-license', license);
      bookmarkIcon.addEventListener('click', toggleBookmark);

      if (!Object.prototype.hasOwnProperty.call(bookmarksArray, id)) {
        console.log(bookmarksArray);
        console.log(bookmarksArray[id]);
        bookmarkIcon.classList.add('fa-bookmark-o');
        bookmarkIcon.title = 'Bookmark image';
      } else {
        bookmarkIcon.classList.add('fa-bookmark');
        bookmarkIcon.title = 'Remove Bookmark';
      }

      spanLicenseElement.appendChild(licenseLinkElement);
      spanLicenseElement.appendChild(bookmarkIcon);

      // make a div element to encapsulate image element
      const divElement = document.createElement('div');
      divElement.setAttribute('class', 'image');

      // adding event listener to open popup.
      divElement.addEventListener('click', e => {
        if (e.target.classList.contains('image')) {
          checkInternetConnection();
          const imageThumbnail = e.target.querySelector('.image-thumbnails');
          activatePopup(imageThumbnail);
        }
      });

      divElement.appendChild(imgElement);
      divElement.appendChild(spanLicenseElement);

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
      addThumbnailsToDOM(resultArray);

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

        console.log(localStorage);
      }

      window.appObject.pageNo += 1;
    });
}
