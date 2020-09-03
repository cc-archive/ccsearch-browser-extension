import { elements } from './base';
// import { removeSpinner } from './spinner';
// eslint-disable-next-line import/no-cycle
import { addSearchThumbnailsToDOM, getTagsUrl, search, removeOldSearchResults } from './searchModule';
import { addSpinner } from './spinner';
import { removeChildNodes } from '../utils';
import { clearFilters } from './helper';

const Masonry = require('masonry-layout');

const download = require('downloadjs');

const relatedImagesGridMasonryObject = new Masonry(elements.gridRelatedImages, {
  // options
  itemSelector: '.grid-item',
  columnWidth: '.grid-item',
  gutter: '.gutter-sizer',
  percentPosition: true,
  transitionDuration: '0',
});

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

function embedRichTextAttribution(image) {
  const richTextAttribution = `<div>${getRichTextAttribution(image)}</div>`;
  const parser = new DOMParser();
  const parsed = parser.parseFromString(richTextAttribution, 'text/html');
  const tags = parsed.getElementsByTagName('div');
  elements.richTextAttributionPara.innerText = '';
  elements.richTextAttributionPara.appendChild(tags[0]);
}

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

export function getAttributionForTextFile(image) {
  if (!image) {
    return '';
  }
  let creatorUrl = 'Not Available';
  const HtmlAttribution = getHtmlAttribution(image);
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
${HtmlAttribution}`;
  }
  return `${image.title} is licensed under CC ${image.license.toUpperCase()} ${image.license_version}\n\n
Image Link: ${image.foreign_landing_url}\n
Creator Link: ${creatorUrl}\n\n
**********************HTML Attribution**********************
${HtmlAttribution}`;
}

function downloadImage(imageUrl, imageName) {
  const x = new XMLHttpRequest();
  x.open('GET', imageUrl, true);
  x.responseType = 'blob';
  x.onload = () => {
    download(x.response, imageName, 'image/gif'); // using download.js (http://danml.com/download.html)
  };
  x.send();
  // eventHandlerTarget.removeEventListener('click', eventHandlerFunction);
}

function downloadImageAttribution(image) {
  download(getAttributionForTextFile(image), `${image.title}.txt`, 'text/plain');
}

export function handleImageDownload(e) {
  downloadImage(e.currentTarget.imageUrl, e.currentTarget.title);
}
export function handleImageAttributionDownload(e) {
  downloadImage(e.currentTarget.image.url, e.currentTarget.title);
  downloadImageAttribution(e.currentTarget.image);
}

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
// Shares the image to Tumblt
function getTumblrShareLink(sourceLink, imageLink) {
  return `http://tumblr.com/widgets/share/tool?canonicalUrl=${sourceLink}&posttype=photo&content=${imageLink}`;
}

const licenseInfo = {
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

function fillLicenseInfo(licenseArray) {
  elements.licenseDescriptionDiv.innerText = '';
  licenseArray.forEach(license => {
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

function fillImageDimension(height, width) {
  elements.imageDimensionPara.innerText = `${height} × ${width} pixels`;
}

function fillImageSource(foreignLandingUrl, source) {
  const link = document.createElement('a');
  link.href = foreignLandingUrl;
  link.target = '_blank';
  link.textContent = window.appObject.sourcesFromAPI[source];
  elements.imageSourcePara.innerText = '';
  elements.imageSourcePara.appendChild(link);
}

function fillImageLicense(licenseUrl, licenseArray) {
  // fill license icons first
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

function searchByTag(event) {
  // set some app objects
  window.appObject.pageNo = 1;
  window.appObject.activeSearchContext = 'tag';
  window.appObject.inputText = '';
  window.appObject.tagName = event.target.innerText;
  window.appObject.clickedImageTag = true;

  elements.inputField.value = '';
  elements.closeImageDetailLink.click();
  elements.headerLogo.click();

  clearFilters();
  removeOldSearchResults();
  addSpinner(elements.spinnerPlaceholderPrimary, 'original');

  // search by tag
  const url = getTagsUrl(window.appObject.tagName, window.appObject.pageNo);
  search(url);
}

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

    for (let i = 0; i < tagButtons.length; i += 1) {
      // first making deep copy otherwise because `appendChild`
      // moves the node from previous parent to the current one
      elements.imageTagsDiv.appendChild(tagButtons[i]);
    }
  }
}

export function resetImageDetailSection() {
  // remove eventlisteners from download buttons to avoid multiple downloads.
  for (let i = 0; i < elements.downloadImageAttributionButton.length; i += 1) {
    elements.downloadImageAttributionButton[i].removeEventListener('click', handleImageAttributionDownload);
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
  const div = document.createElement('div');
  div.classList.add('gutter-sizer');
  removeChildNodes(elements.gridRelatedImages);
  elements.gridRelatedImages.appendChild(div);
}

function fillRelatedImages(relatedUrl) {
  fetch(relatedUrl)
    .then(data => data.json())
    .then(res => {
      // checkValidationError(res);
      const resultArray = res.results;

      // checkResultLength(resultArray);
      addSearchThumbnailsToDOM(relatedImagesGridMasonryObject, resultArray, elements.gridRelatedImages);

      // window.appObject.pageNo += 1;
    });
}

function fillLicenseLink(license, licenseVersion, licenseUrl) {
  elements.licenseLink.innerText = `CC ${license.toUpperCase()} ${licenseVersion}`;
  elements.licenseLink.setAttribute('href', licenseUrl);
  elements.licenseLinkCaption.setAttribute('href', licenseUrl);
}

export function fillImageDetailSection(imageId) {
  const url = `https://api.creativecommons.engineering/v1/images/${imageId}`;

  fetch(url)
    .then(data => data.json())
    .then(res => {
      const {
        source,
        foreign_landing_url: foreignLandingUrl,
        license_url: licenseUrl,
        license_version: licenseVersion,
        related_url: relatedUrl,
        license,
        height,
        width,
        id,
        url: imageUrl,
        tags: tagsArray,
      } = res;
      const licenseArray = license.split('-');

      // common head (download button and external link)
      for (let i = 0; i < elements.downloadImageAttributionButton.length; i += 1) {
        // adding arguments for event handler to the target itself
        elements.downloadImageAttributionButton[i].image = res;
        elements.downloadImageAttributionButton[i].title = `${res.title}.${res.url.split('.').pop()}`;
        elements.downloadImageAttributionButton[i].addEventListener('click', handleImageAttributionDownload);
      }
      elements.imageExternalLink.href = foreignLandingUrl;

      // reuse tab
      embedRichTextAttribution(res);
      elements.htmlAttributionTextArea.value = getHtmlAttribution(res);
      elements.plainTextAttributionPara.innerText = res.attribution;
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

      // removeSpinner(elements.spinnerPlaceholderPopup);
    });
}

export function activatePopup(imageThumbnail) {
  // addSpinner(elements.spinnerPlaceholderPopup, 'original');
  resetImageDetailSection();
  elements.buttonBackToTop.click();

  window.appObject.imageDetailStack.push(imageThumbnail.id);

  fillImageDetailSection(imageThumbnail.id);
  // attributionTabLink.click();
  elements.header.classList.add('display-none');
  // elements.bookmarksSection.classList.add('display-none');
  elements.sectionMain.classList.add('display-none');
  elements.imageDetailSection.classList.remove('display-none');
}
