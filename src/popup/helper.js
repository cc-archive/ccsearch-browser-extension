import { elements, appObject, primaryGridMasonryObject, filterCheckboxWrappers } from './base';
import { removeChildNodes, showNotification } from '../utils';
import { removeSpinner } from './spinner';

export function clearFilters() {
  // unchecking all the filter checkboxes
  filterCheckboxWrappers.forEach(wrapper => {
    const checkboxes = wrapper.querySelectorAll('input[type=checkbox]');

    for (const checkbox of checkboxes) {
      checkbox.checked = false;
    }
  });

  appObject.resetFilters();
}

// convert Unicode sequence To String. credit: https://stackoverflow.com/a/22021709/10425980
export function unicodeToString(string) {
  if (typeof string === 'string') {
    return string.replace(/\\u[\dA-F]{4}/gi, match => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)));
  }
  return '';
}

/**
 * @desc Removes everything, including images(grid-items), from inside the given HTML element and
 * inserts a div with the class 'gutter-sizer' which is used by masonry in case new images are inserted.
 * @param {HTMLElement} gridDiv
 */
export function removeImagesFromGrid(gridDiv) {
  const div = document.createElement('div');
  div.classList.add('gutter-sizer');
  removeChildNodes(gridDiv);
  gridDiv.appendChild(div);
}

/**
 * @desc Returns the url that will be used to fetch images during "search by image-tag"
 * @return {string}
 */
export function getTagsUrl() {
  const { tagName, pageNo } = appObject;

  return `https://api.creativecommons.engineering/v1/images?tags=${tagName}&page=${pageNo}&page_size=20`;
}

/**
 * @desc Returns true if the given object is empty.
 * @param {Object} obj
 * @returns {bool}
 */
export function isObjectEmpty(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function addLoadMoreButton(loadMoreButtonWrapper) {
  loadMoreButtonWrapper.classList.remove('display-none');
}

export function removeLoadMoreButton(loadMoreButtonWrapper) {
  loadMoreButtonWrapper.classList.add('display-none');
}

/**
 * @desc Checks if the result-array(the response from the API) is empty or not. If it's empty, then
 * notify the user, and throw Error.
 * @param {Object[]} resultArray
 */
export function checkResultLength(resultArray) {
  if (resultArray.length === 0) {
    showNotification(
      'No Images Found. Please enter a different query.',
      'negative',
      'notification--extension-popup',
      4000,
    );
    removeSpinner(elements.spinnerPlaceholderPrimary);
    removeLoadMoreButton(elements.loadMoreSearchButtonWrapper);
    primaryGridMasonryObject.layout();
    throw new Error('No image found');
  } else {
    // render the "Load More" button if non empty result
    addLoadMoreButton(elements.loadMoreSearchButtonWrapper);
  }
}

/* Object that holds license icon class name(according to cc-vocabulary) and brief description about each license. */
export const licenseInfo = {
  by: {
    licenseIcon: 'cc-by',
    licenseDescription: 'Credit the creator.',
  },
  nc: {
    licenseIcon: 'cc-nc',
    licenseDescription: 'Commercial use not permitted',
  },
  sa: {
    licenseIcon: 'cc-sa',
    licenseDescription: 'Share adaptations under the same terms.',
  },
  nd: {
    licenseIcon: 'cc-nd',
    licenseDescription: 'No derivates or modifications permitted.',
  },
  pdm: {
    licenseIcon: 'cc-pd',
    licenseDescription: 'This work is marked as being in the public domain.',
  },
  cc0: {
    licenseIcon: 'cc-zero',
    licenseDescription: 'This work has been marked as dedicated to the public domain.',
  },
};

export const tooltipInfo = {
  by: {
    tooltipHeading: `License CC BY`,
    tooltipContent: `<p><i class='icon ${licenseInfo.by.licenseIcon}'></i> ${licenseInfo.by.licenseDescription}</p>`,
  },
  bync: {
    tooltipHeading: `License CC BY-NC`,
    tooltipContent: `<p><i class='icon ${licenseInfo.by.licenseIcon}'></i> ${licenseInfo.by.licenseDescription}<br/><i class='icon ${licenseInfo.nc.licenseIcon}'></i> ${licenseInfo.nc.licenseDescription}</p>`,
  },
  bysa: {
    tooltipHeading: `License CC BY-SA`,
    tooltipContent: `<p><i class='icon ${licenseInfo.by.licenseIcon}'></i> ${licenseInfo.by.licenseDescription}<br/><i class='icon ${licenseInfo.sa.licenseIcon}'></i> ${licenseInfo.sa.licenseDescription}</p>`,
  },
  bynd: {
    tooltipHeading: `License CC BY-ND`,
    tooltipContent: `<p><i class='icon ${licenseInfo.by.licenseIcon}'></i> ${licenseInfo.by.licenseDescription}<br/><i class='icon ${licenseInfo.nd.licenseIcon}'></i> ${licenseInfo.nd.licenseDescription}</p>`,
  },
  byncsa: {
    tooltipHeading: `License CC BY-NC-SA`,
    tooltipContent: `<p><i class='icon ${licenseInfo.by.licenseIcon}'></i> ${licenseInfo.by.licenseDescription}<br/><i class='icon ${licenseInfo.nc.licenseIcon}'></i> ${licenseInfo.nc.licenseDescription}<br/><i class='icon ${licenseInfo.sa.licenseIcon}'></i> ${licenseInfo.by.licenseDescription}</p>`,
  },
  byncnd: {
    tooltipHeading: `License CC BY-NC-ND`,
    tooltipContent: `<p><i class='icon ${licenseInfo.by.licenseIcon}'></i> ${licenseInfo.by.licenseDescription}<br/><i class='icon ${licenseInfo.nc.licenseIcon}'></i> ${licenseInfo.nc.licenseDescription}<br/><i class='icon ${licenseInfo.nd.licenseIcon}'></i> ${licenseInfo.nd.licenseDescription}</p>`,
  },
  pdm: {
    tooltipHeading: `PDM`,
    tooltipContent: `<p><i class='icon ${licenseInfo.pdm.licenseIcon}'></i> ${licenseInfo.pdm.licenseDescription}</p>`,
  },
  cc0: {
    tooltipHeading: `CC0`,
    tooltipContent: `<p><i class='icon ${licenseInfo.cc0.licenseIcon}'></i> ${licenseInfo.cc0.licenseDescription}</p>`,
  },
};
