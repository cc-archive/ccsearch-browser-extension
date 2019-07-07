/* eslint-disable no-shadow */
import elements from './base';
import {
  checkInputError,
  removeInitialContent,
  removeOldSearchResults,
  getRequestUrl,
  checkResultLength,
  addThumbnailsToDOM,
} from './searchView';
import {
  isObjectEmpty,
  licensesList,
  usecasesList,
  licenseAPIQueryStrings,
  useCaseAPIQueryStrings,
  backupProviderAPIQueryStrings,
} from './helper';
import { populateProviderList, resetLicenseDropDown } from './filterView';

let inputText;
let pageNo;

// List to hold providers selected by the user from the drop down.
let userSelectedProvidersList = [];

// List to hold user selected licenses
let userSelectedLicensesList = [];

// List to hold user selected use case
let userSelectedUseCaseList = [];

// object to map Provider display names to valid query names.
let providerAPIQueryStrings = {};

// eslint-disable-next-line no-undef
const clipboard = new ClipboardJS('.btn-copy');

clipboard.on('success', (e) => {
  e.clearSelection();
  e.trigger.textContent = 'Copied';
  setTimeout(() => {
    e.trigger.textContent = 'Copy';
  }, 1000);
});

function getPlainAttribution(image) {
  if (!image) {
    return '';
  }
  let creatorUrl = 'None';
  // eslint-disable-next-line no-use-before-define
  const HtmlAttribution = getHtmlAttribution(image);
  if (image.creator_url) {
    creatorUrl = image.creator_url;
  }
  if (image.creator) {
    return `"${image.title}" by ${
      image.creator
    } is licensed under CC ${image.license.toUpperCase()} ${image.license_version}\n\n
Image Link: ${image.foreign_landing_url}\n
Creator Link: ${creatorUrl}\n\n
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
    // eslint-disable-next-line no-undef
    download(x.response, imageName, 'image/gif'); // using download.js (http://danml.com/download.html)
  };
  x.send();
  // eventHandlerTarget.removeEventListener('click', eventHandlerFunction);
}
function downloadImageAttribution(image) {
  // eslint-disable-next-line no-undef
  download(getPlainAttribution(image), image.title, 'text/plain');
}

function handleImageDownload(e) {
  downloadImage(e.currentTarget.imageUrl, e.currentTarget.title);
}
function handleImageAttributionDownload(e) {
  downloadImage(e.currentTarget.image.url, e.currentTarget.image.title);
  downloadImageAttribution(e.currentTarget.image);
}

elements.popupCloseButton.addEventListener('click', () => {
  elements.popup.style.opacity = 0;
  elements.popup.style.visibility = 'hidden';

  // remove eventlisteners from download buttons to avoid multiple downloads.
  elements.downloadImageButton.removeEventListener('click', handleImageDownload);
  elements.downloadImageAttributionButton.removeEventListener(
    'click',
    handleImageAttributionDownload,
  );
});

elements.popup.addEventListener('click', (e) => {
  if (e.target.classList.contains('popup')) {
    // popup.style.opacity = 0;
    // popup.style.visibility = 'hidden';
    elements.popupCloseButton.click();
  }
});

function removeClassFromElements(elemArray, className) {
  Array.prototype.forEach.call(elemArray, (e) => {
    e.classList.remove(className);
  });
}

function makeElementsDisplayNone(elemArray) {
  Array.prototype.forEach.call(elemArray, (e) => {
    e.style.display = 'none';
  });
}

Array.prototype.forEach.call(elements.popupTabLinks, (element) => {
  element.addEventListener('click', (e) => {
    const targetElement = e.target;
    const targetElementText = e.target.textContent;
    console.log(targetElementText);

    makeElementsDisplayNone(elements.popupTabContent);
    removeClassFromElements(elements.popupTabLinks, 'popup__tab-links-active');

    document.getElementById(targetElementText.toLowerCase()).style.display = 'block';
    targetElement.classList.add('popup__tab-links-active');
  });
});

// Activate the click event on pressing enter.
elements.inputField.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    elements.searchIcon.click();
  }
});

// Helper Functions

function getRichTextAttribution(image) {
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

  return `${imgLink}${creator}${licenseLink}`;
}

function getHtmlAttribution(image) {
  if (!image) {
    return '';
  }
  const baseAssetsPath = 'https://search.creativecommons.org/static/img'; // path is not dynamic. Change if assets are moved.
  const imgLink = `<a href="${image.foreign_landing_url}">"${image.title}"</a>`;
  let creator = '';
  if (image.creator && image.creator_url) {
    creator = `<span>by <a href="${image.creator_url}">${image.creator}</a></span>`;
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
  }" target="_blank" rel="noopener noreferrer" style="display: inline-block;white-space: none;opacity: .7;margin-top: 2px;margin-left: 3px;height: 22px !important;">${licenseIcons}</a>`;
  return `<p style="font-size: 0.9rem;font-style: italic;">${imgLink}${creator}${licenseLink}${licenseImgLink}</p>`;
}

function getImageData(imageId) {
  const url = `https://api.creativecommons.engineering/image/${imageId}`;

  fetch(url)
    .then(data => data.json())
    .then((res) => {
      console.log(res);
      const {
        title,
        provider,
        foreign_landing_url: foreignLandingUrl,
        license_url: licenseUrl,
        license,
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
      elements.downloadImageButton.title = res.title;
      elements.downloadImageAttributionButton.image = res;
      const popupTitle = document.querySelector('.info__content-title');
      const popupCreator = document.querySelector('.info__content-creator');
      const popupProvider = document.querySelector('.info__content-provider');
      const popupLicense = document.querySelector('.info__content-license');
      const attributionRichTextPara = document.getElementById('attribution-rich-text');
      const attributionHtmlTextArea = document.getElementById('attribution-html');
      // filling the info tab
      popupTitle.innerHTML = `${title}`;
      popupCreator.innerHTML = `<a href=${creatorUrl}>${creator}</a>`;
      popupProvider.innerHTML = `<a href=${foreignLandingUrl}>${provider}</a>`;
      popupLicense.innerHTML = `<a href=${licenseUrl}>CC ${license.toUpperCase()}</a>`;
      // Attribution tab
      attributionRichTextPara.innerHTML = getRichTextAttribution(res);
      attributionHtmlTextArea.value = getHtmlAttribution(res);
      elements.downloadImageButton.addEventListener('click', handleImageDownload);
      elements.downloadImageAttributionButton.addEventListener(
        'click',
        handleImageAttributionDownload,
      );
    });
}

elements.filterIcon.addEventListener('click', () => {
  elements.filterSection.classList.toggle('section-filter--active');

  const getProviderURL = 'https://api.creativecommons.engineering/statistics/image';

  if (isObjectEmpty(providerAPIQueryStrings)) {
    console.log('inside provider fetch');
    fetch(getProviderURL)
      .then(data => data.json())
      .then((res) => {
        res.forEach((provider) => {
          providerAPIQueryStrings[provider.display_name] = provider.provider_name;
        });
        populateProviderList(providerAPIQueryStrings);
      })
      .catch((error) => {
        console.log(error);
        providerAPIQueryStrings = backupProviderAPIQueryStrings;
        populateProviderList(providerAPIQueryStrings);
      });
  }
});

// TODO: divide the steps into functions
elements.filterResetButton.addEventListener('click', () => {
  // reset values
  elements.useCaseChooser.value = '';
  elements.licenseChooser.value = '';
  elements.providerChooser.value = '';

  // array of dropdown container elements
  const dropdownElementsList = [
    elements.providerChooserWrapper,
    elements.licenseChooserWrapper,
    elements.useCaseChooserWrapper,
  ];

  dropdownElementsList.forEach((dropdown) => {
    const dropdownContainer = dropdown.querySelector('.comboTreeDropDownContainer');
    const inputCheckboxes = dropdownContainer.getElementsByTagName('input');
    // unchecking all the options
    for (let i = 0; i < inputCheckboxes.length; i += 1) {
      // using click to uncheck the box as setting checked=false also works visually
      if (inputCheckboxes[i].checked) {
        inputCheckboxes[i].click();
      }
    }
  });

  // clear the datastructures and make a fresh search
  userSelectedLicensesList = [];
  userSelectedProvidersList = [];
  userSelectedUseCaseList = [];
  elements.searchIcon.click();
});

// block to disable license dropdown, when atleast one of use-case checkboxes are checked
elements.useCaseChooserWrapper.addEventListener(
  'click',
  (event) => {
    console.log('capture event occured');
    const useCaseDropDownContainer = elements.useCaseChooserWrapper.querySelector(
      '.comboTreeDropDownContainer',
    );
    const inputCheckboxes = useCaseDropDownContainer.getElementsByTagName('input');

    let flag = 0;
    if (event.target.classList.contains('comboTreeItemTitle')) {
      // only checking checkbox elements
      if (!event.target.querySelector('input').checked) {
        // if the clicked checkbox is unchecked
        resetLicenseDropDown();
        // clear the datastructures and make a fresh search
        userSelectedLicensesList = [];
        // disable the license dropdown (as atleast one checkbox is checked)
        elements.licenseChooser.disabled = true;
        flag = 1;
      }
    }
    for (let i = 0; i < inputCheckboxes.length; i += 1) {
      // iterating all the checkboxes of use-case dropdown
      if (inputCheckboxes[i] !== event.target.querySelector('input')) {
        // excluding the current checkbox
        if (inputCheckboxes[i].checked) {
          // if atleast one checkbox is checked, disable the license dropdown
          resetLicenseDropDown();
          elements.licenseChooser.disabled = true;
          flag = 1;
        }
      }
    }
    if (!flag) {
      // if none of the checkbox is checked
      if (elements.licenseChooser.disabled) {
        // enable the license dropdown if it is not already.
        elements.licenseChooser.disabled = false;
      }
    }
  },
  true, // needed to make the event trigger during capturing phase
  // (https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)
);

elements.filterApplyButton.addEventListener('click', () => {
  //  reset filter data structures
  userSelectedProvidersList = [];
  userSelectedLicensesList = [];
  userSelectedUseCaseList = [];

  if (elements.providerChooser.value) {
    const userInputProvidersList = elements.providerChooser.value.split(', ');
    userInputProvidersList.forEach((element) => {
      userSelectedProvidersList.push(providerAPIQueryStrings[element]);
    });
  }

  if (elements.licenseChooser.value) {
    const userInputLicensesList = elements.licenseChooser.value.split(', ');
    userInputLicensesList.forEach((element) => {
      console.log(element);
      userSelectedLicensesList.push(licenseAPIQueryStrings[element]);
    });
    console.log(userSelectedLicensesList);
  }

  if (elements.useCaseChooser.value) {
    const userInputUseCaseList = elements.useCaseChooser.value.split(', ');
    userInputUseCaseList.forEach((element) => {
      console.log(element);
      userSelectedUseCaseList.push(useCaseAPIQueryStrings[element]);
    });
    console.log(userSelectedUseCaseList);
  }
  elements.searchIcon.click();
});

elements.searchIcon.addEventListener('click', () => {
  inputText = elements.inputField.value;
  pageNo = 1;

  checkInputError(inputText);
  removeInitialContent();
  removeOldSearchResults();

  // enable spinner
  elements.spinner.classList.add('spinner');

  const url = getRequestUrl(
    inputText,
    userSelectedUseCaseList,
    userSelectedLicensesList,
    userSelectedProvidersList,
    pageNo,
  );

  console.log(url);
  pageNo += 1;

  fetch(url)
    .then(data => data.json())
    .then((res) => {
      const resultArray = res.results;
      console.log(resultArray);

      checkResultLength(resultArray);
      addThumbnailsToDOM(resultArray);
    });
});

// applying comboTree (see https://github.com/kirlisakal/combo-tree)
$('#choose-usecase').comboTree({
  source: usecasesList,
  isMultiple: true,
});

$('#choose-license').comboTree({
  source: licensesList,
  isMultiple: true,
});

let processing;

async function nextRequest(page) {
  const url = getRequestUrl(
    inputText,
    userSelectedUseCaseList,
    userSelectedLicensesList,
    userSelectedProvidersList,
    page,
  );

  console.log(url);
  const response = await fetch(url);
  const json = await response.json();
  const result = json.results;
  console.log(result);
  addThumbnailsToDOM(result);
  pageNo += 1;
  processing = false;
}

// Trigger nextRequest when we reach bottom of the page
// credit: https://stackoverflow.com/a/10662576/10425980
$(document).ready(() => {
  $(document).scroll(() => {
    if (processing) return false;

    if ($(window).scrollTop() >= $(document).height() - $(window).height() - 700) {
      processing = true;

      nextRequest(pageNo);
    }
    return undefined;
  });
});
