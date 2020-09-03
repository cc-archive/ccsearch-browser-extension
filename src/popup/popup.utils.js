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

export function confirmBookmarkSchemaInSync() {
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

  chrome.storage.sync.get(['bookmarks0', 'bookmarksLength', 'bookmarksImageIds0'], items => {
    if (!(items.bookmarks0 && items.bookmarksLength && items.bookmarksImageIds0)) {
      chrome.storage.sync.set(bookmarksSchema, () => {
        console.log('bookmarks schema set');
      });
    }
  });
}

export function confirmFilterSchemaInSync() {
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

      chrome.storage.sync.remove(
        [
          'commercial',
          'modification',
          'BY-SA',
          'BY-NC',
          'BY-ND',
          'BY-NC-SA',
          'BY-NC-ND',
          'BY',
          'PDM',
          'CC0',
          'jpeg',
          'png',
          'gif',
          'svg',
          'tall',
          'wide',
          'square',
          'small',
          'medium',
          'large',
          'photograph',
          'illustration',
          'digitized_artwork',
          'enableSearchStorage',
          'enableSearchClearConfirm',
          'enableMatureContent',
          'brooklynmuseum',
          'clevelandmuseum',
          'deviantart',
          'behance',
          'smithsonian',
          'modifiable',
          'digitaltmuseum',
          'europeana',
          'flickr',
          'floraon',
          'geographorguk',
          'mccordmuseum',
          'met',
          'museumsvictoria',
          'nasa',
          'nypl',
          'phylopic',
          'rawpixel',
          'rijksmuseum',
          'sciencemuseum',
          'sketchfab',
          'smithsonian_african_american_history_museum',
          'smithsonian_african_art_museum',
          'smithsonian_air_and_space_museum',
          'smithsonian_american_art_museum',
          'smithsonian_american_history_museum',
          'smithsonian_american_indian_museum',
          'smithsonian_anacostia_museum',
          'smithsonian_cooper_hewitt_museum',
          'smithsonian_freer_gallery_of_art',
          'smithsonian_gardens',
          'smithsonian_hirshhorn_museum',
          'smithsonian_libraries',
          'smithsonian_national_museum_of_natural_history',
          'smithsonian_portrait_gallery',
          'smithsonian_postal_museum',
          'spacex',
          'square',
          'svg',
          'svgsilh',
          'tall',
          'thingiverse',
          'thorvaldsensmuseum',
          'wide',
          'wikimedia',
          'woc_tech',
          'CAPL',
          'WoRMS',
          'animaldiversity',
          'bio_diversity',
        ],
        () => {
          console.log('redundant keys deleted');
        },
      );
    }
  });
}
