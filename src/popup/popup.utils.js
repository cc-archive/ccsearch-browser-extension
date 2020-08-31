export default function generateNewStorageSchemaForFilters() {
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
          console.log('done');
        },
      );

      chrome.storage.sync.remove(
        [
          'commercial',
          'lol',
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
          console.log('deleted');
        },
      );
    }
  });
}
