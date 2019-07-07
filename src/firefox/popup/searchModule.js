import { elements } from './base';
import { unicodeToString, providerLogos } from './helper';
import { activatePopup } from './infoPopupModule';

export function checkInputError(inputText) {
  if (inputText === '') {
    elements.errorMessage.textContent = 'Please enter a search query';
    throw new Error('Please enter a search query');
  } else {
    elements.errorMessage.textContent = '';
  }
}

export function removeInitialContent() {
  if (elements.sectionContentParagraph) {
    elements.sectionContentParagraph.parentNode.removeChild(elements.sectionContentParagraph);
  }
}

export function removeOldSearchResults() {
  // remove old images for a new search

  elements.grid.innerHTML = '<div class="gutter-sizer"></div>';
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
  const sectionContent = document.querySelector('.section-content');
  const noResultFoundPara = document.createElement('p');
  noResultFoundPara.textContent = 'No result Found. Please try a different search query.';
  sectionContent.appendChild(noResultFoundPara);
}

export function checkResultLength(resultArray) {
  if (resultArray.length === 0) {
    showNoResultFoundMessage();
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

function removeLoaderAnimation() {
  elements.spinner.classList.remove('spinner');
  elements.noMoreImagesMessage.classList.remove('display-none');
}

// eslint-disable-next-line no-undef
const msnry = new Masonry(elements.grid, {
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
    spanLicenseElement.appendChild(licenseLinkElement);

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

  appendToGrid(msnry, fragment, divs, elements.grid);

  if (resultArray.length <= 10) {
    removeLoaderAnimation();
  }
}
