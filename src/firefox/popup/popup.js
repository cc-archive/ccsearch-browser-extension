// selectors
const inputField = document.getElementById('section-search-input');
const searchIcon = document.getElementById('search-icon');
const filterIcon = document.getElementById('filter-icon');
const errorMessage = document.getElementById('error-message');
const spinner = document.getElementById('spinner');
const usecaseChooser = document.querySelector('#choose-usecase');
const licenseChooser = document.querySelector('#choose-license');
const providerChooser = document.querySelector('#choose-provider');
const filterResetButton = document.querySelector('.section-filter--reset-button');
const filterApplyButton = document.querySelector('.section-filter--apply-button');

// list to hold Providers to show to the user in dropdown
// the list must have objects with id and title as properties.
// see https://github.com/kirlisakal/combo-tree#sample-json-data
const providersList = [];

// List to hold providers selected by the user from the drop down.
let userSelectedProvidersList = [];

// List to hold user selected licenses
let userSelectedLicensesList = [];

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

// Activate the click event on pressing enter.
inputField.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    searchIcon.click();
  }
});

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
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

filterResetButton.addEventListener('click', () => {
  // reset values
  usecaseChooser.value = '';
  licenseChooser.value = '';
  providerChooser.value = '';
  // TODO: make a fresh search and reset all datastrucutes
});

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

function resetFilterDataStructures() {
  userSelectedProvidersList = [];
  userSelectedLicensesList = [];
}

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
  searchIcon.click();
});

// convert Unicode sequence To String. credit: https://stackoverflow.com/a/22021709/10425980
function unicodeToString(string) {
  if (typeof string !== 'undefined') {
    return string.replace(/\\u[\dA-F]{4}/gi, match => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)));
  }
  return '';
}

searchIcon.addEventListener('click', () => {
  const inputText = inputField.value;

  if (inputText === '') {
    errorMessage.textContent = 'Please enter a search query';
    throw new Error('Please enter a search query');
  } else {
    errorMessage.textContent = '';
  }

  // remove initial content
  const sectionContentParagraph = document.querySelector('.section-content p');
  if (sectionContentParagraph) {
    sectionContentParagraph.parentNode.removeChild(sectionContentParagraph);
  }

  // remove old images for a new search
  const firstImgCol = document.querySelector('.section-content .first-col .images');
  const secondImgCol = document.querySelector('.section-content .second-col .images');
  const thirdImgCol = document.querySelector('.section-content .third-col .images');

  firstImgCol.innerHTML = '';
  secondImgCol.innerHTML = '';
  thirdImgCol.innerHTML = '';

  // enable spinner
  spinner.classList.add('spinner');

  const url = `https://api.creativecommons.engineering/image/search?q=${inputText}&pagesize=50&li=${userSelectedLicensesList}&provider=${userSelectedProvidersList}`;
  console.log(url);

  fetch(url)
    .finally(() => {
      // removes spinner even if promise is not resolved
      spinner.classList.remove('spinner');
    })

    .then(data => data.json())
    .then((res) => {
      const resultArray = res.results;
      console.log(resultArray);

      let count = 1;

      if (resultArray.length === 0) {
        const sectionContent = document.querySelector('.section-content');
        const noResultFoundPara = document.createElement('p');
        noResultFoundPara.textContent = 'No result Found. Please try a different search query.';
        sectionContent.appendChild(noResultFoundPara);
      }

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

      resultArray.forEach((element) => {
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
        licenseLinkElement.setAttribute(
          'href',
          `https://creativecommons.org/licenses/${license}/2.0/`,
        );
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

        // fill the grid
        if (count === 1) {
          document.querySelector('.section-content .first-col .images').appendChild(divElement);
          count += 1;
        } else if (count === 2) {
          document.querySelector('.section-content .second-col .images').appendChild(divElement);
          count += 1;
        } else if (count === 3) {
          document.querySelector('.section-content .third-col .images').appendChild(divElement);
          count = 1;
        }
      });
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
