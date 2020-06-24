import { elements } from './base';
import { activatePopup } from './infoPopupModule';
import { msnry, removeBookmarkImages } from './bookmarkModule.utils';
import { removeLoadMoreButton } from './helper';
// eslint-disable-next-line import/no-cycle
import { removeOldSearchResults, removeLoaderAnimation, checkInternetConnection } from './searchModule';
import { addSpinner, removeSpinner } from './spinner';
import { showNotification, removeNode, restoreInitialContent, removeChildNodes } from '../utils';
// eslint-disable-next-line import/no-cycle
import loadCollections from './collectionModule';
// eslint-disable-next-line import/no-cycle
import loadStoredContentToUI from './popup.utils';

const download = require('downloadjs');

// Store Select Button for All bookmarks, with their properties
const bookmarkDOM = {};

// Store number of selected bookmarks for export
let selectedBookmarks = 0;

function getImageDetail(eventTarget) {
  const imageObject = {};
  imageObject.thumbnail = eventTarget.dataset.imageThumbnail;
  imageObject.license = eventTarget.dataset.imageLicense;

  return JSON.stringify(imageObject);
}

export default function toggleBookmark(e) {
  chrome.storage.sync.get({ bookmarks: {} }, items => {
    const bookmarksObject = items.bookmarks;
    const { imageId } = e.target.dataset;
    console.log(bookmarksObject);
    if (!Object.prototype.hasOwnProperty.call(bookmarksObject, imageId)) {
      const imageDetail = getImageDetail(e.target);
      // bookmarksArray.push(imageId);
      bookmarksObject[imageId] = imageDetail;
      chrome.storage.sync.set({ bookmarks: bookmarksObject }, () => {
        e.target.classList.remove('fa-bookmark-o');
        e.target.classList.add('fa-bookmark');
        e.target.title = 'Remove Bookmark';
        showNotification('Image Bookmarked', 'positive', 'snackbar-bookmarks');
      });
    } else {
      delete bookmarksObject[imageId];
      chrome.storage.sync.set({ bookmarks: bookmarksObject }, () => {
        e.target.classList.remove('fa-bookmark');
        e.target.classList.add('fa-bookmark-o');
        e.target.title = 'Bookmark Image';
        showNotification('Bookmark removed', 'positive', 'snackbar-bookmarks');
      });
    }
  });
}

function appendToGrid(msnryObject, fragment, e, grid) {
  grid.appendChild(fragment);
  msnryObject.appended(e);
  // eslint-disable-next-line no-undef
  imagesLoaded(grid).on('progress', () => {
    // layout Masonry after each image loads
    msnryObject.layout();
  });
}

