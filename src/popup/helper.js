// convert Unicode sequence To String. credit: https://stackoverflow.com/a/22021709/10425980
export function unicodeToString(string) {
  if (typeof string === 'string') {
    return string.replace(/\\u[\dA-F]{4}/gi, match => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)));
  }
  return '';
}

// all the provider logo image file names
export const providerLogos = [
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
  'geographorguk_logo.png',
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

export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

// license drop down fields
export const licensesList = [
  {
    id: 'CC0',
    title: 'CC0',
  },
  {
    id: 'Public Domain Mark',
    title: 'Public Domain Mark',
  },
  {
    id: 'BY',
    title: 'BY',
  },
  {
    id: 'BY-SA',
    title: 'BY-SA',
  },
  {
    id: 'BY-NC',
    title: 'BY-NC',
  },
  {
    id: 'BY-ND',
    title: 'BY-ND',
  },
  {
    id: 'BY-NC-SA',
    title: 'BY-NC-SA',
  },
  {
    id: 'BY-NC-ND',
    title: 'BY-NC-ND',
  },
];

// Use-case drop down fields
export const usecasesList = [
  {
    id: 'commercial',
    title: 'I can use commercially',
  },
  {
    id: 'modifiable',
    title: 'I can modify or adapt',
  },
];

// object to map user applied License filter to valid API query string
export const licenseAPIQueryStrings = {
  CC0: 'CC0',
  'Public Domain Mark': 'PDM',
  BY: 'BY',
  'BY-SA': 'BY-SA',
  'BY-NC': 'BY-NC',
  'BY-ND': 'BY-ND',
  'BY-NC-SA': 'BY-NC-SA',
  'BY-NC-ND': 'BY-NC-ND',
};

export const useCaseAPIQueryStrings = {
  'I can use commercially': 'commercial',
  'I can modify or adapt': 'modification',
};

// backup object in case we cannot fetch provider names from the API.
export const backupProviderAPIQueryStrings = {
  'Animal Diversity Web': 'animaldiversity',
  'Brooklyn Museum': 'brooklynmuseum',
  Behance: 'behance',
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

export function removeClassFromElements(elemArray, className) {
  Array.prototype.forEach.call(elemArray, (e) => {
    e.classList.remove(className);
  });
}

export function makeElementsDisplayNone(elemArray) {
  Array.prototype.forEach.call(elemArray, (e) => {
    e.style.display = 'none';
  });
}
