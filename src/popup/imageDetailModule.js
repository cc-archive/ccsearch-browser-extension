import download from 'downloadjs';

import { elements, appObject, relatedImagesGridMasonryObject } from './base';
import { addSpinner } from './spinner';
import { fetchImage, fetchImages, removeChildNodes } from '../utils';
import { clearFilters, removeImagesFromGrid, getTagsUrl, licenseInfo } from './helper';
// eslint-disable-next-line import/no-cycle
import { addImagesToDOM, search } from './localUtils';

/* *********************** Reuse tab *********************** */

/**
 * @desc Creates and returns "Rich Text Attribution" for an image.
 * @param {Object} image - The image object.
 * @returns {string}
 */
export function getRichTextAttribution(image) {
  if (!image) {
    return '';
  }
  const imgLink = `<a href="${image.foreign_landing_url}" target="_blank">"${image.title}"</a>`;
  let creator = '';
  if (image.creator && image.creator_url) {
    creator = `<span> by <a href="${image.creator_url}" target="_blank">${image.creator}</a></span>`;
  } else if (image.creator && !image.creator_url) {
    creator = `<span> by <span>${image.creator}</span></span>`;
  }
  const licenseLink = ` is licensed under <a href="${
    image.license_url
  }" target="_blank">CC ${image.license.toUpperCase()} ${image.license_version}</a>`;

  return `${imgLink}${creator}${licenseLink}`;
}

/**
 * @desc Inserts "rich-text-attribution" for an image in the "share" tab.
 * @param {Object} image - The image object.
 */
function embedRichTextAttribution(image) {
  const richTextAttribution = `<div>${getRichTextAttribution(image)}</div>`;
  const parser = new DOMParser();
  const parsed = parser.parseFromString(richTextAttribution, 'text/html');
  const tags = parsed.getElementsByTagName('div');
  elements.richTextAttributionPara.innerText = '';
  elements.richTextAttributionPara.appendChild(tags[0]);
}

/**
 * @desc Creates and returns "HTML Attribution" for an image.
 * @param {Object} image - The image object.
 * @returns {string}
 */
export function getHtmlAttribution(image) {
  if (!image) {
    return '';
  }
  const baseAssetsPath = 'https://search.creativecommons.org/static/img'; // path is not dynamic. Change if assets are moved.
  const imgLink = `<a href="${image.foreign_landing_url}">"${image.title}"</a>`;
  let creator = '';
  if (image.creator && image.creator_url) {
    creator = `<span> by <a href="${image.creator_url}">${image.creator}</a></span>`;
  } else if (image.creator && !image.creator_url) {
    creator = `<span> by <span>${image.creator}</span></span>`;
  }
  const licenseLink = ` is licensed under <a href="${
    image.license_url
  }" style="margin-right: 5px;">CC ${image.license.toUpperCase()} ${image.license_version}</a>`;

  let licenseIcons = `<img style="height: inherit;margin-right: 3px;display: inline-block;" src="${baseAssetsPath}/cc_icon.svg" />`;
  if (image.license) {
    licenseIcons += image.license
      .split('-')
      .map(
        license =>
          `<img style="height: inherit;margin-right: 3px;display: inline-block;" src="${baseAssetsPath}/cc-${license.toLowerCase()}_icon.svg" />`,
      )
      .join('');
  }

  const licenseImgLink = `<a href="${image.license_url}" target="_blank" rel="noopener noreferrer" style="display: inline-block;white-space: none;margin-top: 2px;margin-left: 3px;height: 22px !important;">${licenseIcons}</a>`;
  return `<p style="font-size: 0.9rem;font-style: italic;">${imgLink}${creator}${licenseLink}${licenseImgLink}</p>`;
}

/**
 * @desc Helps in Formatting HTML Attributions
 * @param {string} code - HTML Attributions.
 */
