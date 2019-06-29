/* eslint-disable no-shadow */
// selectors
const inputField = document.getElementById('section-search-input');
const searchIcon = document.getElementById('search-icon');
const filterIcon = document.getElementById('filter-icon');
const errorMessage = document.getElementById('error-message');
const spinner = document.getElementById('spinner');
const useCaseChooser = document.querySelector('#choose-usecase');
const licenseChooser = document.querySelector('#choose-license');
const providerChooser = document.querySelector('#choose-provider');
const licenseChooserWrapper = document.querySelector(
  '.section-filter__filter-wrapper--choose-license',
);
const useCaseChooserWrapper = document.querySelector(
  '.section-filter__filter-wrapper--choose-usecase',
);
const providerChooserWrapper = document.querySelector(
  '.section-filter__filter-wrapper--choose-provider',
);
const providerChooserLoadingMessage = document.querySelector(
  '.section-filter__provider-loading-mes',
);
const filterResetButton = document.querySelector('.section-filter--reset-button');
const filterApplyButton = document.querySelector('.section-filter--apply-button');
const noMoreImagesMessage = document.querySelector('.no-more-images-mes');

let inputText;
let pageNo;
// list to hold Providers to show to the user in dropdown
// the list must have objects with id and title as properties.
// see https://github.com/kirlisakal/combo-tree#sample-json-data
const providersList = [];

// List to hold providers selected by the user from the drop down.
let userSelectedProvidersList = [];

// List to hold user selected licenses
let userSelectedLicensesList = [];

// List to hold user selected use case
let userSelectedUseCaseList = [];

// object to map Provider display names to valid query names.
let providerAPIQueryStrings = {};

// bakup object in case we cannot fetch provider names from the API.
const backupProviderAPIQueryStrings = {
  'Animal Diversity Web': 'animaldiversity',
  'Brooklyn Museum': 'brooklynmuseum',
  Bēhance: 'behance',
  DeviantArt: 'deviantart',
  'Culturally Authentic Pictorial Lexicon': 'CAPL',
  'Cleveland Museum Of Art': 'clevelandmuseum',
  'Digitalt Museum': 'digitaltmuseum',
  Flickr: 'flickr',
  'Geograph Britain and Ireland': 'geographorguk',
  'Flora-on': 'floraon',
  'Metropolitan Museum of Art': 'met',
  'Museums Victoria': 'museumsvictoria',
  'Science Museum - UK': 'sciencemuseum',
  Rijksmuseum: 'rijksmuseum',
  'SVG Silh': 'svgsilh',
  Thingiverse: 'thingiverse',
  'Thorvaldsens Museum': 'thorvaldsensmuseum',
  'World Register of Marine Species': 'WoRMS',
};

// all the provider logo image file names
const providerLogos = [
  '500px_logo.png',
  'animaldiversity_logo.png',
  'brooklynmuseum_logo.png',
  'behance_logo.svg',
  'CAPL_logo.png',
  'clevelandmuseum_logo.png',
  'deviantart_logo.png',
  'digitaltmuseum_logo.png',
  'eol_logo.png',
  'flickr_logo.png',
  'floraon_logo.png',
  'geographorguk_logo.gif',
  'iha_logo.png',
  'mccordmuseum_logo.png',
  'met_logo.png',
  'museumsvictoria_logo.svg',
  'nypl_logo.svg',
  'rawpixel_logo.png',
  'rijksmuseum_logo.png',
  'sciencemuseum_logo.svg',
  'svgsilh_logo.png',
  'thingiverse_logo.png',
  'thorvaldsensmuseum_logo.png',
  'WoRMS_logo.png',
];

// Activate the click event on pressing enter.
inputField.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    searchIcon.click();
  }
});

// Helper Functions

// convert Unicode sequence To String. credit: https://stackoverflow.com/a/22021709/10425980
function unicodeToString(string) {
  if (typeof string !== 'undefined') {
    return string.replace(/\\u[\dA-F]{4}/gi, match => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)));
  }
  return '';
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function getRequestUrl(
  inputText,
  userSelectedUseCaseList,
  userSelectedLicensesList,
  userSelectedProvidersList,
  page,
) {
  if (userSelectedUseCaseList.length > 0) {
    return `https://api.creativecommons.engineering/image/search?q=${inputText}&page=${page}&pagesize=20&lt=${userSelectedUseCaseList}&provider=${userSelectedProvidersList}`;
  }
  return `https://api.creativecommons.engineering/image/search?q=${inputText}&page=${page}&pagesize=20&li=${userSelectedLicensesList}&provider=${userSelectedProvidersList}`;
}

function checkInputError(inputText) {
  if (inputText === '') {
    errorMessage.textContent = 'Please enter a search query';
    throw new Error('Please enter a search query');
  } else {
    errorMessage.textContent = '';
  }
}