function loadBookmarkImages() {
  chrome.storage.sync.get({ bookmarks: {} }, items => {
    const bookmarksObject = items.bookmarks;
    if (Object.keys(bookmarksObject).length > 0) {
      removeNode('bookmarks__initial-info');
    } else {
      removeSpinner(elements.spinnerPlaceholderBookmarks);
      restoreInitialContent('bookmarks');
    }

    // get the details of each image

    Object.keys(bookmarksObject).forEach(imageId => {
      const url = `http://api.creativecommons.engineering/v1/images/${imageId}`;
      fetch(url)
        .then(data => data.json())
        .then(res => {
          const fragment = document.createDocumentFragment();

          const { thumbnail, license, id } = res;
          const licenseArray = license.split('-'); // split license in individual characteristics

          // make an image element
          const imgElement = document.createElement('img');
          imgElement.setAttribute('src', thumbnail);
          imgElement.setAttribute('class', 'image-thumbnails');
          imgElement.setAttribute('id', id);

          // make select button
          const selectCheckboxElement = document.createElement('span');
          selectCheckboxElement.setAttribute('class', 'bookmark-select');
          const selectCheckbox = document.createElement('input');
          selectCheckbox.setAttribute('type', 'checkbox');
          selectCheckbox.setAttribute('data-image-id', id);
          selectCheckbox.setAttribute('title', 'Select Image');
          selectCheckbox.setAttribute('data-image-thumbnail', thumbnail);
          selectCheckbox.setAttribute('data-image-license', license);
          selectCheckbox.classList.add('select-checkbox');
          selectCheckbox.classList.add('margin-right-smaller');
          selectCheckboxElement.appendChild(selectCheckbox);

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
            const lowerCaseName = `${name}`.toLowerCase();
            licenseIconElement = document.createElement('img');
            licenseIconElement.setAttribute('src', `img/license_logos/cc-${lowerCaseName}_icon.svg`);
            licenseIconElement.setAttribute('alt', `cc-${lowerCaseName}_icon`);
            licenseIconElementsArray.push(licenseIconElement);
          });

          licenseIconElementsArray.forEach(licenseIcon => {
            licenseLinkElement.appendChild(licenseIcon);
          });

          spanLicenseElement.appendChild(licenseLinkElement);

          // make a div element to encapsulate image element
          const divElement = document.createElement('div');
          divElement.setAttribute('class', 'image');
          divElement.id = `id_${imageId}`; // used for searching image div element

          // adding event listener to open popup.
          divElement.addEventListener('click', e => {
            if (e.target.classList.contains('image')) {
              checkInternetConnection();
              const imageThumbnail = e.target.querySelector('.image-thumbnails');
              activatePopup(imageThumbnail);
            }
          });

          divElement.appendChild(imgElement);
          divElement.appendChild(selectCheckboxElement);
          divElement.appendChild(spanLicenseElement);

          // div to act as grid itemj
          const gridItemDiv = document.createElement('div');
          gridItemDiv.setAttribute('class', 'grid-item');

          gridItemDiv.appendChild(divElement);

          fragment.appendChild(gridItemDiv);

          removeSpinner(elements.spinnerPlaceholderBookmarks);
          appendToGrid(msnry, fragment, gridItemDiv, elements.gridBookmarks);
        })
        .then(() => {
          // Add onClick event to all the checkboxes

          // Get checkbox data from DOM
          const checkbox = elements.selectCheckboxes[elements.selectCheckboxes.length - 1];

          // Initiate isChecked property of checkbox and update bookmarkDOM
          checkbox.isChecked = false;
          bookmarkDOM[checkbox.getAttribute('id')] = checkbox;

          selectedBookmarks = 0;
          elements.buttonSelectAllCheckbox[0].innerText = 'Select All';

          // Add click function to keep checkbox data in sync with DOM
          checkbox.addEventListener('click', () => {
            // Check wheather the checkbox is already checked or not
            if (checkbox.isChecked) {
              checkbox.parentElement.removeAttribute('style');
              selectedBookmarks -= 1;
            } else {
              checkbox.parentElement.setAttribute('style', 'opacity : 1');
              selectedBookmarks += 1;
            }
            checkbox.isChecked = !checkbox.isChecked; // Update isChecked Property in checkbox

            // Update SelectAll Button
            if (selectedBookmarks === 0) {
              elements.buttonSelectAllCheckbox[0].innerText = 'Select All';
            } else if (selectedBookmarks > 0) {
              elements.buttonSelectAllCheckbox[0].innerText = 'Deselect All';
            }
          });
        });
    });
  });
}

