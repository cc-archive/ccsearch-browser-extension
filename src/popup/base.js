import Masonry from 'masonry-layout';
import ClipboardJS from 'clipboard';

import { showNotification } from '../utils';

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
  sectionMain: document.querySelector('.section-main'),
  primarySection: document.querySelector('.section-primary'),
  // search section
  searchSection: document.querySelector('.section-search'),
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
  tooltipWrappers: document.querySelectorAll('.tooltip-wrapper'),
  closeFiltersLink: document.getElementById('close-filters-link'),
  // different filters
  useCaseCheckboxesWrapper: document.querySelector('.section-filter__usecase'),
  licenseCheckboxesWrapper: document.querySelector('.section-filter__license'),
  sourceCheckboxesWrapper: document.querySelector('.section-filter__source'),
  fileTypeCheckboxesWrapper: document.querySelector('.section-filter__file-type'),
  imageTypeCheckboxesWrapper: document.querySelector('.section-filter__image-type'),
  imageSizeCheckboxesWrapper: document.querySelector('.section-filter__image-size'),
  aspectRatioCheckboxesWrapper: document.querySelector('.section-filter__aspect-ratio'),
  showMatureContentCheckboxWrapper: document.querySelector('.section-filter__show-mature-content'),
  // footer buttons
  clearFiltersButton: document.getElementById('clear-filters-button'),
  applyFiltersButton: document.getElementById('apply-filters-button'),

  /* ------bookmarks section------ */
  bookmarksSection: document.querySelector('.section-bookmarks'),
  // head links
  bookmarksSectionHead: document.querySelector('.section-bookmarks__head'),
  editBookmarksLink: document.getElementById('edit-bookmarks'),
  selectAllBookmarksLink: document.getElementById('select-all-bookmarks'),
  closeEditViewLink: document.getElementById('close-edit-view'),
  // image gallery
  bookmarksSectionContent: document.querySelector('.section-content--bookmarks'),
  gridBookmarks: document.querySelector('.grid-bookmarks'),
  loadMoreBookmarkButton: document.querySelector('.load-more-bookmark-button'),
  loadMoreBookmarkButtonkWrapper: document.querySelector('.load-more-bookmark-button-wrapper'),
  // footer
  bookmarksSectionFooter: document.querySelector('.section-bookmarks__footer'),
  deleteBookmarksButton: document.getElementById('delete-bookmarks'),
  exportBookmarksLink: document.getElementById('export-bookmarks'),

  /* ------collections section------ */
  spinnerPlaceholderCollections: document.getElementById('spinner-placeholder--collections'),
  collectionsSection: document.querySelector('.section-collections'),
  collectionsSectionBody: document.querySelector('.section-collections--body'),
  // clearSearchButton: document.getElementsByClassName('clear-search-button'),

  /* ------image-detail section------ */
  imageDetailSection: document.querySelector('.section-image-detail'),
  imageDetailNav: document.querySelector('.image-detail__nav'),
  closeImageDetailLink: document.getElementById('close-image-detail'),
  reuseTab: document.querySelector('.reuse-tab'),
  imageDetailTabsPanels: document.querySelectorAll('.section-image-detail > .tabs-content > .tabs-panel'),
  reusePanel: document.querySelector('.reuse-panel'),
  // common head buttons
  downloadImageAttributionButton: document.getElementsByClassName('download-image-attribution'),
  imageExternalLink: document.getElementById('image-external-link'),
  // reuse tab
  attributionTab: document.querySelector('.attribution-tab'),
  richTextAttributionPara: document.getElementById('rich-text-attribution'),
  htmlAttributionTextArea: document.getElementById('html-attribution'),
  plainTextAttributionPara: document.getElementById('plain-text-attribution'),
  licenseLink: document.getElementById('license-link'),
  licenseDescriptionDiv: document.querySelector('.license-description'),
  licenseLinkCaption: document.getElementById('license-link--caption'),
  imageTagsDiv: document.querySelector('.image-tags'),
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
  buttonBackToTop: document.querySelector('.button-backToTop'),
};