function removeInitialContent() {
  const sectionContentParagraph = document.querySelector('.section-content p');
  if (sectionContentParagraph) {
    sectionContentParagraph.parentNode.removeChild(sectionContentParagraph);
  }
}

function removeOldSearchResults() {
  // remove old images for a new search
  const firstImgCol = document.querySelector('.section-content .first-col .images');
  const secondImgCol = document.querySelector('.section-content .second-col .images');
  const thirdImgCol = document.querySelector('.section-content .third-col .images');

  firstImgCol.innerHTML = '';
  secondImgCol.innerHTML = '';
  thirdImgCol.innerHTML = '';
}

const elem = document.querySelector('.grid');
// eslint-disable-next-line no-undef
const msnry = new Masonry(elem, {
  // options
  itemSelector: '.grid-item',
  columnWidth: '.grid-item',
  gutter: '.gutter-sizer',
  percentPosition: true,
  transitionDuration: '0.4s',
});

function showNoResultFoundMessage() {
  const sectionContent = document.querySelector('.section-content');
  const noResultFoundPara = document.createElement('p');
  noResultFoundPara.textContent = 'No result Found. Please try a different search query.';
  sectionContent.appendChild(noResultFoundPara);
}

function checkResultLength(resultArray) {
  if (resultArray.length === 0) {
    showNoResultFoundMessage();
  }
}

function removeLoderAnimation() {
  spinner.classList.remove('spinner');
  noMoreImagesMessage.classList.remove('display-none');
}

function getMaxOrMinElem(arr, option) {
  // option = 0 for min, 1 for max;
  console.log(arr);
  if (arr.length === 0) {
    return -1;
  }

  let elem = arr[0];
  // let index = 0;

  for (let i = 1; i < arr.length; i += 1) {
    if (option === 0) {
      if (arr[i] < elem) {
        // index = i;
        elem = arr[i];
      }
    } else if (option === 1) {
      if (arr[i] > elem) {
        // index = i;
        elem = arr[i];
      }
    }
  }
  console.log(elem);

  return elem;
}

function checkPriority(columnHeights) {
  const max = getMaxOrMinElem(columnHeights, 1);
  const min = getMaxOrMinElem(columnHeights, 0);
  const difference = max - min;

  if (difference > 400 && difference < 1000) {
    return [columnHeights.indexOf(min), 3];
  }
  if (difference > 1000 && difference < 2000) {
    return [columnHeights.indexOf(min), 7];
  }
  if (difference > 2000) {
    return [columnHeights.indexOf(min), 11];
  }

  return [0, 0];
}

function appendImageToDom(columnNo, divElement) {
  let column;
  if (columnNo === 0) column = '.first-col';
  if (columnNo === 1) column = '.second-col';
  if (columnNo === 2) column = '.third-col';
  document.querySelector(`.section-content ${column} .images`).appendChild(divElement);
}

