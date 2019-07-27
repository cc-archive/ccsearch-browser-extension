import { elements } from './base';
import { activatePopup } from './infoPopupModule';
import { providerLogos, unicodeToString } from './helper';
// eslint-disable-next-line import/no-cycle
import { removeOldSearchResults, removeLoaderAnimation } from './searchModule';
import { addSpinner, removeSpinner } from './spinner';

function showNotification(message, context) {
  const snackbar = document.getElementById('snackbar');
  snackbar.innerText = message;

  snackbar.classList.add('show');
  if (context === 'positive') snackbar.classList.add('snackbar-positive');
  else if (context === 'negative') snackbar.classList.add('snackbar-negative');

  setTimeout(() => {
    snackbar.className = '';
  }, 1100);
}

function restoreInitialContentBookmarks() {
  const sectionContentBookmarks = document.querySelector('.section-content--bookmarks');

  const sectionContentInitialInfo = document.querySelector(
    '.section-content--bookmarks .initial-info',
  );

  if (!sectionContentInitialInfo) {
    const initialInfoElement = `<p class="initial-info">
              No Bookmarks yet
            </p>`;

    sectionContentBookmarks.querySelector('.row').innerHTML = initialInfoElement;
  }
}

export default function bookmarkImage(e) {
  console.log('save bookmark');
  console.log(e.target);
  console.log(e.target.dataset.imageid);
  // eslint-disable-next-line no-undef
  chrome.storage.local.get({ bookmarks: [] }, (items) => {
    const bookmarksArray = items.bookmarks;
    if (bookmarksArray.indexOf(e.target.dataset.imageid) === -1) {
      bookmarksArray.push(e.target.dataset.imageid);
      console.log(bookmarksArray);
      // eslint-disable-next-line no-undef
      chrome.storage.local.set({ bookmarks: bookmarksArray }, () => {
        console.log('bookmarks updated');
        e.target.innerText = 'bookmark';
        showNotification('Image Bookmarked', 'positive');
      });
    } else {
      showNotification('Image already bookmarked!', 'negative');
    }
  });
}

function removeBookmark(e) {
  console.log('remove bookmark');
  const imageId = e.target.dataset.imageid;
  // eslint-disable-next-line no-undef
  chrome.storage.local.get({ bookmarks: [] }, (items) => {
    const bookmarksArray = items.bookmarks;

    const bookmarkIndex = bookmarksArray.indexOf(imageId);
    bookmarksArray.splice(bookmarkIndex, 1);

    let isLastImage = false;
    if (bookmarksArray.length === 0) {
      isLastImage = true;
    }

    console.log(bookmarkIndex);
    // eslint-disable-next-line no-undef
    chrome.storage.local.set({ bookmarks: bookmarksArray }, () => {
      console.log('bookmarks updated');
      const imageDiv = document.getElementById(`id_${imageId}`);
      imageDiv.parentElement.removeChild(imageDiv);
      // eslint-disable-next-line no-use-before-define
      msnry.layout(); // layout grid again
      showNotification('Bookmark removed', 'positive');

      if (isLastImage) {
        restoreInitialContentBookmarks();
      }
    });
  });
}

function appendToGrid(msnry, fragment, e, grid) {
  grid.appendChild(fragment);
  msnry.appended(e);
  // eslint-disable-next-line no-undef
  imagesLoaded(grid).on('progress', () => {
    // layout Masonry after each image loads
    msnry.layout();
    // console.log('this function was called');
  });
}

// eslint-disable-next-line no-undef
const msnry = new Masonry(elements.gridBookmarks, {
  // options
  itemSelector: '.grid-item',
  columnWidth: '.grid-item',
  gutter: '.gutter-sizer',
  percentPosition: true,
  transitionDuration: '0',
});

function removeInitialContent() {
  const sectionContentParagraph = document.querySelector('.section-content--bookmarks p');
  if (sectionContentParagraph) {
    sectionContentParagraph.parentNode.removeChild(sectionContentParagraph);
  }
}

