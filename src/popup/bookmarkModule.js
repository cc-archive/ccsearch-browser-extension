import { elements, appObject, bookmarksGridMasonryObject, primaryGridMasonryObject } from './base';
import { removeActiveClassFromNavLinks } from './bookmarkModule.utils';
import { removeLoadMoreButton, removeImagesFromGrid } from './helper';
import { addSpinner, removeSpinner } from './spinner';
import {
  showNotification,
  keyNames,
  activeBookmarkContainers,
  activeBookmarkIdContainers,
  checkInternetConnection,
} from '../utils';
import loadCollections from './collectionModule';
import { addImagesToDOM, toggleEditView } from './localUtils';

const download = require('downloadjs');

/**
 * @desc Segregates and prepares the data of the images that needs to be loaded in the bookmarks
 * section and then calls "addImagesToDOM".
 * @param {number} numberOfImages - the number of images that we want to load at once.
 */
export default function loadBookmarkImages(numberOfImages) {
  chrome.storage.sync.get(activeBookmarkIdContainers, items => {
    // for storing <image-ids, bookmark container number> of all bookmarks
    let allImageIds = {};
    activeBookmarkIdContainers.forEach(bookmarkIdContainerName => {
      allImageIds = { ...allImageIds, ...items[bookmarkIdContainerName] };
    });

    // stores the image-ids of required bookmarks(only those bookmarks that we need
    // to load onto the DOM)
    const bookmarkImageIds = Object.keys(allImageIds).slice(
      appObject.bookmarksSectionIdx,
      appObject.bookmarksSectionIdx + numberOfImages,
    );

    // increment the starting point for next bunch of images
    appObject.bookmarksSectionIdx += numberOfImages;

    if (bookmarkImageIds.length === 0) {
      removeLoadMoreButton(elements.loadMoreBookmarkButtonkWrapper);
    } else {
      // for storing <bookmark container number, image ids> of the required bookmarks
      const segBookmarkIds = {};

      // segregate the bookmark image ids into respective container numbers
      for (let i = 0; i < bookmarkImageIds.length; i += 1) {
        const containerNum = allImageIds[bookmarkImageIds[i]];
        if (!Object.prototype.hasOwnProperty.call(segBookmarkIds, containerNum)) {
          segBookmarkIds[containerNum] = [];
        }
        segBookmarkIds[containerNum].push(bookmarkImageIds[i]);
      }

      // the bookmark containers that are to be fetched from the sync storage
      const requiredBookmarkContainer = Object.keys(segBookmarkIds).map(containerNum => `bookmarks${containerNum}`);

      chrome.storage.sync.get(requiredBookmarkContainer, items2 => {
        // for storing the "image object". A single object will have the data that is needed
        // to create an image-component (image-id, license, thumbnail-url)
        const imageObjects = [];

        // fill imageObjects
        for (let i = 0; i < requiredBookmarkContainer.length; i += 1) {
          const containerNum = requiredBookmarkContainer[i].substring(9);
          for (let j = 0; j < segBookmarkIds[containerNum].length; j += 1) {
            const imageId = segBookmarkIds[containerNum][j];
            imageObjects.push({
              id: imageId,
              ...items2[requiredBookmarkContainer[i]][segBookmarkIds[containerNum][j]],
            });
          }
        }

        addImagesToDOM(bookmarksGridMasonryObject, imageObjects, elements.gridBookmarks, true);
      });
    }
  });
}