// EventListeners
document.addEventListener('DOMContentLoaded', () => {
  elements.bookmarksIcon.addEventListener('click', () => {
    if (window.appObject.activeSection !== 'bookmarks') {
      window.appObject.activeSection = 'bookmarks';
      elements.homeIcon.style.pointerEvents = 'none';
      setTimeout(() => {
        elements.homeIcon.style.pointerEvents = 'auto';
      }, 300);
      // show the bookmarks section and hide other ones
      elements.primarySection.style.display = 'none';
      elements.collectionsSection.style.display = 'none';
      elements.bookmarksSection.style.display = 'block';
      // prepare the bookmarks section
      elements.inputField.value = '';
      checkInternetConnection();
      // remove previous spinner. On low net connection, multiple spinner may appear
      // due to delay in result fetching and continous section switching
      removeSpinner(elements.spinnerPlaceholderBookmarks);
      addSpinner(elements.spinnerPlaceholderBookmarks, 'original');
      removeOldSearchResults();
      removeLoaderAnimation();
      loadBookmarkImages();
    }
  });

  elements.homeIcon.addEventListener('click', () => {
    if (window.appObject.activeSection !== 'search') {
      window.appObject.activeSection = 'search';
      elements.bookmarksIcon.style.pointerEvents = 'none';
      setTimeout(() => {
        elements.bookmarksIcon.style.pointerEvents = 'auto';
      }, 300);
      // show the bookmarks section and hide other ones
      elements.primarySection.style.display = 'block';
      elements.bookmarksSection.style.display = 'none';
      elements.collectionsSection.style.display = 'none';
      // prepare the search section
      removeLoadMoreButton(elements.loadMoreButtonWrapper);
      removeBookmarkImages();
      if (window.appObject.searchByCollectionActivated === true && window.appObject.searchingNewCollection === true) {
        removeNode('no-image-found-mes');
        removeOldSearchResults();
        window.appObject.searchingNewCollection = false;
      } else if (localStorage.length !== 0) {
        loadStoredContentToUI();
      } else {
        removeNode('no-image-found-mes');
        restoreInitialContent('primary');
        elements.clearSearchButton[0].classList.add('display-none');
      }
    }
  });

  elements.collectionsIcon.addEventListener('click', () => {
    // console.log('collections clicked');
    if (window.appObject.activeSection !== 'collections') {
      window.appObject.activeSection = 'collections';
      elements.primarySection.style.display = 'none';
      elements.bookmarksSection.style.display = 'none';
      elements.collectionsSection.style.display = 'block';
      // remove previous spinner. On low net connection, multiple spinner may appear
      // due to delay in result fetching and continous section switching
      removeSpinner(elements.spinnerPlaceholderCollections);
      addSpinner(elements.spinnerPlaceholderCollections, 'original');
      removeOldSearchResults();
      removeBookmarkImages();
      removeChildNodes(elements.collectionsSectionBody);
      loadCollections();
    }
  });

  elements.deleteBookmarksButton.addEventListener('click', () => {
    chrome.storage.sync.get({ bookmarks: {} }, items => {
      const bookmarksObject = items.bookmarks;
      const bookmarkDOMArray = Object.values(bookmarkDOM);

      // to store the id's of deleted bookmarks
      const deletedBookmarks = [];

      bookmarkDOMArray.forEach(checkbox => {
        if (checkbox.checked) {
          const { imageId } = checkbox.dataset;
          delete bookmarkDOM[imageId]; // remove the selected bookmark from bookmarkDOM object
          deletedBookmarks.push(imageId);
        }
      });

      if (deletedBookmarks.length === 0) {
        showNotification('No bookmark selected', 'negative', 'snackbar-bookmarks');
      } else {
        deletedBookmarks.forEach(bookmarkId => {
          delete bookmarksObject[bookmarkId];
        });
        chrome.storage.sync.set({ bookmarks: bookmarksObject }, () => {
          // removing the selected bookmarks from the grid
          deletedBookmarks.forEach(bookmarkdId => {
            const imageDiv = document.getElementById(`id_${bookmarkdId}`);
            imageDiv.parentElement.removeChild(imageDiv);
          });

          // reorganizing the layout using masonry
          msnry.layout();
          // confirm user action
          showNotification('Bookmarks successfully removed', 'positive', 'snackbar-bookmarks');
          // Read default "Select all"
          elements.buttonSelectAllCheckbox[0].innerText = 'Select All';
          selectedBookmarks = 0;
        });
      }
    });
  });

  elements.buttonSelectAllCheckbox[0].addEventListener('click', () => {
    // Stores data of Checkboxes for exporting
    const bookmarkDOMArray = Object.values(bookmarkDOM);

    if (selectedBookmarks > 0) {
      bookmarkDOMArray.forEach(checkbox => {
        if (checkbox.checked) checkbox.click();
      });
      selectedBookmarks = 0;
    } else if (selectedBookmarks === 0) {
      bookmarkDOMArray.forEach(checkbox => {
        if (!checkbox.checked) checkbox.click();
      });
    }
  });

  // change export and import accordingly
  elements.exportBookmarksButton.addEventListener('click', () => {
    const bookmarks = [];

    Object.values(bookmarkDOM).forEach(checkbox => {
      if (checkbox.checked) {
        bookmarks.push(checkbox.dataset.imageId);
      }
    });

    if (bookmarks.length) {
      const bookmarksString = JSON.stringify(bookmarks);
      download(bookmarksString, 'bookmarks.json', 'text/plain');
    } else {
      showNotification('No bookmarks selected', 'negative', 'snackbar-bookmarks');
    }
  });
});