export const filterCheckboxWrappers = [
  elements.useCaseCheckboxesWrapper,
  elements.licenseCheckboxesWrapper,
  elements.sourceCheckboxesWrapper,
  elements.fileTypeCheckboxesWrapper,
  elements.imageTypeCheckboxesWrapper,
  elements.imageSizeCheckboxesWrapper,
  elements.aspectRatioCheckboxesWrapper,
  elements.showMatureContentCheckboxWrapper,
];

// setting up clipboardjs https://github.com/zenorocha/clipboard.js
const clipboard = new ClipboardJS('.btn-copy');

clipboard.on('success', e => {
  e.clearSelection();
  showNotification('Copied', 'positive', 'notification--extension-popup');
});

clipboard.on('error', () => {
  showNotification('Some error occured while copying', 'negative', 'notification--extension-popup');
});

// setting up masonry https://github.com/desandro/masonry
const msnryOptions = {
  itemSelector: '.grid-item',
  columnWidth: '.grid-item',
  gutter: '.gutter-sizer',
  percentPosition: true,
  transitionDuration: '0',
};

export const primaryGridMasonryObject = new Masonry(elements.gridPrimary, msnryOptions);
export const bookmarksGridMasonryObject = new Masonry(elements.gridBookmarks, msnryOptions);
export const relatedImagesGridMasonryObject = new Masonry(elements.gridRelatedImages, msnryOptions);

export const appConfig = {
  bookmarkContainerSize: 30,
  bookmarkIdContainerSize: 80,
  extensionBookmarkLimit: 300,
};

function getStack() {
  return {
    stack: [],

    push(element) {
      this.stack.push(element);
    },

    pop() {
      if (this.stack.length === 0) return 'Underflow';
      return this.stack.pop();
    },

    top() {
      return this.stack[this.stack.length - 1];
    },

    isEmpty() {
      return this.stack.length === 0;
    },

    clear() {
      this.stack = [];
    },
  };
}

/**
 * @desc Returns the ids of all the checked checkboxes inside the passed DOM element
 * @param {HTMLElement} checkboxesWrapper
 * @return {HTMLElement[]}
 */
function getCheckedCheckboxes(checkboxesWrapper) {
  const checkboxes = checkboxesWrapper.querySelectorAll('input[type=checkbox]');

  const checkedCheckboxes = [];
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) checkedCheckboxes.push(checkbox.id);
  });

  return checkedCheckboxes;
}

/**
 * @desc Factory Function: creates and returns an object which is used to manage the application state
 * @return {Object}
 */
function createApplicationObject() {
  return {
    inputText: '',
    pageNo: 1,
    // holds the current active section of the
    // extension: filter, search, collections, bookmarks
    activeSection: 'search',
    // holds the context in which the search will
    // happen: default, collection(search by sources), image-tag(search by image-tag)
    searchContext: 'default',

    // data structures to hold active filters
    filters: {
      useCase: [],
      license: [],
      source: [],
      fileType: [],
      imageType: [],
      imageSize: [],
      aspectRatio: [],
    },
    enableMatureContent: false,

    // holds latest sources fetched from API as <source_name, display_name>
    sourcesFromAPI: {},

    // holds the active collection/source name. Used when "searching by sources"
    collectionName: '',
    isCollectionSectionRendered: false,
    // All the images in the bookmark section are not rendered at once. This variable holds the
    // starting position of the next batch of images to load.
    bookmarksSectionIdx: 0,
    // holds the active collection/source name. Used when "searching by image-tag"
    tagName: '',
    isEditViewEnabled: false,
    clickedImageTag: false,
    imageDetailStack: getStack(),

    resetFilters() {
      for (const filter of Object.keys(this.filters)) {
        this.filters[filter] = [];
      }
      this.enableMatureContent = false;
    },

    updateFilters() {
      for (const filter of Object.keys(this.filters)) {
        this.filters[filter] = getCheckedCheckboxes(elements[`${filter}CheckboxesWrapper`]);
      }
      this.enableMatureContent = getCheckedCheckboxes(elements.showMatureContentCheckboxWrapper).length > 0;
    },
  };
}

export const appObject = createApplicationObject();
