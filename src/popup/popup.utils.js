import { elements, constants } from './base';
// eslint-disable-next-line import/no-cycle
import { addSearchThumbnailsToDOM } from './searchModule';

export function loadStoredContentToUI() {
  elements.inputField.value = window.appObject.inputText;
  elements.sourceChooser.value = localStorage.getItem('sourceDropdownValues');
  elements.useCaseChooser.value = localStorage.getItem('usecaseDropdownValues');
  elements.licenseChooser.value = localStorage.getItem('licenseDropdownValues');
  elements.fileTypeChooser.value = localStorage.getItem('fileTypeDropdownValues');
  elements.imageTypeChooser.value = localStorage.getItem('imageTypeDropdownValues');
  elements.imageSizeChooser.value = localStorage.getItem('imageSizeDropdownValues');
  elements.aspectRatioChooser.value = localStorage.getItem('aspectRatioDropdownValues');

  window.appObject.pageNo = 1;
  if (localStorage.getItem(window.appObject.pageNo)) {
    const pageData = Object.values(JSON.parse(localStorage.getItem(window.appObject.pageNo)));
    addSearchThumbnailsToDOM(pageData);
    window.appObject.pageNo = Number(window.appObject.pageNo) + 1;
  }
  elements.clearSearchButton[0].classList.remove('display-none');
}

const bookmarkKeyLengths = {
  bookmarks0: 0,
  bookmarks1: 0,
  bookmarks2: 0,
  bookmarks3: 0,
  bookmarks4: 0,
  bookmarks5: 0,
  bookmarks6: 0,
  bookmarks7: 0,
  bookmarks8: 0,
  bookmarks9: 0,
};

export function migrateStorage() {
  const newStorageSchema = {
    bookmarks0: {},
    bookmarks1: {},
    bookmarks2: {},
    bookmarks3: {},
    bookmarks4: {},
    bookmarks5: {},
    bookmarks6: {},
    bookmarks7: {},
    bookmarks8: {},
    bookmarks9: {},
    bookmarksLength: bookmarkKeyLengths,
    bookmarksImageIds0: {},
    bookmarksImageIds1: {},
    bookmarksImageIds2: {},
    bookmarksImageIds3: {},
  };

  chrome.storage.sync.set(newStorageSchema, () => {
    chrome.storage.sync.get('bookmarks', items => {
      const bookmarkIds = Object.keys(items.bookmarks);
      console.log('starting');
      console.log(bookmarkIds);

      let bookmarkContainerName = 'bookmarks0';
      const bookmarkImageIds = {};
      const bookmarksObject0 = {};
      const bookmarksObject1 = {};

      for (let i = 0; i < bookmarkIds.length; i += 1) {
        if (i < constants.bookmarkContainerSize) {
          bookmarksObject0[bookmarkIds[i]] = items.bookmarks[bookmarkIds[i]];
        } else {
          bookmarkContainerName = 'bookmarks1';
          bookmarksObject1[bookmarkIds[i]] = items.bookmarks[bookmarkIds[i]];
        }
        bookmarkImageIds[bookmarkIds[i]] = bookmarkContainerName.slice(-1);
        bookmarkKeyLengths[bookmarkContainerName] += 1;
      }

      console.log('final');
      console.log(bookmarkImageIds);
      console.log(bookmarksObject0);
      console.log(bookmarksObject1);
      console.log(bookmarkKeyLengths);
      chrome.storage.sync.set({
        bookmarks0: bookmarksObject0,
        bookmarks1: bookmarksObject1,
        bookmarksImageIds0: bookmarkImageIds,
        bookmarksLength: bookmarkKeyLengths,
      });
    });
  });
}
