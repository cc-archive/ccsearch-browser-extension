/* eslint-disable no-param-reassign */
import { elements, constants } from './base';
// eslint-disable-next-line import/no-cycle
import {
  msnry,
  removeBookmarkImages,
  toggleEditView,
  openInfoPopup,
  removeActiveClassFromNavLinks,
} from './bookmarkModule.utils';
import { removeLoadMoreButton, addLoadMoreButton } from './helper';
// eslint-disable-next-line import/no-cycle
import { removeOldSearchResults, removeLoaderAnimation, checkInternetConnection } from './searchModule';
import { addSpinner, removeSpinner } from './spinner';
import {
  showNotification,
  removeNode,
  restoreInitialContent,
  removeChildNodes,
  keyNames,
  activeBookmarkContainers,
  activeBookmarkIdContainers,
} from '../utils';
// eslint-disable-next-line import/no-cycle
import loadCollections from './collectionModule';
// eslint-disable-next-line import/no-cycle
// import { loadStoredContentToUI } from './popup.utils';

const download = require('downloadjs');

// Store Select Button for All bookmarks, with their properties
const bookmarkDOM = {};

// Store number of selected bookmarks for export
// let selectedBookmarks = 0;

function getImageDetail(eventTarget) {
  const imageObject = {};
  imageObject.thumbnail = eventTarget.dataset.imageThumbnail;
  imageObject.license = eventTarget.dataset.imageLicense;

  return imageObject;
}

