import { elements } from './base';
// import { removeSpinner } from './spinner';
// import { removeChildNodes } from '../utils';
import { getSourceDisplayName, unicodeToString } from './helper';
// eslint-disable-next-line import/no-cycle
import { addSearchThumbnailsToDOM } from './searchModule';

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

function embedRichTextAttribution(image, targetNode) {
  const richTextAttribution = `<div>${getRichTextAttribution(image)}</div>`;
  const parser = new DOMParser();
  const parsed = parser.parseFromString(richTextAttribution, 'text/html');
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
  link.textContent = getSourceDisplayName(source);
  elements.imageSourcePara.appendChild(link);
}

function fillImageLicense(licenseUrl, licenseArray) {
  // fill license icons first
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

function fillImageTags(tagsArray) {
  if (tagsArray) {
    const tagButtons = [];
    tagsArray.forEach(tag => {
      const tagName = tag.name;
      const tagButton = document.createElement('button');
      tagButton.textContent = tagName;
      tagButton.classList.add('button', 'tag');
      tagButtons.push(tagButton);
    });

    for (let i = 0; i < elements.imageTagsDivs.length; i += 1) {
      for (let j = 0; j < tagButtons.length; j += 1) {
        // first making deep copy otherwise because `appendChild`
        // moves the node from previous parent to the current one
        const copyNode = tagButtons[j].cloneNode(true);
        elements.imageTagsDivs[i].appendChild(copyNode);
      }
    }
  }
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

// function getPopupCreatorChildNode(creatorUrl, creator) {
//   // return a paragraph tag if creatorURL not present
//   if (creatorUrl === '#') {
//     const paragraph = document.createElement('p');
//     paragraph.textContent = creator;
//     return paragraph;
//   }
//   const link = document.createElement('a');
//   link.href = creatorUrl;
//   link.target = '_blank';
//   link.textContent = creator;
//   return link;
// }

// function getPopupSourceChildNode(foreignLandingUrl, source) {
//   const link = document.createElement('a');
//   link.href = foreignLandingUrl;
//   link.target = '_blank';
//   link.textContent = getSourceDisplayName(source);
//   return link;
// }

// function getPopupLicenseChildNode(licenseUrl, license) {
//   const link = document.createElement('a');
//   link.href = licenseUrl;
//   link.target = '_blank';
//   link.textContent = license;
//   return link;
// }

function fillLicenseLink(license, licenseVersion, licenseUrl) {
  elements.licenseLink.innerText = `CC ${license.toUpperCase()} ${licenseVersion}`;
  elements.licenseLink.setAttribute('href', licenseUrl);
  elements.licenseLinkCaption.setAttribute('href', licenseUrl);
}

function getImageData(imageId) {
  const url = `https://api.creativecommons.engineering/v1/images/${imageId}`;
  console.log('get image data called');
  console.log(elements.downloadImageAttributionButton);

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
      // const title = unicodeToString(res.title);
      let creator = unicodeToString(res.creator);
      let { creator_url: creatorUrl } = res;
      const licenseArray = license.split('-');
      if (!creatorUrl) {
        creatorUrl = '#';
      }
      if (!creator) {
        creator = 'Not Available';
      }
      // adding arguments for event handlers to the target itself
      // elements.downloadImageButton.imageUrl = res.url;
      // elements.downloadImageButton.title = `${res.title}.${res.url.split('.').pop()}`;
      for (let i = 0; i < elements.downloadImageAttributionButton.length; i += 1) {
        console.log('inside the loop');
        console.log(elements.downloadImageAttributionButton[i]);
        elements.downloadImageAttributionButton[i].image = res;
        elements.downloadImageAttributionButton[i].title = `${res.title}.${res.url.split('.').pop()}`;
        elements.downloadImageAttributionButton[i].addEventListener('click', handleImageAttributionDownload);
      }

      elements.imageExternalLink.href = foreignLandingUrl;
      // elements.downloadImageAttributionButton.image = res;
      // elements.downloadImageAttributionButton.title = `${res.title}.${res.url.split('.').pop()}`;
      // const popupTitle = document.querySelector('.info__content-title');
      // const popupCreator = document.querySelector('.info__content-creator');
      // const popupSource = document.querySelector('.info__content-source');
      // const popupLicense = document.querySelector('.info__content-license');
      // const attributionRichTextPara = document.getElementById('attribution-rich-text');
      // const attributionHtmlTextArea = document.getElementById('attribution-html');
      // filling the info tab
      // popupTitle.textContent = `${title}`;
      // removeChildNodes(popupCreator);
      // popupCreator.appendChild(getPopupCreatorChildNode(creatorUrl, creator));
      // removeChildNodes(popupSource);
      // popupSource.appendChild(getPopupSourceChildNode(foreignLandingUrl, source));
      // removeChildNodes(popupLicense);
      // popupLicense.appendChild(getPopupLicenseChildNode(licenseUrl, license.toUpperCase()));
      // removeChildNodes(attributionRichTextPara);
      embedRichTextAttribution(res, elements.richTextAttributionPara);
      elements.htmlAttributionTextArea.value = getHtmlAttribution(res);
      elements.plainTextAttributionPara.innerText = res.attribution;

      fillLicenseLink(license, licenseVersion, licenseUrl);
      fillLicenseInfo(licenseArray);
      fillImageTags(tagsArray);
      fillRelatedImages(relatedUrl);

      fillImageDimension(height, width);
      fillImageSource(foreignLandingUrl, source);
      fillImageLicense(licenseUrl, licenseArray);
      // elements.downloadImageButton.addEventListener('click', handleImageDownload);
      // elements.downloadImageAttributionButton.addEventListener('click', handleImageAttributionDownload);
      // share tab
      elements.facebookShareButton.href = getFacebookShareLink(id);
      elements.twitterShareButton.href = getTwitterShareLink(foreignLandingUrl);
      elements.pinterestShareButton.href = getPinterestShareLink(foreignLandingUrl, imageUrl);
      elements.tumblrShareButton.href = getTumblrShareLink(foreignLandingUrl, imageUrl);
      // removeSpinner(elements.spinnerPlaceholderPopup);
      // elements.popupMain.style.opacity = 1;
      // elements.popupMain.style.visibility = 'visible';
    });
}

export function activatePopup(imageThumbnail) {
  // elements.popup.style.opacity = 1;
  // elements.popup.style.visibility = 'visible';
  // addSpinner(elements.spinnerPlaceholderPopup, 'original');
  getImageData(imageThumbnail.id);
  // attributionTabLink.click();
  elements.header.classList.add('display-none');
  // elements.bookmarksSection.classList.add('display-none');
  elements.sectionMain.classList.add('display-none');
  elements.imageDetailSection.classList.remove('display-none');
}
