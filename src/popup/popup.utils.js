import { constants } from './base';

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
  bookmarks10: 0,
  bookmarks11: 0,
  bookmarks12: 0,
  bookmarks13: 0,
  bookmarks14: 0,
  bookmarks15: 0,
};

export default function migrateStorage() {
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
    bookmarks10: {},
    bookmarks11: {},
    bookmarks12: {},
    bookmarks13: {},
    bookmarks14: {},
    bookmarks15: {},
    bookmarksLength: bookmarkKeyLengths,
    bookmarksImageIds0: {},
    bookmarksImageIds1: {},
    bookmarksImageIds2: {},
    bookmarksImageIds3: {},
    bookmarksImageIds4: {},
    bookmarksImageIds5: {},
  };

  chrome.storage.sync.get('migrationFlag2', items => {
    if (!items.migrationFlag2) {
      chrome.storage.sync.set(newStorageSchema, () => {
        chrome.storage.sync.get('bookmarks', items2 => {
          if (items2.bookmarks) {
            const bookmarkIds = Object.keys(items2.bookmarks);
            console.log('starting migration');
            console.log(bookmarkIds);

            let bookmarkContainerName = 'bookmarks0';
            const bookmarkImageIds = {};
            const bookmarksObject0 = {};
            const bookmarksObject1 = {};

            for (let i = 0; i < bookmarkIds.length; i += 1) {
              console.log('inside the loop');
              if (i < constants.bookmarkContainerSize) {
                bookmarksObject0[bookmarkIds[i]] = items2.bookmarks[bookmarkIds[i]];
              } else {
                bookmarkContainerName = 'bookmarks1';
                bookmarksObject1[bookmarkIds[i]] = items2.bookmarks[bookmarkIds[i]];
              }
              bookmarkImageIds[bookmarkIds[i]] = bookmarkContainerName.substring(9);
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
            chrome.storage.sync.remove('bookmarks');
          }
          chrome.storage.sync.set({ migrationFlag2: true });
        });
      });
    }
  });
}