function formatCode(code, stripWhiteSpaces, stripEmptyLines) {
  const whitespace = ' '.repeat(4); // Default indenting 4 whitespaces
  let currentIndent = 0;
  let char = null;
  let nextChar = null;
  let flag = false;

  let result = '';
  for (let pos = 0; pos <= code.length; pos += 1) {
    char = code.substr(pos, 1);
    nextChar = code.substr(pos + 1, 1);

    if (char === '<' && nextChar !== '/') {
      flag = true;
    }

    // If opening tag, add newline character and indention
    if (char === '<' && nextChar !== '/') {
      result += `\n${whitespace.repeat(currentIndent)}`;
      currentIndent += 1;
    }
    // if Closing tag, add newline and indention
    else if (char === '<' && nextChar === '/') {
      // If there're more closing tags than opening
      currentIndent -= 1;
      if (currentIndent < 0) currentIndent = 0;
      if (flag) {
        flag = false;
      } else {
        result += `\n${whitespace.repeat(currentIndent)}`;
      }
    } else if (char === '/' && nextChar === '>') {
      // If there're more closing tags than opening
      currentIndent -= 1;
      if (currentIndent < 0) currentIndent = 0;
      flag = false;
    }

    // remove multiple whitespaces
    else if (stripWhiteSpaces === true && char === ' ' && nextChar === ' ') char = '';
    // remove empty lines
    else if (stripEmptyLines === true && char === '\n') {
      if (code.substr(pos, code.substr(pos).indexOf('<')).trim() === '') char = '';
    }

    result += char;
  }

  return result;
}

/**
 * @desc Creates and returns the attribution that needs to be put in the attribution text file. The
 * file has plain text attribution, links(for image, creator, and license), and HTML attribution.
 * @param {Object} image - The image object.
 * @returns {string}
 */
export function getAttributionForTextFile(image) {
  if (!image) {
    return '';
  }
  let creatorUrl = 'Not Available';
  const HtmlAttribution = getHtmlAttribution(image);
  const FormattedHtmlAttribution = formatCode(HtmlAttribution, true, true);
  if (image.creator_url) {
    creatorUrl = image.creator_url;
  }
  if (image.creator) {
    return `"${image.title}" by ${image.creator} is licensed under CC ${image.license.toUpperCase()} ${
      image.license_version
    }\n\n
Image Link: ${image.foreign_landing_url}\n
Creator Link: ${creatorUrl}\n
License Link: ${image.license_url}\n\n
**********************HTML Attribution**********************
${FormattedHtmlAttribution}`;
  }
  return `${image.title} is licensed under CC ${image.license.toUpperCase()} ${image.license_version}\n\n
Image Link: ${image.foreign_landing_url}\n
Creator Link: ${creatorUrl}\n\n
**********************HTML Attribution**********************
${FormattedHtmlAttribution}`;
}

/**
 * @desc Helper function to download an image provided it's address on the
 * web. credit: http://danml.com/download.html
 * @param {string} imageUrl
 * @param {string} imageName
 */
function downloadImage(imageUrl, imageName) {
  const x = new XMLHttpRequest();
  x.open('GET', imageUrl, true);
  x.responseType = 'blob';
  x.onload = () => {
    download(x.response, imageName, 'image/gif');
  };
  x.send();
}

function downloadImageAttribution(image) {
  download(getAttributionForTextFile(image), `${image.title}.txt`, 'text/plain');
}

function handleImageAndAttributionDownload(e) {
  downloadImage(e.currentTarget.image.url, e.currentTarget.title);
  downloadImageAttribution(e.currentTarget.image);
}

/**
 * @desc Fills the license link present in the reuse tab of image-detail section
 * @param {string} licenseName
 * @param {string} licenseVersion
 * @param {string} licenseUrl
 */
function fillLicenseLink(licenseName, licenseVersion, licenseUrl) {
  elements.licenseLink.innerText = `CC ${licenseName.toUpperCase()} ${licenseVersion}`;
  elements.licenseLink.setAttribute('href', licenseUrl);
  elements.licenseLinkCaption.setAttribute('href', licenseUrl);
}

/**
 * @desc Adds brief description about the license in the "share" tab of image-detail section.
 * @param {string[]} licenseArray
 */
function fillLicenseInfo(licenseArray) {
  elements.licenseDescriptionDiv.innerText = '';

  licenseArray.forEach(license => {
    // get the information and icon to use from `licenseInfo` object
    const { licenseIcon, licenseDescription } = licenseInfo[license];

    const iconElement = document.createElement('i');
    iconElement.classList.add('icon', 'license-logo', licenseIcon);

    const licenseDescriptionSpanElement = document.createElement('span');
    licenseDescriptionSpanElement.innerText = licenseDescription;

    const divElement = document.createElement('div');
    divElement.appendChild(iconElement);
    divElement.appendChild(licenseDescriptionSpanElement);

    elements.licenseDescriptionDiv.appendChild(divElement);
  });
}