export default function toggleBookmark(e) {
  chrome.storage.sync.get(activeBookmarkIdContainers, items => {
    const allBookmarksImageIdsObject = {};
    Object.keys(items).forEach(bookmarksImageIdContainerName => {
      const bookmarksImageIdContainer = items[bookmarksImageIdContainerName];
      Object.keys(bookmarksImageIdContainer).forEach(id => {
        // 0th idx -> bookmark container number, 1st idx -> bookmark image id container number
        allBookmarksImageIdsObject[id] = [bookmarksImageIdContainer[id], bookmarksImageIdContainerName.substring(17)];
      });
    });
    const allBookmarksImageIds = Object.keys(allBookmarksImageIdsObject);
    const { imageId } = e.target.dataset;
    if (allBookmarksImageIds.indexOf(imageId) === -1) {
      const imageDetail = getImageDetail(e.target);
      // bookmarksArray.push(imageId);
      // bookmarksObject[imageId] = imageDetail;
      chrome.storage.sync.get('bookmarksLength', items2 => {
        const { bookmarksLength } = items2;
        let validBookmarksKey = null;
        for (let i = 0; i < activeBookmarkContainers.length; i += 1) {
          if (bookmarksLength[activeBookmarkContainers[i]] < constants.bookmarkContainerSize) {
            validBookmarksKey = activeBookmarkContainers[i];
            break;
          }
        }
        if (!validBookmarksKey) {
          showNotification('Error: Bookmarks Limit reached', 'negative', 'snackbar-bookmarks');
          throw new Error('Bookmarks Limit reached');
        }
        let validBookmarksImageIdKey;
        for (let i = 0; i < activeBookmarkIdContainers.length; i += 1) {
          if (Object.keys(items[activeBookmarkIdContainers[i]]).length < constants.bookmarkImageIdContainerSize) {
            validBookmarksImageIdKey = activeBookmarkIdContainers[i];
            break;
          }
        }

        Object.assign(items[validBookmarksImageIdKey], { [imageId]: validBookmarksKey.substring(9) });

        chrome.storage.sync.get(validBookmarksKey, items3 => {
          const bookmarksObject = items3[validBookmarksKey];
          bookmarksObject[imageId] = imageDetail;
          bookmarksLength[validBookmarksKey] += 1;
          chrome.storage.sync.set(
            {
              [validBookmarksKey]: bookmarksObject,
              [validBookmarksImageIdKey]: items[validBookmarksImageIdKey],
              bookmarksLength,
            },
            () => {
              e.target.classList.remove('bookmark-regular');
              e.target.classList.add('bookmark-solid');
              e.target.title = 'Remove Bookmark';
              showNotification('Image Bookmarked', 'positive', 'snackbar-bookmarks');
            },
          );
        });
      });
    } else {
      const bookmarkContainerNo = allBookmarksImageIdsObject[imageId][0];
      const bookmarkImageIdContainerNo = allBookmarksImageIdsObject[imageId][1];
      const bookmarkContainerName = `bookmarks${bookmarkContainerNo}`;
      const bookmarkImageIdContainerName = `bookmarksImageIds${bookmarkImageIdContainerNo}`;
      // delete bookmarksObject[imageId];
      chrome.storage.sync.get([bookmarkContainerName, bookmarkImageIdContainerName, 'bookmarksLength'], items4 => {
        const bookmarkContainer = items4[bookmarkContainerName];
        const bookmarkImageIdContainer = items4[bookmarkImageIdContainerName];
        delete bookmarkContainer[imageId];
        delete bookmarkImageIdContainer[imageId];
        const updatedBookmarksLength = items4.bookmarksLength;
        updatedBookmarksLength[bookmarkContainerName] -= 1;
        chrome.storage.sync.set(
          {
            [bookmarkContainerName]: bookmarkContainer,
            [bookmarkImageIdContainerName]: bookmarkImageIdContainer,
            bookmarksLength: updatedBookmarksLength,
          },
          () => {
            e.target.classList.remove('bookmark-solid');
            e.target.classList.add('bookmark-regular');
            e.target.title = 'Bookmark Image';
            showNotification('Bookmark removed', 'positive', 'snackbar-bookmarks');
          },
        );
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
  removeLoaderAnimation();
  addLoadMoreButton(elements.loadMoreBookmarkButtonkWrapper);
}

function addBookmarkThumbnailsToDOM(bookmarksObject, bookmarkImageIds) {
  bookmarkImageIds.forEach(imageId => {
    const res = bookmarksObject[imageId];
    const fragment = document.createDocumentFragment();

    const { thumbnail, license } = res;
    const licenseArray = license.split('-'); // split license in individual characteristics

    // make an image element
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', thumbnail);
    imgElement.setAttribute('class', 'image-thumbnail');
    imgElement.setAttribute('id', imageId);

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
      const lowerCaseName = `${name}`.toLowerCase();
      licenseIconElement = document.createElement('i');
      // for pdm, the logo name is cc-pd
      if (lowerCaseName === 'pdm') licenseIconElement.classList.add('icon', 'has-background-white', 'cc-pd');
      else licenseIconElement.classList.add('icon', 'has-background-white', `cc-${lowerCaseName}`);
      licenseIconElementsArray.push(licenseIconElement);
    });

    licenseIconElementsArray.forEach(licenseIcon => {
      licenseDiv.appendChild(licenseIcon);
    });

    // make a div element to encapsulate image element
    const divElement = document.createElement('div');
    divElement.classList.add('image', 'is-compact');
    divElement.id = `id_${imageId}`; // used for searching image div element

    divElement.setAttribute('data-image-id', imageId);

    // adding event listener to open popup.
    divElement.addEventListener('click', openInfoPopup);
    divElement.appendChild(imgElement);
    // divElement.appendChild(selectCheckboxElement);
    divElement.appendChild(licenseDiv);

    // div to act as grid itemj
    const gridItemDiv = document.createElement('div');
    gridItemDiv.setAttribute('class', 'grid-item');

    gridItemDiv.appendChild(divElement);

    fragment.appendChild(gridItemDiv);

    removeSpinner(elements.spinnerPlaceholderBookmarks);
    appendToGrid(msnry, fragment, gridItemDiv, elements.gridBookmarks);

    // selectedBookmarks = 0;
  });
}

export function loadBookmarkImages(numberOfImages) {
  chrome.storage.sync.get(activeBookmarkIdContainers, items => {
    let bookmarksImageIdsObject = {};
    activeBookmarkIdContainers.forEach(bookmarkIdContainerName => {
      bookmarksImageIdsObject = { ...bookmarksImageIdsObject, ...items[bookmarkIdContainerName] };
    });

    const bookmarkImageIds = Object.keys(bookmarksImageIdsObject).slice(
      window.appObject.bookmarksSectionIdx,
      window.appObject.bookmarksSectionIdx + numberOfImages,
    );
    window.appObject.bookmarksSectionIdx += numberOfImages;
    if (bookmarkImageIds.length > 0) {
      removeNode('bookmarks__initial-info');
    } else {
      removeSpinner(elements.spinnerPlaceholderBookmarks);
      removeLoadMoreButton(elements.loadMoreBookmarkButtonkWrapper);
      restoreInitialContent('bookmarks');
    }
    const segBookmarkIds = {}; // object used to segregate bookmark ids
    // segregate the bookmark image ids into respective container numbers
    for (let i = 0; i < bookmarkImageIds.length; i += 1) {
      const num = bookmarksImageIdsObject[bookmarkImageIds[i]];
      if (!Object.prototype.hasOwnProperty.call(segBookmarkIds, num)) {
        segBookmarkIds[num] = [];
      }
      segBookmarkIds[num].push(bookmarkImageIds[i]);
    }
    // this will contain only the bookmark data which will be rendered
    const bookmarkObject = {};
    // all the required bookmark containers that are to be fetched from the storage
    const requiredBookmarkContainer = Object.keys(segBookmarkIds).map(item => `bookmarks${item}`);
    // filling up bookmarkObject
    chrome.storage.sync.get(requiredBookmarkContainer, items2 => {
      for (let i = 0; i < requiredBookmarkContainer.length; i += 1) {
        const containerNum = requiredBookmarkContainer[i].substring(9);
        for (let j = 0; j < segBookmarkIds[containerNum].length; j += 1) {
          bookmarkObject[segBookmarkIds[containerNum][j]] =
            items2[requiredBookmarkContainer[i]][segBookmarkIds[containerNum][j]];
        }
      }
      // console.log(bookmarkObject);
      addBookmarkThumbnailsToDOM(bookmarkObject, bookmarkImageIds);
    });
  });
}

// EventListeners
document.addEventListener('DOMContentLoaded', () => {
  elements.navBookmarksLink.addEventListener('click', () => {
    if (window.appObject.activeSection !== 'bookmarks') {
      // visually marking bookmarks link as active
      removeActiveClassFromNavLinks();
      elements.navBookmarksLink.classList.add('active');

      window.appObject.activeSection = 'bookmarks';
      window.appObject.bookmarksSectionIdx = 0;
      // elements.homeIcon.style.pointerEvents = 'none';
      // setTimeout(() => {
      //   elements.homeIcon.style.pointerEvents = 'auto';
      // }, 300);
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
      loadBookmarkImages(10);

      chrome.storage.sync.get(null, it => {
        console.log(it);
      });
      chrome.storage.sync.getBytesInUse(null, it => {
        console.log(it); // storage bytes usage
      });
    }
  });

  elements.headerLogo.addEventListener('click', () => {
    if (window.appObject.activeSection !== 'search') {
      removeActiveClassFromNavLinks();

      window.appObject.activeSection = 'search';
      // elements.navBookmarksLink.style.pointerEvents = 'none';
      // setTimeout(() => {
      //   elements.navBookmarksLink.style.pointerEvents = 'auto';
      // }, 300);
      // show the bookmarks section and hide other ones
      elements.primarySection.style.display = 'block';
      elements.bookmarksSection.style.display = 'none';
      elements.collectionsSection.style.display = 'none';
      // prepare the search section
      removeLoadMoreButton(elements.loadMoreSearchButtonWrapper);
      removeBookmarkImages();
      if (window.appObject.searchByCollectionActivated === true && window.appObject.searchingNewCollection === true) {
        removeNode('no-image-found-mes');
        removeOldSearchResults();
        window.appObject.searchingNewCollection = false;
      } else {
        removeNode('no-image-found-mes');
        restoreInitialContent('primary');
        // elements.clearSearchButton[0].classList.add('display-none');
      }
    }
  });

  elements.navSourcesLink.addEventListener('click', () => {
    // console.log('collections clicked');
    if (window.appObject.activeSection !== 'collections') {
      // visually marking sources link as active
      removeActiveClassFromNavLinks();
      elements.navSourcesLink.classList.add('active');

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
      removeChildNodes(elements.collectionsSection.getElementsByTagName('table')[0]);
      loadCollections();
    }
  });

  elements.closeEditViewLink.addEventListener('click', event => {
    // using querySelectorAll instead of getElementsByClassName because we do not want live nodelist
    const selectedImages = elements.gridBookmarks.querySelectorAll('.is-selected');
    for (let i = 0; i < selectedImages.length; i += 1) {
      selectedImages[i].classList.remove('is-selected');
    }
    window.appObject.bookmarksEditViewEnabled = false;
    toggleEditView(event);
  });

  elements.editBookmarksLink.addEventListener('click', event => {
    window.appObject.bookmarksEditViewEnabled = true;
    toggleEditView(event);
  });

  elements.deleteBookmarksLink.addEventListener('click', () => {
    // const bookmarkDOMArray = Object.values(bookmarkDOM);
    const images = elements.gridBookmarks.getElementsByClassName('image');
    // to store the id's of deleted bookmarks
    const deletedBookmarks = [];
    for (let i = 0; i < images.length; i += 1) {
      const image = images[i];
      if (image.classList.contains('is-selected')) {
        const { imageId } = image.dataset;
        delete bookmarkDOM[imageId]; // remove the selected bookmark from bookmarkDOM object
        deletedBookmarks.push(imageId);
      }
    }
    if (deletedBookmarks.length === 0) {
      showNotification('No bookmark selected', 'negative', 'snackbar-bookmarks');
    } else {
      chrome.storage.sync.get(keyNames, items => {
        const allBookmarksImageIdsObject = {};
        activeBookmarkIdContainers.forEach(bookmarksImageIdContainerName => {
          const bookmarksImageIdContainer = items[bookmarksImageIdContainerName];
          Object.keys(bookmarksImageIdContainer).forEach(id => {
            // 0th idx -> bookmark container number, 1st idx -> bookmark image id container number
            allBookmarksImageIdsObject[id] = [
              bookmarksImageIdContainer[id],
              bookmarksImageIdContainerName.substring(17),
            ];
          });
        });
        deletedBookmarks.forEach(imageId => {
          const bookmarkContainerNo = allBookmarksImageIdsObject[imageId][0];
          const bookmarkImageIdContainerNo = allBookmarksImageIdsObject[imageId][1];
          const bookmarkContainerName = `bookmarks${bookmarkContainerNo}`;
          const bookmarkImageIdContainerName = `bookmarksImageIds${bookmarkImageIdContainerNo}`;
          // const bookmarkContainer = items4[bookmarkContainerName];
          // const bookmarkImageIdContainer = items4[bookmarkImageIdContainerName];
          delete items[bookmarkContainerName][imageId];
          delete items[bookmarkImageIdContainerName][imageId];
          // const updatedbookmarksLength = items4.bookmarksLength;
          items.bookmarksLength[bookmarkContainerName] -= 1;
        });

        chrome.storage.sync.set(items, () => {
          // removing the selected bookmarks from the grid
          deletedBookmarks.forEach(bookmarkdId => {
            const imageDiv = document.getElementById(`id_${bookmarkdId}`);
            imageDiv.parentElement.removeChild(imageDiv);
          });
          window.appObject.bookmarksSectionIdx -= deletedBookmarks.length;
          loadBookmarkImages(deletedBookmarks.length);
          // reorganizing the layout using masonry
          msnry.layout();
          // confirm user action
          showNotification('Bookmarks successfully removed', 'positive', 'snackbar-bookmarks');
          // Read default "Select all"
          // elements.buttonSelectAllCheckbox[0].innerText = 'Select All';
          // selectedBookmarks = 0;
        });
      });
    }
  });

  elements.selectAllBookmarksLink.addEventListener('click', () => {
    // Stores data of Checkboxes for exporting
    // const bookmarkDOMArray = Object.values(bookmarkDOM);
    const images = elements.gridBookmarks.getElementsByClassName('image');

    for (let i = 0; i < images.length; i += 1) {
      images[i].classList.add('is-selected');
    }
  });

  // change export and import accordingly
  elements.exportBookmarksButton.addEventListener('click', () => {
    let bookmarksObject = {};

    chrome.storage.sync.get(activeBookmarkContainers, items => {
      activeBookmarkContainers.forEach(containerName => {
        bookmarksObject = { ...bookmarksObject, ...items[containerName] };
      });
      if (Object.keys(bookmarksObject).length) {
        const bookmarksString = JSON.stringify(bookmarksObject);
        download(bookmarksString, 'bookmarks.json', 'text/plain');
        showNotification('Exported all bookmarks', 'positive', 'snackbar-bookmarks');
      } else {
        showNotification('No bookmarks available to export', 'negative', 'snackbar-bookmarks');
      }
    });
  });
});
