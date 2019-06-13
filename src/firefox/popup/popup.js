const inputField = document.getElementById('section-search-input');
const searchIcon = document.getElementById('search-icon');
const errorMessage = document.getElementById('error-message');

// Activate the click event on pressing enter.
inputField.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    searchIcon.click();
  }
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
  } else {
    errorMessage.textContent = '';
  }

  const url = `https://api.creativecommons.engineering/image/search?q=${inputText}&pagesize=50`;

  fetch(url)
    .then(data => data.json())
    .then((res) => {
      const resultArray = res.results;
      console.log(resultArray);

      // remove old images for a new search
      const firstImgCol = document.querySelector('.section-content .first-col .images');
      const secondImgCol = document.querySelector('.section-content .second-col .images');
      const thirdImgCol = document.querySelector('.section-content .third-col .images');

      firstImgCol.innerHTML = '';
      secondImgCol.innerHTML = '';
      thirdImgCol.innerHTML = '';

      let count = 1;

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

        // remove initial content
        const sectionContentParagraph = document.querySelector('.section-content p');
        if (sectionContentParagraph) {
          sectionContentParagraph.parentNode.removeChild(sectionContentParagraph);
        }

        // make an image element
        const imgElement = document.createElement('img');
        imgElement.setAttribute('src', thumbnail);

        // make a span to hold the title
        const spanTitleElement = document.createElement('span');
        spanTitleElement.setAttribute('class', 'image-title');
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
