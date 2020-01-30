import { elements } from './base';
import { unicodeToString, providerLogos, addLoadMoreButton } from './helper';
import { activatePopup } from './infoPopupModule';
import { removeSpinner } from './spinner';
// eslint-disable-next-line import/no-cycle
import bookmarkImage from './bookmarkModule';
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
  inputText,
  userSelectedUseCaseList,
  userSelectedLicensesList,
  userSelectedProvidersList,
  page,
) {
  if (userSelectedUseCaseList.length > 0) {
    return `https://api.creativecommons.engineering/image/search?q=${inputText}&page=${page}&pagesize=20&lt=${userSelectedUseCaseList}&provider=${userSelectedProvidersList}`;
  }
  return `https://api.creativecommons.engineering/image/search?q=${inputText}&page=${page}&pagesize=20&li=${userSelectedLicensesList}&provider=${userSelectedProvidersList}`;
}

function showNoResultFoundMessage() {
  const sectionContentPrimary = document.querySelector('.section-content--primary');

  const sectionContentInitialInfo = document.querySelector(
    '.section-content--primary .initial-info',
  );

  if (!sectionContentInitialInfo) {
    // const initialInfoElement = `<p class="no-image-found initial-info">
    // No Images Found. Please enter a different query.
    //         </p>`;
    const paragraph = document.createElement('p');
    paragraph.classList.add('no-image-found');
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
  // elements.noMoreImagesMessage.classList.remove('display-none');
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
  if (Object.prototype.hasOwnProperty.call(apiResponse, 'validation_error')) {
    showNotification('Not a valid search query', 'negative', 'snackbar-bookmarks');
    removeLoaderAnimation();
    restoreInitialContent('primary');
    throw new Error('Not valid search query');
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

  chrome.storage.sync.get({ bookmarks: [] }, (items) => {
    const bookmarksArray = items.bookmarks;

    resultArray.forEach((element) => {
      const thumbnail = element.thumbnail ? element.thumbnail : element.url;
      const title = unicodeToString(element.title);
      const { license, provider, id } = element;
      const licenseArray = license.split('-'); // split license in individual characteristics
      const foreignLandingUrl = element.foreign_landing_url;

      // make an image element
      const imgElement = document.createElement('img');
      imgElement.setAttribute('src', thumbnail);
      imgElement.setAttribute('class', 'image-thumbnails');
      imgElement.setAttribute('id', id);

      // make a span to hold the title
      const spanTitleElement = document.createElement('span');
      spanTitleElement.setAttribute('class', 'image-title');
      spanTitleElement.setAttribute('title', title);
      const imageTitleNode = document.createTextNode(title);

      // make a link to foreign landing page of image
      const foreignLandingLinkElement = document.createElement('a');
      foreignLandingLinkElement.setAttribute('href', foreignLandingUrl);
      foreignLandingLinkElement.setAttribute('target', '_blank');
      foreignLandingLinkElement.setAttribute('class', 'foreign-landing-url');

      const providerImageElement = document.createElement('img');
      let providerLogoName;
      for (let i = 0; i < providerLogos.length; i += 1) {
        if (providerLogos[i].includes(provider)) {
          providerLogoName = providerLogos[i];
          break;
        }
      }
      providerImageElement.setAttribute('src', `img/provider_logos/${providerLogoName}`);
      providerImageElement.setAttribute('class', 'provider-image');

      foreignLandingLinkElement.appendChild(providerImageElement);
      foreignLandingLinkElement.appendChild(imageTitleNode);

      spanTitleElement.appendChild(foreignLandingLinkElement);

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
      licenseArray.forEach((name) => {
        licenseIconElement = document.createElement('img');
        licenseIconElement.setAttribute('src', `img/license_logos/cc-${name}_icon.svg`);
        licenseIconElement.setAttribute('alt', `cc-${name}_icon`);
        licenseIconElementsArray.push(licenseIconElement);
      });

      licenseIconElementsArray.forEach((licenseIcon) => {
        licenseLinkElement.appendChild(licenseIcon);
      });

      const bookmarkIcon = document.createElement('i');
      bookmarkIcon.classList.add('fa');
      bookmarkIcon.classList.add('bookmark-icon');
      bookmarkIcon.id = 'bookmark-icon';
      bookmarkIcon.setAttribute('data-imageid', id);
      bookmarkIcon.addEventListener('click', bookmarkImage);

      if (bookmarksArray.indexOf(id) === -1) {
        bookmarkIcon.classList.add('fa-bookmark-o');
        bookmarkIcon.title = 'Bookmark image';
      } else {
        bookmarkIcon.classList.add('fa-bookmark');
        bookmarkIcon.title = 'Image bookmarked';
      }

      spanLicenseElement.appendChild(licenseLinkElement);
      spanLicenseElement.appendChild(bookmarkIcon);

      // make a div element to encapsulate image element
      const divElement = document.createElement('div');
      divElement.setAttribute('class', 'image');

      // adding event listener to open popup.
      divElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('image')) {
          checkInternetConnection();
          const imageThumbnail = e.target.querySelector('.image-thumbnails');
          activatePopup(imageThumbnail);
        }
      });

      divElement.appendChild(imgElement);
      divElement.appendChild(spanTitleElement);
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
