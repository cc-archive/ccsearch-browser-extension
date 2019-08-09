import { elements } from './base';
import { unicodeToString, providerLogos } from './helper';
import { activatePopup } from './infoPopupModule';
import { removeSpinner } from './spinner';
// eslint-disable-next-line import/no-cycle
import { bookmarkImage } from './bookmarkModule';

const Masonry = require('masonry-layout');

export function checkInputError(inputText, errorSpanId) {
  const errorMessageSpan = document.getElementById(errorSpanId);
  if (inputText === '') {
    errorMessageSpan.textContent = 'Please enter a search query';
    throw new Error('Please enter a search query');
  } else {
    errorMessageSpan.textContent = '';
  }
}

export function removeInitialContent() {
  const sectionContentParagraph = document.querySelector('.section-content--primary p');
  if (sectionContentParagraph) {
    sectionContentParagraph.parentNode.removeChild(sectionContentParagraph);
  }
}

export function removeOldSearchResults() {
  // remove old images for a new search

  elements.gridPrimary.innerHTML = '<div class="gutter-sizer"></div>';
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
    const initialInfoElement = `<p class="initial-info">
    No Images Found. Please enter a different query.
            </p>`;
    sectionContentPrimary.querySelector('.row').innerHTML = initialInfoElement;
  }
}

export function checkResultLength(resultArray) {
  if (resultArray.length === 0) {
    showNoResultFoundMessage();
    // eslint-disable-next-line no-use-before-define
    msnry.layout();
  }
}

function appendToGrid(msnry, fragment, divs, grid) {
  grid.appendChild(fragment);
  msnry.appended(divs);
  // eslint-disable-next-line no-undef
  imagesLoaded(grid).on('progress', () => {
    // layout Masonry after each image loads
    msnry.layout();
    // console.log('this function was called');
  });
}

export function removeLoaderAnimation() {
  // elements.spinner.classList.remove('spinner');
  removeSpinner(elements.spinnerPlaceholderGrid);
  // TODO: use better logic
  // elements.noMoreImagesMessage.classList.remove('display-none');
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
    bookmarkIcon.classList.add('material-icons');
    bookmarkIcon.classList.add('bookmark-icon');
    bookmarkIcon.id = 'settings-icon';
    bookmarkIcon.title = 'Bookmark image';
    bookmarkIcon.innerText = 'bookmark_border';
    bookmarkIcon.setAttribute('data-imageid', id);
    bookmarkIcon.addEventListener('click', bookmarkImage);

    spanLicenseElement.appendChild(licenseLinkElement);
    spanLicenseElement.appendChild(bookmarkIcon);

    // make a div element to encapsulate image element
    const divElement = document.createElement('div');
    divElement.setAttribute('class', 'image');

    // adding event listener to open popup.
    divElement.addEventListener('click', (e) => {
      if (e.target.classList.contains('image')) {
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

    console.log(gridItemDiv);
  });

  appendToGrid(msnry, fragment, divs, elements.gridPrimary);

  if (resultArray.length <= 10) {
    removeLoaderAnimation();
  }
}