/* *********************** Information tab *********************** */

/**
 * @desc Fills "Dimensions" section of the "information" tab.
 * @param {string} imgHeight
 * @param {string} imgWidth
 */
function fillImageDimension(imgHeight, imgWidth) {
  elements.imageDimensionPara.innerText = `${imgHeight} × ${imgWidth} pixels`;
}

/**
 * @desc Fills "Source" section of the "information" tab.
 * @param {string} foreignLandingUrl - The link to the original source of image.
 * @param {string} sourceName
 */
function fillImageSource(foreignLandingUrl, sourceName) {
  const link = document.createElement('a');
  link.href = foreignLandingUrl;
  link.target = '_blank';
  link.textContent = appObject.sourcesFromAPI[sourceName];
  elements.imageSourcePara.innerText = '';
  elements.imageSourcePara.appendChild(link);
}

/**
 * @desc Fills "License" section of the "information" tab.
 * @param {string} licenseUrl
 * @param {string[]} licenseArray
 */
function fillImageLicense(licenseUrl, licenseArray) {
  // add the license icons first
  elements.imageLicensePara.innerText = '';
  licenseArray.forEach(license => {
    const { licenseIcon } = licenseInfo[license];
    const iconElement = document.createElement('i');
    iconElement.classList.add('icon', 'license-logo', licenseIcon);
    elements.imageLicensePara.appendChild(iconElement);
  });

  // license link
  const link = document.createElement('a');
  link.href = licenseUrl;
  link.target = '_blank';
  link.textContent = `CC ${licenseArray.join('-').toUpperCase()}`;
  elements.imageLicensePara.appendChild(link);
}

/* *********************** Share tab *********************** */

function getFacebookShareLink(imageId) {
  // needs to be changed if CC Search domain changes.
  return `https://www.facebook.com/sharer/sharer.php?u=https://search.creativecommons.org/photos/${imageId}`;
}

function getTwitterShareLink(sourceLink) {
  return `https://twitter.com/intent/tweet?text=I%20found%20an%20image%20through%20CC%20Search%20%40creativecommons%3A%20${sourceLink}`;
}

function getPinterestShareLink(sourceLink, imageLink) {
  return `https://pinterest.com/pin/create/button/?url=${sourceLink}&media=${imageLink}&description=I%20found%20an%20image%20through%20CC%20search%20%40creativecommons%3A%20${sourceLink}`;
}

function getTumblrShareLink(sourceLink, imageLink) {
  return `http://tumblr.com/widgets/share/tool?canonicalUrl=${sourceLink}&posttype=photo&content=${imageLink}`;
}

/* *********************** Common (tags and related images) *********************** */

/**
 * @callback searchByTag
 * @desc Triggered when an image-tag is clicked. Instantiates "search by tag".
 * @param {Object} event
 */
function searchByTag(event) {
  // set application state to reflect "searching by tag"
  appObject.pageNo = 1;
  appObject.searchContext = 'image-tag';
  appObject.inputText = '';
  appObject.tagName = event.target.innerText;
  appObject.clickedImageTag = true;

  elements.inputField.value = '';
  elements.closeImageDetailLink.click();
  elements.headerLogo.click();

  clearFilters();
  removeImagesFromGrid(elements.gridPrimary);
  addSpinner(elements.spinnerPlaceholderPrimary, 'original');

  const url = getTagsUrl();
  search(url);
}

/**
 * @desc Creates image-tags(if present for the current image) and adds
 * them to the image-detail secton.
 * @param {Object[]} tagsArray - Array of objects that contains tag names.
 */
function fillImageTags(tagsArray) {
  if (tagsArray) {
    const tagButtons = [];

    tagsArray.forEach(tag => {
      const tagName = tag.name;
      const tagButton = document.createElement('button');
      tagButton.textContent = tagName;
      tagButton.classList.add('button', 'tag');
      tagButton.addEventListener('click', searchByTag);
      tagButtons.push(tagButton);
    });

    tagButtons.forEach(tagButton => {
      elements.imageTagsDiv.appendChild(tagButton);
    });
  }
}

/**
 * @desc Fetches "related-images" from the API and calls "addImagesToDOM" for making image
 * components and adding them in the image-detail section.
 */
