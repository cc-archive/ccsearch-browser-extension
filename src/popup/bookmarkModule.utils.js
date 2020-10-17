import { elements, constants } from './base';
import { removeChildNodes, activeBookmarkIdContainers, activeBookmarkContainers, showNotification } from '../utils';

const Masonry = require('masonry-layout');

export const bookmarksGridMasonryObject = new Masonry(elements.gridBookmarks, {
  // options
  itemSelector: '.grid-item',
  columnWidth: '.grid-item',
  gutter: '.gutter-sizer',
  percentPosition: true,
  transitionDuration: '0',
});

export function removeBookmarkImages() {
  const div = document.createElement('div');
  div.classList.add('gutter-sizer');
  removeChildNodes(elements.gridBookmarks);
  elements.gridBookmarks.appendChild(div);
}

export function removeActiveClassFromNavLinks() {
  elements.navBookmarksLink.classList.remove('active');
  elements.navSourcesLink.classList.remove('active');
  elements.navSettingsLink.classList.remove('active');
}

/**
 * @desc extracts image data(thumbnail and license) from the HTML5 data attributes of the provided element.
 * @param {HTMLElement} element
 * @returns {Object}
 */
function getImageData(element) {
  return {
    thumbnail: element.dataset.imageThumbnail,
    license: element.dataset.imageLicense,
  };
}

/**
 * @callback toggleBookmark
 * @desc A callback function that is triggered when bookmark-icon of an image is clicked. If the image is
 * not already bookmarked, then it's information is stored in sync storage. In opposite case, the information
 * is removed. Also, visual cues are triggered (changing the bookmark icon and showing notification).
 * @param {Object} event
 */
export function toggleBookmark(event) {
  const bookmarkIcon = event.target;

  chrome.storage.sync.get(activeBookmarkIdContainers, items => {
    // for storing <image-id, [bookmark container no., bookmark image-id container no.]>
    // for all the bookmarked images in the sync storage
    const allImageIds = {};
    Object.entries(items).forEach(entry => {
      const bookmarkIdContainer = entry[1];
      const bookmarkIdContainerNo = entry[0].substring(17);

      Object.keys(bookmarkIdContainer).forEach(id => {
        // 0th idx -> bookmark container no., 1st idx -> bookmark image-id container no.
        allImageIds[id] = [bookmarkIdContainer[id], bookmarkIdContainerNo];
      });
    });

    // image id of the target image(the image whose bookmark icon the user has clicked).
    const { imageId } = bookmarkIcon.dataset;

    // if the target image is not already bookmarked, we are going to bookmark it.
    if (Object.keys(allImageIds).indexOf(imageId) === -1) {
      const imageData = getImageData(bookmarkIcon);

      chrome.storage.sync.get('bookmarksLength', items2 => {
        const { bookmarksLength } = items2;
        let validBookmarkContainer = null;

        // finding the first bookmark container which has space for one more bookmark.
        activeBookmarkContainers.every(bookmarkContainer => {
          if (bookmarksLength[bookmarkContainer] < constants.bookmarkContainerSize) {
            validBookmarkContainer = bookmarkContainer;
            return false; // analogous to breaking out of loop.
          }
          return true;
        });

        if (!validBookmarkContainer) {
          showNotification('Error: Bookmarks Limit reached', 'negative', 'notification--extension-popup');
          throw new Error('Bookmarks Limit reached');
        }

        let validBookmarkIdContainer = null;
        // finding the first bookmark id container which has space for one more bookmark.
        activeBookmarkIdContainers.every(bookmarkIdContainer => {
          if (Object.keys(items[bookmarkIdContainer]).length < constants.bookmarkImageIdContainerSize) {
            validBookmarkIdContainer = bookmarkIdContainer;
            return false;
          }
          return true;
        });

        chrome.storage.sync.get(validBookmarkContainer, items3 => {
          // updating the appropriate containers to reflect the addition of a new bookmark.
          const bookmarksObject = items3[validBookmarkContainer];
          bookmarksObject[imageId] = imageData;
          bookmarksLength[validBookmarkContainer] += 1;
          Object.assign(items[validBookmarkIdContainer], { [imageId]: validBookmarkContainer.substring(9) });

          // writing the changes to the sync storage.
          chrome.storage.sync.set(
            {
              [validBookmarkContainer]: bookmarksObject,
              [validBookmarkIdContainer]: items[validBookmarkIdContainer],
              bookmarksLength,
            },
            () => {
              bookmarkIcon.classList.remove('bookmark-regular');
              bookmarkIcon.classList.add('bookmark-solid');
              bookmarkIcon.title = 'Remove Bookmark';
              showNotification('Image Bookmarked', 'positive', 'notification--extension-popup');
            },
          );
        });
      });
    }
    // if the target image is already bookmarked, we are going to remove it.
    else {
      const bookmarkContainerName = `bookmarks${allImageIds[imageId][0]}`;
      const bookmarkIdContainerName = `bookmarksImageIds${allImageIds[imageId][1]}`;

      chrome.storage.sync.get([bookmarkContainerName, bookmarkIdContainerName, 'bookmarksLength'], items4 => {
        // delete the information about the bookmark from containers
        const bookmarkContainer = items4[bookmarkContainerName];
        const bookmarkIdContainer = items4[bookmarkIdContainerName];
        delete bookmarkContainer[imageId];
        delete bookmarkIdContainer[imageId];
        const updatedBookmarksLength = items4.bookmarksLength;
        updatedBookmarksLength[bookmarkContainerName] -= 1;

        // writing the changes to sync storage
        chrome.storage.sync.set(
          {
            [bookmarkContainerName]: bookmarkContainer,
            [bookmarkIdContainerName]: bookmarkIdContainer,
            bookmarksLength: updatedBookmarksLength,
          },
          () => {
            bookmarkIcon.classList.remove('bookmark-solid');
            bookmarkIcon.classList.add('bookmark-regular');
            bookmarkIcon.title = 'Bookmark Image';
            showNotification('Bookmark removed', 'positive', 'notification--extension-popup');
          },
        );
      });
    }
  });
}
