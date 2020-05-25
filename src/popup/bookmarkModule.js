import { elements } from './base';
import { activatePopup } from './infoPopupModule';
import { msnry, removeBookmarkImages, removeBookmark } from './bookmarkModule.utils';
import { unicodeToString, removeLoadMoreButton, getSourceDisplayName } from './helper';
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

export default function toggleBookmark(e) {
  chrome.storage.sync.get({ bookmarks: [] }, items => {
    const bookmarksArray = items.bookmarks;
    const imageId = e.target.dataset.imageid;
    if (bookmarksArray.indexOf(imageId) === -1) {
      bookmarksArray.push(imageId);
      chrome.storage.sync.set({ bookmarks: bookmarksArray }, () => {
        e.target.classList.remove('fa-bookmark-o');
        e.target.classList.add('fa-bookmark');
        e.target.title = 'Remove Bookmark';
        showNotification('Image Bookmarked', 'positive', 'snackbar-bookmarks');
      });
    } else {
      const bookmarkIndex = bookmarksArray.indexOf(imageId);
      bookmarksArray.splice(bookmarkIndex, 1);
      chrome.storage.sync.set({ bookmarks: bookmarksArray }, () => {
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

function loadImages() {
  chrome.storage.sync.get({ bookmarks: [] }, items => {
    const bookmarksArray = items.bookmarks;
    if (bookmarksArray.length > 0) {
      removeNode('bookmarks__initial-info');
    } else {
      removeSpinner(elements.spinnerPlaceholderBookmarks);
      restoreInitialContent('bookmarks');
    }

    // get the details of each image

    bookmarksArray.forEach(imageId => {
      const url = `http://api.creativecommons.engineering/v1/images/${imageId}`;
      fetch(url)
        .then(data => data.json())
        .then(res => {
          const fragment = document.createDocumentFragment();

          const thumbnail = res.thumbnail ? res.thumbnail : res.url;
          const title = unicodeToString(res.title);
          const { license, id } = res;
          const source = getSourceDisplayName(res.source);
          const licenseArray = license.split('-'); // split license in individual characteristics
          const foreignLandingUrl = res.foreign_landing_url;

          // make an image element
          const imgElement = document.createElement('img');
          imgElement.setAttribute('src', thumbnail);
          imgElement.setAttribute('class', 'image-thumbnails');
          imgElement.setAttribute('id', id);

          // make a span to hold the title
          const spanTitleElement = document.createElement('span');
          spanTitleElement.setAttribute('class', 'extension-image-title');
          spanTitleElement.setAttribute('title', title);
          const imageTitleNode = document.createTextNode(title);

          // make a link to foreign landing page of image
          const foreignLandingLinkElement = document.createElement('a');
          foreignLandingLinkElement.setAttribute('href', foreignLandingUrl);
          foreignLandingLinkElement.setAttribute('target', '_blank');
          foreignLandingLinkElement.setAttribute('class', 'foreign-landing-url');
          foreignLandingLinkElement.setAttribute('title', `Source: ${source}`);
          foreignLandingLinkElement.appendChild(imageTitleNode);

          spanTitleElement.appendChild(foreignLandingLinkElement);

          // make select button
          const selectCheckboxElement = document.createElement('span');
          selectCheckboxElement.setAttribute('class', 'bookmark-select');
          const selectCheckbox = document.createElement('input');
          selectCheckbox.setAttribute('type', 'checkbox');
          selectCheckbox.setAttribute('id', id);
          selectCheckbox.setAttribute('title', 'Select Image');
          selectCheckbox.setAttribute(
            'class',
            'select-checkbox vocab choice-field green-colored dark-shaded small-sized',
          );
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

          const bookmarkIcon = document.createElement('i');
          bookmarkIcon.classList.add('fa');
          bookmarkIcon.classList.add('fa-bookmark');
          bookmarkIcon.classList.add('bookmark-icon');
          bookmarkIcon.id = 'bookmark-icon';
          bookmarkIcon.title = 'Remove bookmark';
          bookmarkIcon.setAttribute('data-imageid', id);
          bookmarkIcon.addEventListener('click', removeBookmark);

          spanLicenseElement.appendChild(licenseLinkElement);
          spanLicenseElement.appendChild(bookmarkIcon);

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
          divElement.appendChild(spanTitleElement);
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
          elements.buttonSelectAllCheckbox[0].children[0].innerText = 'Select All';

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
              elements.buttonSelectAllCheckbox[0].children[0].innerText = 'Select All';
            } else if (selectedBookmarks > 0) {
              elements.buttonSelectAllCheckbox[0].children[0].innerText = 'Deselect All';
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
      addSpinner(elements.spinnerPlaceholderBookmarks, 'original');
      removeOldSearchResults();
      removeLoaderAnimation();
      loadImages();
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
      if (window.appObject.searchByCollection === true) {
        removeNode('primary__initial-info');
        removeNode('no-image-found');
        removeOldSearchResults();
      } else if (localStorage.length !== 0) {
        loadStoredContentToUI();
      } else {
        removeNode('no-image-found');
        restoreInitialContent('primary');
        elements.clearSearchButton[0].classList.add('display-none');
      }
    }
  });

  elements.collectionsIcon.addEventListener('click', () => {
    console.log('collections clicked');
    if (window.appObject.activeSection !== 'collections') {
      window.appObject.activeSection = 'collections';
      elements.primarySection.style.display = 'none';
      elements.bookmarksSection.style.display = 'none';
      elements.collectionsSection.style.display = 'block';
      addSpinner(elements.spinnerPlaceholderCollections, 'original');
      removeOldSearchResults();
      removeChildNodes(elements.collectionsSectionBody);
      loadCollections();
    }
  });

  elements.deleteBookmarksButton.addEventListener('click', () => {
    chrome.storage.sync.get({ bookmarks: [] }, items => {
      const bookmarksArray = items.bookmarks;
      const bookmarkDOMArray = Object.values(bookmarkDOM);

      // to store the id's of deleted bookmarks
      const deletedBookmarks = [];
      // to store the id's of non-deleted bookmarks
      const nonDeletedBookmarks = [];

      bookmarkDOMArray.forEach(checkbox => {
        if (checkbox.checked) {
          delete bookmarkDOM[checkbox.id]; // remove the selected bookmark from bookmarkDOM object
          deletedBookmarks.push(checkbox.id);
        } else {
          nonDeletedBookmarks.push(checkbox.id);
        }
      });

      if (bookmarksArray.length === nonDeletedBookmarks.length) {
        showNotification('No bookmark selected', 'negative', 'snackbar-bookmarks');
      } else {
        chrome.storage.sync.set({ bookmarks: nonDeletedBookmarks }, () => {
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
          elements.buttonSelectAllCheckbox[0].children[0].innerText = 'Select All';
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

  elements.exportBookmarksButton.addEventListener('click', () => {
    const bookmarks = [];

    Object.values(bookmarkDOM).forEach(checkbox => {
      if (checkbox.checked) bookmarks.push(checkbox.id);
    });

    if (bookmarks.length) {
      const bookmarksString = JSON.stringify(bookmarks);
      download(bookmarksString, 'bookmarks.json', 'text/plain');
    } else {
      showNotification('No bookmarks selected', 'negative', 'snackbar-bookmarks');
    }
  });
});
