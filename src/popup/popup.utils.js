import { elements } from './base';
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

export function setBookmarksStorageSchema() {
  const bookmarkKeyNames = [
    'bookmarks0',
    'bookmarks1',
    'bookmarks2',
    'bookmarks3',
    'bookmarks4',
    'bookmarks5',
    'bookmarks6',
    'bookmarks7',
    'bookmarks8',
    'bookmarks9',
  ];

  bookmarkKeyNames.forEach(key => {
    chrome.storage.sync.set({ [key]: {} });
  });

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

  chrome.storage.sync.set({ bookmarksLength: bookmarkKeyLengths });

  chrome.storage.sync.get('bookmarksLength', items => {
    console.log(Object.keys(items.bookmarksLength));
    console.log(items.bookmarksLength.bookmarks3);
  });
}