function addThumbnailsToDOM(resultArray) {
  let count = 1;

  const firstColHeight = document.querySelector('.first-col').clientHeight;
  const secondColHeight = document.querySelector('.second-col').clientHeight;
  const thirdColHeight = document.querySelector('.third-col').clientHeight;

  const columnSizeArray = [firstColHeight, secondColHeight, thirdColHeight];
  console.log(columnSizeArray);

  const priorityArray = checkPriority(columnSizeArray);
  console.log(priorityArray);

  for (let i = 0; i < resultArray.length; i += 1) {
    const element = resultArray[i];
    const thumbnail = element.thumbnail ? element.thumbnail : element.url;
    const title = unicodeToString(element.title);
    const { license } = element;
    const licenseArray = license.split('-'); // split license in individual characteristics
    const foreignLandingUrl = element.foreign_landing_url;
    const { provider } = element;

    // make an image element
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', thumbnail);

    // make a span to hold the title
    const spanTitleElement = document.createElement('span');
    spanTitleElement.setAttribute('class', 'image-title');
    spanTitleElement.setAttribute('title', title);
    const imageTitleNode = document.createTextNode(title);

    const foreignLandingLinkElement = document.createElement('a');
    foreignLandingLinkElement.setAttribute('href', foreignLandingUrl);
    foreignLandingLinkElement.setAttribute('target', '_blank');
    foreignLandingLinkElement.setAttribute('class', 'foreign-landing-url');

    const providerImageElement = document.createElement('img');
    let providerLogoName;
    for (let i = 0; i < providerLogos.length; i += 1) {
      if (providerLogos[i].includes(provider)) {
        providerLogoName = providerLogos[i];
        break;
      }
    }
    providerImageElement.setAttribute('src', `img/provider_logos/${providerLogoName}`);
    providerImageElement.setAttribute('class', 'provider-image');

    foreignLandingLinkElement.appendChild(providerImageElement);
    foreignLandingLinkElement.appendChild(imageTitleNode);

    spanTitleElement.appendChild(foreignLandingLinkElement);

    // make a span to hold the license icons
    const spanLicenseElement = document.createElement('span');
    spanLicenseElement.setAttribute('class', 'image-license');

    // make a link to license description
    const licenseLinkElement = document.createElement('a');
    licenseLinkElement.setAttribute('href', `https://creativecommons.org/licenses/${license}/2.0/`);
    licenseLinkElement.setAttribute('target', '_blank'); // open link in new tab
    licenseLinkElement.setAttribute('title', license); // open link in new tab

    // Array to hold license image elements
    const licenseIconElementsArray = [];

    // Add the default cc icon
    let licenseIconElement = document.createElement('img');
    licenseIconElement.setAttribute('src', 'img/license_logos/cc_icon.svg');
    licenseIconElement.setAttribute('alt', 'cc_icon');
    licenseIconElementsArray.push(licenseIconElement);

    // make and push license image elements
    licenseArray.forEach((name) => {
      licenseIconElement = document.createElement('img');
      licenseIconElement.setAttribute('src', `img/license_logos/cc-${name}_icon.svg`);
      licenseIconElement.setAttribute('alt', `cc-${name}_icon`);
      licenseIconElementsArray.push(licenseIconElement);
    });

    licenseIconElementsArray.forEach((licenseIcon) => {
      licenseLinkElement.appendChild(licenseIcon);
    });
    spanLicenseElement.appendChild(licenseLinkElement);

    // make an div element to encapsulate image element
    const divElement = document.createElement('div');
    divElement.setAttribute('class', 'image');

    divElement.appendChild(imgElement);
    divElement.appendChild(spanTitleElement);
    divElement.appendChild(spanLicenseElement);

    // count = balanceImageColHeight() + 1;
    if (priorityArray[1] > 0) {
      appendImageToDom(priorityArray[0], divElement);
      priorityArray[1] -= 1;
      // eslint-disable-next-line no-continue
      continue;
    }

    // // fill the grid
    if (count === 1) {
      // document.querySelector('.section-content .first-col .images').appendChild(divElement);
      appendImageToDom(0, divElement);
      count += 1;
    } else if (count === 2) {
      // document.querySelector('.section-content .second-col .images').appendChild(divElement);
      appendImageToDom(1, divElement);
      count += 1;
    } else if (count === 3) {
      // document.querySelector('.section-content .third-col .images').appendChild(divElement);
      appendImageToDom(2, divElement);
      count += 1;
      count = 1;
    }
  }

  if (resultArray.length <= 10) {
    removeLoderAnimation();
  }
}

function populateProviderList(providerAPIQuerystrings) {
  let count = 0;
  // iterating over provider object
  Object.keys(providerAPIQuerystrings).forEach((key) => {
    providersList[count] = {
      id: count,
      title: key,
    };
    count += 1;
  });

  console.log(providersList);

  $('#choose-provider').comboTree({
    source: providersList,
    isMultiple: true,
  });

  providerChooserLoadingMessage.style.display = 'none';
  providerChooserWrapper.style.display = 'inline-block';
}

filterIcon.addEventListener('click', () => {
  const filterSection = document.querySelector('.section-filter');
  filterSection.classList.toggle('section-filter--active');

  const getProviderURL = 'https://api.creativecommons.engineering/statistics/image';

  console.log(providerAPIQueryStrings);

  if (isObjectEmpty(providerAPIQueryStrings)) {
    console.log('inside provider fetch');
    fetch(getProviderURL)
      .then(data => data.json())
      .then((res) => {
        console.log(res);
        res.forEach((provider) => {
          providerAPIQueryStrings[provider.display_name] = provider.provider_name;
        });
        console.log(providerAPIQueryStrings);
        populateProviderList(providerAPIQueryStrings);
      })
      .catch((error) => {
        console.log(error);
        console.log('in catch block');
        providerAPIQueryStrings = backupProviderAPIQueryStrings;
        populateProviderList(providerAPIQueryStrings);
      });
  }
});

