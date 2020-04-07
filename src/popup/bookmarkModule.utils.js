import { elements } from './base';
import { showNotification, removeChildNodes, restoreInitialContent } from '../utils';

const Masonry = require('masonry-layout');

export const msnry = new Masonry(elements.gridBookmarks, {
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
        showNotification('Bookmark removed', 'negative', 'snackbar-bookmarks');
      });
    }
  });
}

export function removeBookmark(e) {
  const imageId = e.target.dataset.imageid;
  chrome.storage.sync.get({ bookmarks: [] }, items => {
    const bookmarksArray = items.bookmarks;

    const bookmarkIndex = bookmarksArray.indexOf(imageId);
    bookmarksArray.splice(bookmarkIndex, 1);

    let isLastImage = false;
    if (bookmarksArray.length === 0) {
      isLastImage = true;
    }

    chrome.storage.sync.set({ bookmarks: bookmarksArray }, () => {
      const imageDiv = document.getElementById(`id_${imageId}`);
      imageDiv.parentElement.removeChild(imageDiv);
      // eslint-disable-next-line no-use-before-define
      msnry.layout(); // layout grid again
      showNotification('Bookmark removed', 'positive', 'snackbar-bookmarks');

      if (isLastImage) {
        restoreInitialContent('bookmarks');
      }
    });
  });
}
