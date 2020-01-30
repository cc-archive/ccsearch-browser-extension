import { elements, attributionTabLink } from './base';
import { addSpinner, removeSpinner } from './spinner';
import { removeChildNodes } from '../utils';

const download = require('downloadjs');

// eslint-disable-next-line consistent-return
export function getRichTextAttribution(image, targetNode) {
  if (!image) {
    return '';
  }
  const imgLink = `<a href="${image.foreign_landing_url}" target="_blank">"${image.title}"</a>`;
  let creator = '';
  if (image.creator && image.creator_url) {
    creator = `<span> by <a href="${image.creator_url}" target="_blank">${
      image.creator
      }</a></span>`;
  } else if (image.creator && !image.creator_url) {
    creator = `<span> by <span>${image.creator}</span></span>`;
  }
  const licenseLink = ` is licensed under <a href="${
    image.license_url
    }" target="_blank">CC ${image.license.toUpperCase()} ${image.license_version}</a>`;

  // return `${imgLink}${creator}${licenseLink}`;
  const final = `<div>${imgLink}${creator}${licenseLink}</div>`;
  const parser = new DOMParser();
  const parsed = parser.parseFromString(final, 'text/html');
  const tags = parsed.getElementsByTagName('div');
  targetNode.appendChild(tags[0]);
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
        license => `<img style="height: inherit;margin-right: 3px;display: inline-block;" src="${baseAssetsPath}/cc-${license.toLowerCase()}_icon.svg" />`,
      )
      .join('');
  }

  const licenseImgLink = `<a href="${
    image.license_url
    }" target="_blank" rel="noopener noreferrer" style="display: inline-block;white-space: none;margin-top: 2px;margin-left: 3px;height: 22px !important;">${licenseIcons}</a>`;
  return `<p style="font-size: 0.9rem;font-style: italic;">${imgLink}${creator}${licenseLink}${licenseImgLink}</p>`;
}

export function getPlainAttribution(image) {
  if (!image) {
    return '';
  }
  let creatorUrl = 'Not Available';
  const HtmlAttribution = getHtmlAttribution(image);
  if (image.creator_url) {
    creatorUrl = image.creator_url;
  }
  if (image.creator) {
    return `"${image.title}" by ${
      image.creator
      } is licensed under CC ${image.license.toUpperCase()} ${image.license_version}\n\n
Image Link: ${image.foreign_landing_url}\n
Creator Link: ${creatorUrl}\n
License Link: ${image.license_url}\n\n
**********************HTML Attribution**********************
${HtmlAttribution}`;
  }
  return `${image.title} is licensed under CC ${image.license.toUpperCase()} ${
    image.license_version
    }\n\n
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
  download(getPlainAttribution(image), `${image.title}.txt`, 'text/plain');
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
  return `https://twitter.com/intent/tweet?status=I%20found%20an%20image%20through%20CC%20search%20%40creativecommons%3A%20${sourceLink}`;
}

function getPinterestShareLink(sourceLink, imageLink) {
  return `https://pinterest.com/pin/create/button/?url=${sourceLink}&media=${imageLink}&description=I%20found%20an%20image%20through%20CC%20search%20%40creativecommons%3A%20${sourceLink}`;
}
// Shares the image to Tumblt
function getTumblrShareLink(sourceLink, imageLink) {
  return `http://tumblr.com/widgets/share/tool?canonicalUrl=${sourceLink}&posttype=photo&content=${imageLink}`;
}

function getPopupCreatorChildNode(creatorUrl, creator) {
  // return a paragraph tag if creatorURL not present
  if (creatorUrl === '#') {
    const paragraph = document.createElement('p');
    paragraph.textContent = creator;
    return paragraph;
  }
  const link = document.createElement('a');
  link.href = creatorUrl;
  link.target = '_blank';
  link.textContent = creator;
  return link;
}

function getPopupProviderChildNode(foreignLandingUrl, provider) {
  const link = document.createElement('a');
  link.href = foreignLandingUrl;
  link.target = '_blank';
  link.textContent = provider;
  return link;
}

function getPopupLicenseChildNode(licenseUrl, license) {
  const link = document.createElement('a');
  link.href = licenseUrl;
  link.target = '_blank';
  link.textContent = license;
  return link;
}

function getImageData(imageId) {
  const url = `https://api.creativecommons.engineering/image/${imageId}`;

  fetch(url)
    .then(data => data.json())
    .then((res) => {
      const {
        title,
        provider,
        foreign_landing_url: foreignLandingUrl,
        license_url: licenseUrl,
        license,
        id,
        url: imageUrl,
      } = res;
      let { creator, creator_url: creatorUrl } = res;
      if (!creatorUrl) {
        creatorUrl = '#';
      }
      if (!creator) {
        creator = 'Not Available';
      }
      // adding arguments for event handlers to the target itself
      elements.downloadImageButton.imageUrl = res.url;
      elements.downloadImageButton.title = `${res.title}.${res.url.split('.').pop()}`;
      elements.downloadImageAttributionButton.image = res;
      elements.downloadImageAttributionButton.title = `${res.title}.${res.url.split('.').pop()}`;
      const popupTitle = document.querySelector('.info__content-title');
      const popupCreator = document.querySelector('.info__content-creator');
      const popupProvider = document.querySelector('.info__content-provider');
      const popupLicense = document.querySelector('.info__content-license');
      const attributionRichTextPara = document.getElementById('attribution-rich-text');
      const attributionHtmlTextArea = document.getElementById('attribution-html');
      // filling the info tab
      popupTitle.textContent = `${title}`;
      removeChildNodes(popupCreator);
      popupCreator.appendChild(getPopupCreatorChildNode(creatorUrl, creator));
      removeChildNodes(popupProvider);
      popupProvider.appendChild(getPopupProviderChildNode(foreignLandingUrl, provider));
      removeChildNodes(popupLicense);
      popupLicense.appendChild(getPopupLicenseChildNode(licenseUrl, license.toUpperCase()));
      // attributionRichTextPara.textContent = getRichTextAttribution(res, attributionRichTextPara);
      removeChildNodes(attributionRichTextPara);
      getRichTextAttribution(res, attributionRichTextPara);
      attributionHtmlTextArea.value = getHtmlAttribution(res);
      elements.downloadImageButton.addEventListener('click', handleImageDownload);
      elements.downloadImageAttributionButton.addEventListener(
        'click',
        handleImageAttributionDownload,
      );
      // share tab
      elements.facebookShareButton.href = getFacebookShareLink(id);
      elements.twitterShareButton.href = getTwitterShareLink(foreignLandingUrl);
      elements.pinterestShareButton.href = getPinterestShareLink(foreignLandingUrl, imageUrl);
      elements.tumblrShareButton.href = getTumblrShareLink(foreignLandingUrl, imageUrl);
      removeSpinner(elements.spinnerPlaceholderPopup);
      elements.popupMain.style.opacity = 1;
      elements.popupMain.style.visibility = 'visible';
    });
}

export function activatePopup(imageThumbnail) {
  elements.popup.style.opacity = 1;
  elements.popup.style.visibility = 'visible';
  addSpinner(elements.spinnerPlaceholderPopup, 'original');
  getImageData(imageThumbnail.id);
  attributionTabLink.click();
}