// TODO: divide the steps into functions
filterResetButton.addEventListener('click', () => {
  // reset values
  useCaseChooser.value = '';
  licenseChooser.value = '';
  providerChooser.value = '';

  // array of dropdown container elements
  const dropdownElementsList = [
    providerChooserWrapper,
    licenseChooserWrapper,
    useCaseChooserWrapper,
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
  searchIcon.click();
  console.log(userSelectedLicensesList);
  console.log(userSelectedProvidersList);
});

function resetLicenseDropDown() {
  licenseChooser.value = '';

  const dropdownContainer = licenseChooserWrapper.querySelector('.comboTreeDropDownContainer');
  const inputCheckboxes = dropdownContainer.getElementsByTagName('input');
  // unchecking all the options
  for (let i = 0; i < inputCheckboxes.length; i += 1) {
    // using click to uncheck the box as setting checked=false also works visually
    if (inputCheckboxes[i].checked) {
      inputCheckboxes[i].click();
    }
  }

  // clear the datastructures and make a fresh search
  userSelectedLicensesList = [];
}
// object to map user applied License filter to valid API query string
const licenseAPIQueryStrings = {
  CC0: 'CC0',
  'Public Domain Mark': 'PDM',
  BY: 'BY',
  'BY-SA': 'BY-SA',
  'BY-NC': 'BY-NC',
  'BY-ND': 'BY-ND',
  'BY-NC-SA': 'BY-NC-SA',
  'BY-NC-ND': 'BY-NC-ND',
};

const useCaseAPIQueryStrings = {
  'I can use commercially': 'commercial',
  'I can modify or adapt': 'modification',
};

function resetFilterDataStructures() {
  userSelectedProvidersList = [];
  userSelectedLicensesList = [];
  userSelectedUseCaseList = [];
}

// block to disable license dropdown, when atleast one of use-case checkboxes are checked
useCaseChooserWrapper.addEventListener(
  'click',
  (event) => {
    console.log('capture event occured');
    const useCaseDropDownContainer = useCaseChooserWrapper.querySelector(
      '.comboTreeDropDownContainer',
    );
    const inputCheckboxes = useCaseDropDownContainer.getElementsByTagName('input');

    let flag = 0;
    if (event.target.classList.contains('comboTreeItemTitle')) {
      // only checking checkbox elements
      if (!event.target.querySelector('input').checked) {
        // if the clicked checkbox is unchecked
        resetLicenseDropDown();
        // disable the license dropdown (as atleast one checkbox is checked)
        licenseChooser.disabled = true;
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
          licenseChooser.disabled = true;
          flag = 1;
        }
      }
    }
    if (!flag) {
      // if none of the checkbox is checked
      if (licenseChooser.disabled) {
        // enable the license dropdown if it is not already.
        licenseChooser.disabled = false;
      }
    }
  },
  true, // needed to make the event trigger during capturing phase
  // (https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)
);

filterApplyButton.addEventListener('click', () => {
  resetFilterDataStructures();
  if (providerChooser.value) {
    const userInputProvidersList = providerChooser.value.split(', ');
    userInputProvidersList.forEach((element) => {
      userSelectedProvidersList.push(providerAPIQueryStrings[element]);
    });
  }

  if (licenseChooser.value) {
    const userInputLicensesList = licenseChooser.value.split(', ');
    userInputLicensesList.forEach((element) => {
      console.log(element);
      userSelectedLicensesList.push(licenseAPIQueryStrings[element]);
    });
    console.log(userSelectedLicensesList);
  }

  if (useCaseChooser.value) {
    const userInputUseCaseList = useCaseChooser.value.split(', ');
    userInputUseCaseList.forEach((element) => {
      console.log(element);
      userSelectedUseCaseList.push(useCaseAPIQueryStrings[element]);
    });
    console.log(userSelectedUseCaseList);
  }
  searchIcon.click();
});

searchIcon.addEventListener('click', () => {
  inputText = inputField.value;
  pageNo = 1;

  checkInputError(inputText);
  removeInitialContent();
  removeOldSearchResults();

  // enable spinner
  spinner.classList.add('spinner');

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

// license drop down fields
const licensesList = [
  {
    id: 0,
    title: 'CC0',
  },
  {
    id: 1,
    title: 'Public Domain Mark',
  },
  {
    id: 2,
    title: 'BY',
  },
  {
    id: 3,
    title: 'BY-SA',
  },
  {
    id: 4,
    title: 'BY-NC',
  },
  {
    id: 5,
    title: 'BY-ND',
  },
  {
    id: 6,
    title: 'BY-NC-SA',
  },
  {
    id: 7,
    title: 'BY-NC-ND',
  },
];

// Use-case drop down fields
const usecasesList = [
  {
    id: 0,
    title: 'I can use commercially',
  },
  {
    id: 1,
    title: 'I can modify or adapt',
  },
];

// applying comboTree (see https://github.com/kirlisakal/combo-tree)
$('#choose-usecase').comboTree({
  source: usecasesList,
  isMultiple: true,
});

$('#choose-license').comboTree({
  source: licensesList,
  isMultiple: true,
});

// $('#choose-provider').comboTree({
//   source: providersList,
//   isMultiple: true,
// });

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