function loadImages() {
  // eslint-disable-next-line no-undef
  chrome.storage.local.get({ bookmarks: [] }, (items) => {
    const bookmarksArray = items.bookmarks;
    if (bookmarksArray.length > 0) {
      removeInitialContent();
    } else {
      removeSpinner(elements.spinnerPlaceholderBookmarks);
      restoreInitialContentBookmarks();
    }
    console.log(bookmarksArray);

    // get the details of each image

    bookmarksArray.forEach((imageId) => {
      const url = `http://api.creativecommons.engineering/image/${imageId}`;
      fetch(url)
        .then(data => data.json())
        .then((res) => {
          console.log(res);

          const fragment = document.createDocumentFragment();

          const thumbnail = res.thumbnail ? res.thumbnail : res.url;
          const title = unicodeToString(res.title);
          const { license, id } = res;
          const provider = res.provider_code.toLowerCase();
          const licenseArray = license.split('-'); // split license in individual characteristics
          const foreignLandingUrl = res.foreign_landing_url;

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
          licenseLinkElement.setAttribute(
            'href',
            `https://creativecommons.org/licenses/${license}/2.0/`,
          );
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
          bookmarkIcon.title = 'Remove bookmark';
          bookmarkIcon.innerText = 'bookmark_border';
          bookmarkIcon.setAttribute('data-imageid', id);
          bookmarkIcon.addEventListener('click', removeBookmark);

          spanLicenseElement.appendChild(licenseLinkElement);
          spanLicenseElement.appendChild(bookmarkIcon);

          // make a div element to encapsulate image element
          const divElement = document.createElement('div');
          divElement.setAttribute('class', 'image');
          divElement.id = `id_${imageId}`; // used for searching image div element

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

          console.log(gridItemDiv);

          removeSpinner(elements.spinnerPlaceholderBookmarks);
          appendToGrid(msnry, fragment, gridItemDiv, elements.gridBookmarks);
        });
    });
  });
}

// TODO: use a general function
function removeBookmarkImages() {
  elements.gridBookmarks.innerHTML = '<div class="gutter-sizer"></div>';
}

export function restoreInitialContentPrimary() {
  const sectionContentPrimary = document.querySelector('.section-content--primary');

  const sectionContentInitialInfo = document.querySelector(
    '.section-content--primary .initial-info',
  );

  if (!sectionContentInitialInfo) {
    const initialInfoElement = `<p class="initial-info">
              Search for free content in the public domain and under Creative Commons licenses.<br /><br />
              Learn more about CC licenses
              <a href="https://creativecommons.org/share-your-work/licensing-types-examples/" target="_blank">
                here.
              </a>
            </p>`;
    sectionContentPrimary.querySelector('.row').innerHTML = initialInfoElement;
  }
}

elements.showBookmarksIcon.addEventListener('click', () => {
  window.isBookmarksActive = true;

  elements.homeIcon.style.pointerEvents = 'none';
  setTimeout(() => {
    elements.homeIcon.style.pointerEvents = 'auto';
  }, 500);
  elements.primarySection.style.display = 'none';
  elements.bookmarksSection.style.display = 'block';
  // elements.homeIcon.style.visibility = 'visible';
  elements.homeIcon.style.display = 'inline-block';
  elements.showBookmarksIcon.style.display = 'none';
  elements.inputField.value = '';

  addSpinner(elements.spinnerPlaceholderBookmarks);
  removeOldSearchResults();
  removeLoaderAnimation();
  restoreInitialContentPrimary();
  loadImages();
});

elements.homeIcon.addEventListener('click', (e) => {
  window.isBookmarksActive = false;

  elements.showBookmarksIcon.style.pointerEvents = 'none';
  setTimeout(() => {
    elements.showBookmarksIcon.style.pointerEvents = 'auto';
  }, 500);
  elements.primarySection.style.display = 'block';
  elements.bookmarksSection.style.display = 'none';
  elements.showBookmarksIcon.style.display = 'inline-block';
  e.target.style.display = 'none';

  removeBookmarkImages();
});
