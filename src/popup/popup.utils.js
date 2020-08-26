export default function generateNewStorageSchemaForFilters() {
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
    },
    () => {
      console.log('done');
    },
  );
}
