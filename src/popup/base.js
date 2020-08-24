export const elements = {
  /* ------header------ */
  header: document.getElementsByTagName('header')[0],
  headerLogo: document.getElementById('header-logo'),
  // nav links
  navBookmarksLink: document.getElementById('nav-bookmarks-link'),
  navSourcesLink: document.getElementById('nav-sources-link'),
  navSettingsLink: document.getElementById('nav-settings-link'),
  navInvertColorsIcon: document.getElementById('nav-invert_colors-icon'),

  /* ------primary section------ */
  sectionMain: document.getElementsByClassName('section-main')[0],
  primarySection: document.querySelector('.section-primary'),
  // search section
  searchSection: document.getElementsByClassName('section-search')[0],
  inputField: document.getElementById('section-search-input'),
  searchButton: document.getElementById('search-button'),
  filterButton: document.getElementById('filter-button'),
  // image gallery
  gridPrimary: document.querySelector('.grid-primary'),
  loadMoreSearchButton: document.querySelector('.load-more-search-button'),
  loadMoreSearchButtonWrapper: document.querySelector('.load-more-search-button-wrapper'),
  spinnerPlaceholderPrimary: document.getElementById('spinner-placeholder--primary'),

  /* ------filters section------ */
  filterSection: document.querySelector('.section-filter'),
  closeFiltersLink: document.getElementById('close-filters-link'),
  // different filters
  useCaseCheckboxesWrapper: document.getElementsByClassName('section-filter__usecase')[0],
  licenseCheckboxesWrapper: document.getElementsByClassName('section-filter__license')[0],
  sourceCheckboxesWrapper: document.getElementsByClassName('section-filter__source')[0],
  fileTypeCheckboxesWrapper: document.getElementsByClassName('section-filter__file-type')[0],
  imageTypeCheckboxesWrapper: document.getElementsByClassName('section-filter__image-type')[0],
  imageSizeCheckboxesWrapper: document.getElementsByClassName('section-filter__image-size')[0],
  aspectRatioCheckboxesWrapper: document.getElementsByClassName('section-filter__aspect-ratio')[0],
  showMatureContentCheckboxWrapper: document.getElementsByClassName('section-filter__show-mature-content')[0],
  // footer buttons
  clearFiltersButton: document.getElementById('clear-filters-button'),
  applyFiltersButton: document.getElementById('apply-filters-button'),

  /* ------bookmarks section------ */
  bookmarksSection: document.querySelector('.section-bookmarks'),
  // head links
  bookmarksSectionHead: document.getElementsByClassName('section-bookmarks__head')[0],
  editBookmarksLink: document.getElementById('edit-bookmarks'),
  selectAllBookmarksLink: document.getElementById('select-all-bookmarks'),
  closeEditViewLink: document.getElementById('close-edit-view'),
  // image gallery
  bookmarksSectionContent: document.getElementsByClassName('section-content--bookmarks')[0],
  gridBookmarks: document.querySelector('.grid-bookmarks'),
  loadMoreBookmarkButton: document.querySelector('.load-more-bookmark-button'),
  loadMoreBookmarkButtonkWrapper: document.querySelector('.load-more-bookmark-button-wrapper'),
  spinnerPlaceholderBookmarks: document.getElementById('spinner-placeholder--bookmarks'),
  // footer
  bookmarksSectionFooter: document.getElementsByClassName('section-bookmarks__footer')[0],
  deleteBookmarksButton: document.getElementById('delete-bookmarks'),
  exportBookmarksLink: document.getElementById('export-bookmarks'),

  /* ------collections section------ */
  spinnerPlaceholderCollections: document.getElementById('spinner-placeholder--collections'),
  collectionsSection: document.querySelector('.section-collections'),
  collectionsSectionBody: document.querySelector('.section-collections--body'),
  // clearSearchButton: document.getElementsByClassName('clear-search-button'),

  /* ------image-detail section------ */
  imageDetailSection: document.getElementsByClassName('section-image-detail')[0],
  imageDetailNav: document.getElementsByClassName('image-detail__nav')[0],
  closeImageDetailLink: document.getElementById('close-image-detail'),
  reuseTab: document.getElementsByClassName('reuse-tab')[0],
  imageDetailTabsPanels: document.querySelectorAll('.section-image-detail > .tabs-content > .tabs-panel'),
  reusePanel: document.getElementsByClassName('reuse-panel')[0],
  // common head buttons
  downloadImageAttributionButton: document.getElementsByClassName('download-image-attribution'),
  imageExternalLink: document.getElementById('image-external-link'),
  // reuse tab
  attributionTab: document.getElementsByClassName('attribution-tab')[0],
  richTextAttributionPara: document.getElementById('rich-text-attribution'),
  htmlAttributionTextArea: document.getElementById('html-attribution'),
  plainTextAttributionPara: document.getElementById('plain-text-attribution'),
  licenseLink: document.getElementById('license-link'),
  licenseDescriptionDiv: document.getElementsByClassName('license-description')[0],
  licenseLinkCaption: document.getElementById('license-link--caption'),
  imageTagsDiv: document.getElementsByClassName('image-tags')[0],
  // information tab
  imageDimensionPara: document.getElementById('image-dimension'),
  imageSourcePara: document.getElementById('image-source'),
  imageLicensePara: document.getElementById('image-license'),
  // share tab
  facebookShareButton: document.querySelector('#facebook-share'),
  twitterShareButton: document.querySelector('#twitter-share'),
  pinterestShareButton: document.querySelector('#pinterest-share'),
  tumblrShareButton: document.querySelector('#tumblr-share'),
  // related images
  gridRelatedImages: document.querySelector('.grid-related-images'),

  /* ------Misc------ */
  buttonBackToTop: document.getElementsByClassName('button-backToTop')[0],
};

export const constants = {
  bookmarkContainerSize: 30,
  bookmarkImageIdContainerSize: 80,
  extensionBookmarkLimit: 300,
};

export function initGlobalObject() {
  window.appObject = {}; // global object to store the application variables
  window.appObject.inputText = '';
  window.appObject.pageNo = 1;
  window.appObject.bookmarksSectionIdx = 0;
  window.appObject.enableMatureContent = false;

  // List to hold  selected by the user from the drop down.
  window.appObject.userSelectedSourcesList = [];

  // List to hold user selected licenses
  window.appObject.userSelectedLicensesList = [];

  // List to hold user selected use case
  window.appObject.userSelectedUseCaseList = [];

  window.appObject.userSelectedImageTypeList = [];
  window.appObject.userSelectedImageSizeList = [];
  window.appObject.userSelectedFileTypeList = [];
  window.appObject.userSelectedAspectRatioList = [];
  // object to map source display names to valid query names.
  window.appObject.sourceAPIQueryStrings = {};

  // Search Storage
  window.appObject.storeSearch = {};

  // store the name of the current active section
  window.appObject.activeSection = 'search';
  window.appObject.activeSearchContext = 'normal'; // possible values -> normal, collection, tag
  window.appObject.collectionName = '';

  window.appObject.bookmarksEditViewEnabled = false;
}