// EventListeners
document.addEventListener('DOMContentLoaded', () => {
  elements.navBookmarksLink.addEventListener('click', () => {
    if (appObject.activeSection !== 'bookmarks') {
      appObject.activeSection = 'bookmarks';
      // visually marking bookmarks link as active
      removeActiveClassFromNavLinks();
      elements.navBookmarksLink.classList.add('active');

      appObject.bookmarksSectionIdx = 0;

      // show the bookmarks section and hide other ones
      elements.primarySection.classList.add('display-none');
      elements.collectionsSection.classList.add('display-none');
      elements.filterSection.classList.add('display-none');
      elements.bookmarksSection.classList.remove('display-none');

      // prepare the bookmarks section
      checkInternetConnection();

      removeSpinner(elements.spinnerPlaceholderPrimary);
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
    if (appObject.activeSection !== 'search') {
      appObject.activeSection = 'search';

      removeActiveClassFromNavLinks();

      // show the primary section and hide other ones
      elements.primarySection.classList.remove('display-none');
      elements.bookmarksSection.classList.add('display-none');
      elements.collectionsSection.classList.add('display-none');
      elements.filterSection.classList.add('display-none');

      // prepare the search section
      primaryGridMasonryObject.layout(); // layout the masonry grid
      removeImagesFromGrid(elements.gridBookmarks);
      removeSpinner(elements.spinnerPlaceholderPrimary);

      if (appObject.searchContext === 'collection' && appObject.searchingNewCollection === true) {
        removeImagesFromGrid(elements.gridPrimary);
        primaryGridMasonryObject.layout();
        appObject.searchingNewCollection = false;
      }
    }
  });

  elements.navSourcesLink.addEventListener('click', () => {
    if (appObject.activeSection !== 'collections') {
      appObject.activeSection = 'collections';

      // visually marking sources link as active
      removeActiveClassFromNavLinks();
      elements.navSourcesLink.classList.add('active');
      elements.buttonBackToTop.click();

      // show the collections section and hide other ones
      elements.primarySection.classList.add('display-none');
      elements.bookmarksSection.classList.add('display-none');
      elements.collectionsSection.classList.remove('display-none');
      elements.filterSection.classList.add('display-none');

      // remove previous spinner. On low net connection, multiple spinner may appear
      // due to delay in result fetching and continous section switching
      removeSpinner(elements.spinnerPlaceholderCollections);
      addSpinner(elements.spinnerPlaceholderCollections, 'original');

      removeImagesFromGrid(elements.gridBookmarks);
      loadCollections();
    }
  });

  elements.closeEditViewLink.addEventListener('click', event => {
    // using querySelectorAll instead of getElementsByClassName because we do not want live nodelist
    const selectedImages = elements.gridBookmarks.querySelectorAll('.is-selected');
    for (let i = 0; i < selectedImages.length; i += 1) {
      selectedImages[i].classList.remove('is-selected');
    }
    appObject.isEditViewEnabled = false;
    toggleEditView(event);
  });

  elements.editBookmarksLink.addEventListener('click', event => {
    appObject.isEditViewEnabled = true;
    toggleEditView(event);
  });

  elements.deleteBookmarksButton.addEventListener('click', () => {
    const images = elements.gridBookmarks.getElementsByClassName('image');
    // to store the id's of deleted bookmarks
    const deletedBookmarks = [];
    for (let i = 0; i < images.length; i += 1) {
      const image = images[i];
      if (image.classList.contains('is-selected')) {
        const { imageId } = image.dataset;
        deletedBookmarks.push(imageId);
      }
    }
    if (deletedBookmarks.length === 0) {
      showNotification('No bookmark selected', 'negative', 'notification--extension-popup');
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
        /* eslint-disable no-param-reassign */
        deletedBookmarks.forEach(imageId => {
          const bookmarkContainerNo = allBookmarksImageIdsObject[imageId][0];
          const bookmarkImageIdContainerNo = allBookmarksImageIdsObject[imageId][1];
          const bookmarkContainerName = `bookmarks${bookmarkContainerNo}`;
          const bookmarkImageIdContainerName = `bookmarksImageIds${bookmarkImageIdContainerNo}`;
          delete items[bookmarkContainerName][imageId];
          delete items[bookmarkImageIdContainerName][imageId];
          items.bookmarksLength[bookmarkContainerName] -= 1;
        });

        chrome.storage.sync.set(items, () => {
          // removing the selected bookmarks from the grid
          deletedBookmarks.forEach(bookmarkdId => {
            const imageDiv = document.getElementById(`id_${bookmarkdId}`);
            imageDiv.parentElement.removeChild(imageDiv);
          });
          appObject.bookmarksSectionIdx -= deletedBookmarks.length;
          loadBookmarkImages(deletedBookmarks.length, appObject.isEditViewEnabled);
          // reorganizing the layout using masonry
          bookmarksGridMasonryObject.layout();
          // confirm user action
          showNotification('Bookmarks successfully removed', 'positive', 'notification--extension-popup');
        });
      });
    }
  });

  elements.selectAllBookmarksLink.addEventListener('click', () => {
    // Stores data of Checkboxes for exporting
    const images = elements.gridBookmarks.getElementsByClassName('image');

    for (let i = 0; i < images.length; i += 1) {
      images[i].classList.add('is-selected');
    }
  });

  // change export and import accordingly
  elements.exportBookmarksLink.addEventListener('click', () => {
    let bookmarksObject = {};

    chrome.storage.sync.get(activeBookmarkContainers, items => {
      activeBookmarkContainers.forEach(containerName => {
        bookmarksObject = { ...bookmarksObject, ...items[containerName] };
      });
      if (Object.keys(bookmarksObject).length) {
        const bookmarksString = JSON.stringify(bookmarksObject);
        download(bookmarksString, 'bookmarks.json', 'text/plain');
        showNotification('Exported all bookmarks', 'positive', 'notification--extension-popup');
      } else {
        showNotification('No bookmarks available to export', 'negative', 'notification--extension-popup');
      }
    });
  });
});
