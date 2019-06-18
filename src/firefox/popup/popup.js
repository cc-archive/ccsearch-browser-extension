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

// List to hold selected providers
let provider = [];
let licenseAPIQueryStringsList = [];

// Activate the click event on pressing enter.
inputField.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    searchIcon.click();
  }
});

filterIcon.addEventListener('click', () => {
  const filterSection = document.querySelector('.section-filter');
  console.log(filterSection);
  filterSection.classList.toggle('section-filter--active');
});

filterResetButton.addEventListener('click', () => {
  // reset values
  usecaseChooser.value = '';
  licenseChooser.value = '';
  providerChooser.value = '';
  // TODO: make a fresh search and reset all datastrucutes
});

// object to map user applied Provider filter to valid API query string
const providerAPIQueryStrings = {
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
  provider = [];
  licenseAPIQueryStringsList = [];
}

filterApplyButton.addEventListener('click', () => {
  resetFilterDataStructures();
  if (providerChooser.value) {
    const userInputProvidersList = providerChooser.value.split(', ');
    userInputProvidersList.forEach((element) => {
      provider.push(providerAPIQueryStrings[element]);
    });
  }

  if (licenseChooser.value) {
    const userInputLicensesList = licenseChooser.value.split(', ');
    userInputLicensesList.forEach((element) => {
      console.log(element);
      licenseAPIQueryStringsList.push(licenseAPIQueryStrings[element]);
    });
    console.log(licenseAPIQueryStringsList);
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

  console.log(provider);
  const url = `https://api.creativecommons.engineering/image/search?q=${inputText}&pagesize=50&li=${licenseAPIQueryStringsList}&provider=${provider}`;
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

// Providers drop down fields
const providersList = [
  {
    id: 0,
    title: 'Animal Diversity Web',
  },
  {
    id: 1,
    title: 'Bēhance',
  },
  {
    id: 2,
    title: 'Brooklyn Museum',
  },
  {
    id: 3,
    title: 'Culturally Authentic Pictorial Lexicon',
  },
  {
    id: 4,
    title: 'Cleveland Museum Of Art',
  },
  {
    id: 5,
    title: 'DeviantArt',
  },
  {
    id: 6,
    title: 'Digitalt Museum',
  },
  {
    id: 7,
    title: 'Flickr',
  },
  {
    id: 8,
    title: 'Flora-on',
  },
  {
    id: 9,
    title: 'Geograph Britain and Ireland',
  },
  {
    id: 10,
    title: 'Metropolitan Museum of Art',
  },
  {
    id: 11,
    title: 'Museums Victoria',
  },
  {
    id: 12,
    title: 'Science Museum - UK',
  },
  {
    id: 13,
    title: 'Rijksmuseum',
  },
  {
    id: 14,
    title: 'SVG Silh',
  },
  {
    id: 15,
    title: 'Thingiverse',
  },
  {
    id: 16,
    title: 'Thorvaldsens Museum',
  },
  {
    id: 17,
    title: 'World Register of Marine Species',
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

$('#choose-provider').comboTree({
  source: providersList,
  isMultiple: true,
});
