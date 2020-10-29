/**
 * @desc Checks if the sync storage has the correct structure for the working of bookmarks section
 * and related workflows. If not, then updates the storage.
 */
function confirmBookmarkSchema() {
  /* There are 3 main parts:
  1. Bookmark "Containers" (bookmarks0, bookmark1, ...):
  These objects holds the least minimum image data required for the working of the bookmarks
  section and related workflows. <image-id: {license, thumbnail}>

  2. Bookmark Id Containers (bookmarksImageIds0, bookmarksImageIds1, ...):
  These objects holds the <image-id: container-no> key-value pairs. They come in handy in many bookmark
  related workflows like bookmarking/unbookmarking, deleting bookmarks, importing bookmarks.

  3. BookmarksLength:
  This object contains the size of the bookmark containers. Just like bookmark-id containers, this object
  also helps in many workflows.

  The size limits are defined in the appConfig object in 'base.js'.

  Some extra containers are also included. This let's us to easily scale up/down by tweaking the
  appConfig and not worrying about pushing migration code(related to this feature) in updates.
   */
  chrome.storage.sync.get({ bookmarksLength: false }, items => {
    if (!items.bookmarksLength) {
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

      const bookmarksSchema = {
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

      chrome.storage.sync.set(bookmarksSchema, () => {
        console.log('bookmarks schema set');
      });
    }
  });
}

/**
 * @desc Checks if the sync storage has the correct structure for the working of filters section
 * and related workflows like setting "default filters" through options page. If not, then
 * updates the storage.
 */
function confirmFilterSchema() {
  /* Conceptually, the structure for this is straightforward. All the options for a particular filter
  are encapsulated in a single object.
  */
  chrome.storage.sync.get({ filterMigration: false }, items => {
    if (!items.filterMigration) {
      const aspectRatioFilter = {
        tall: false,
        wide: false,
        square: false,
      };

      const imageSizeFilter = {
        small: false,
        medium: false,
        large: false,
      };

      const imageTypeFilter = {
        photograph: false,
        illustration: false,
        digitized_artwork: false,
      };

      const fileTypeFilter = {
        jpeg: false,
        png: false,
        gif: false,
        svg: false,
      };

      const licenseFilter = {
        CC0: false,
        PDM: false,
        BY: false,
        'BY-SA': false,
        'BY-NC': false,
        'BY-ND': false,
        'BY-NC-SA': false,
        'BY-NC-ND': false,
      };

      const useCaseFilter = {
        commercial: false,
        modification: false,
      };

      const showMatureContentFilter = {
        mature: false,
      };

      const sourceFilter = {};

      chrome.storage.sync.set(
        {
          useCaseFilter,
          licenseFilter,
          imageTypeFilter,
          fileTypeFilter,
          aspectRatioFilter,
          imageSizeFilter,
          sourceFilter,
          showMatureContentFilter,
          filterMigration: true,
        },
        () => {
          console.log('filter migration done');
        },
      );
    }
  });
}

/*
Various sections of the extension interacts with the sync storage. These interactions happens along with
certain assumptions about the schema of the storage. Therefore, for the extension to work correctly,
the sync storage is checked and updated if necessary(usually after fresh install).

The structure of the storage has grown to be the way it is now after several iterations, primarily to deal
with tight rate and storage limits on sync storage that browsers imposes.
As a consequence of this, the sync storage has become more organized, extensible, and robust.
*/
export default function checkSyncStorageSchema() {
  confirmBookmarkSchema();
  confirmFilterSchema();
}