async function fillRelatedImages(relatedUrl) {
  const images = await fetchImages(relatedUrl);
  addImagesToDOM(relatedImagesGridMasonryObject, images, elements.gridRelatedImages);
}

/* *********************** Meta *********************** */

/**
 * @desc Remove information and instances about the current image from the image-detail
 * section. Makes it a clean slate and prepares it for the next probable image.
 */
export function resetImageDetailSection() {
  // remove eventlisteners from download buttons to avoid multiple downloads.
  for (const button of elements.downloadImageAttributionButton) {
    button.removeEventListener('click', handleImageAndAttributionDownload);
  }
  // making reuse tab active for later
  const imageDetailNavTabs = elements.imageDetailNav.getElementsByTagName('li');
  for (let i = 0; i < 3; i += 1) {
    imageDetailNavTabs[i].classList.remove('is-active');
    elements.imageDetailTabsPanels[i].classList.remove('is-active');
  }
  elements.reuseTab.classList.add('is-active');
  elements.reusePanel.classList.add('is-active');

  // share tab
  elements.richTextAttributionPara.innerText = 'Loading...';
  elements.htmlAttributionTextArea.value = 'Loading...';
  elements.plainTextAttributionPara.innerText = 'Loading...';
  elements.licenseDescriptionDiv.innerText = 'Loading...';

  // information tab
  elements.imageDimensionPara.innerText = 'Loading...';
  elements.imageSourcePara.innerText = 'Loading...';
  elements.imageLicensePara.innerText = 'Loading...';

  // image tags
  removeChildNodes(elements.imageTagsDiv);

  // related images
  removeImagesFromGrid(elements.gridRelatedImages);
}

/**
 * @desc Fetches the image data from the API and calls various helper functions to
 * fill the image detail section (reuse, information, and share tab).
 * @param {string} imageId
 */
export async function fillImageDetailSection(imageId) {
  const url = `https://api.creativecommons.engineering/v1/images/${imageId}`;

  const image = await fetchImage(url);
  const {
    id,
    width,
    height,
    source,
    license,
    url: imageUrl,
    tags: tagsArray,
    related_url: relatedUrl,
    license_url: licenseUrl,
    license_version: licenseVersion,
    foreign_landing_url: foreignLandingUrl,
  } = image;
  const licenseArray = license.split('-');

  // common head (download button and external link)
  for (const button of elements.downloadImageAttributionButton) {
    // adding arguments for event handler to the target itself
    button.image = image;
    button.title = `${image.title}.${image.url.split('.').pop()}`;
    button.addEventListener('click', handleImageAndAttributionDownload);
  }
  elements.imageExternalLink.href = foreignLandingUrl;

  // reuse tab
  embedRichTextAttribution(image);
  elements.htmlAttributionTextArea.value = getHtmlAttribution(image);
  elements.plainTextAttributionPara.innerText = image.attribution;
  fillLicenseLink(license, licenseVersion, licenseUrl);
  fillLicenseInfo(licenseArray);

  // information tab
  fillImageDimension(height, width);
  fillImageSource(foreignLandingUrl, source);
  fillImageLicense(licenseUrl, licenseArray);

  // share tab
  elements.facebookShareButton.href = getFacebookShareLink(id);
  elements.twitterShareButton.href = getTwitterShareLink(foreignLandingUrl);
  elements.pinterestShareButton.href = getPinterestShareLink(foreignLandingUrl, imageUrl);
  elements.tumblrShareButton.href = getTumblrShareLink(foreignLandingUrl, imageUrl);

  // common
  fillImageTags(tagsArray);
  fillRelatedImages(relatedUrl);
}

/**
 * @desc Opens the image detail section for the provided image element.
 * @param {HTMLElement} imageElement - The image DOM element that the user has clicked.
 */
export function openImageDetailSection(imageElement) {
  resetImageDetailSection();
  elements.buttonBackToTop.click();

  /* push the instance of current image onto the imageDetailStack. The stack
  helps keep track of the images when the user subsequently opens more image detail
  sections throught related-images
   */
  appObject.imageDetailStack.push(imageElement.id);

  fillImageDetailSection(imageElement.id);

  elements.header.classList.add('display-none');
  elements.sectionMain.classList.add('display-none');
  elements.imageDetailSection.classList.remove('display-none');
}
