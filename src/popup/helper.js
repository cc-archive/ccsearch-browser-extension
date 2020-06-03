// convert Unicode sequence To String. credit: https://stackoverflow.com/a/22021709/10425980
export function unicodeToString(string) {
  if (typeof string === 'string') {
    return string.replace(/\\u[\dA-F]{4}/gi, match => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)));
  }
  return '';
}

export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

// id: sets as the data-id of the particulary dropdown entry
// title: text displayed on the UI
export const licenseDropDownFields = [
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

export const useCaseDropDownFields = [
  {
    id: 'commercial',
    title: 'I can use commercially',
  },
  {
    id: 'modification',
    title: 'I can modify or adapt',
  },
];

export const aspectRatioDropDownFields = [
  {
    id: 'tall',
    title: 'Tall',
  },
  {
    id: 'wide',
    title: 'Wide',
  },
  {
    id: 'square',
    title: 'Square',
  },
];

export const fileTypeDropDownFields = [
  {
    id: 'jpeg',
    title: 'JPEGs',
  },
  {
    id: 'png',
    title: 'PNGs',
  },
  {
    id: 'gif',
    title: 'GIFs',
  },
  {
    id: 'svg',
    title: 'SVGs',
  },
];

export const imageTypeDropDownFields = [
  {
    id: 'photograph',
    title: 'Photographs',
  },
  {
    id: 'illustration',
    title: 'Illustrations',
  },
  {
    id: 'digitized_artwork',
    title: 'Digitized Artworks',
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

export const aspectRatioAPIQueryStrings = {
  Tall: 'tall',
  Wide: 'wide',
  Square: 'square',
};

export const fileTypeAPIQueryStrings = {
  JPEGs: 'jpeg',
  PNGs: 'png',
  GIFs: 'gif',
  SVGs: 'svg',
};

export const imageTypeAPIQueryStrings = {
  Photographs: 'photograph',
  Illustrations: 'illustration',
  'Digitized Artworks': 'digitized_artwork',
};

// backup object in case we cannot fetch source names from the API.
export const backupSourceAPIQueryStrings = {
  'Animal Diversity Web': 'animaldiversity',
  'Brooklyn Museum': 'brooklynmuseum',
  Behance: 'behance',
  DeviantArt: 'deviantart',
  'Culturally Authentic Pictorial Lexicon': 'CAPL',
  'Cleveland Museum of Art': 'clevelandmuseum',
  'Digitalt Museum': 'digitaltmuseum',
  Flickr: 'flickr',
  'Geograph Britain and Ireland': 'geographorguk',
  'Flora-On': 'floraon',
  'Metropolitan Museum of Art': 'met',
  'Museums Victoria': 'museumsvictoria',
  'McCord Museum': 'mccordmuseum',
  PhyloPic: 'phylopic',
  'Science Museum - UK': 'sciencemuseum',
  Rijksmuseum: 'rijksmuseum',
  Rawpixel: 'rawpixel',
  'SVG Silh': 'svgsilh',
  Thingiverse: 'thingiverse',
  'Thorvaldsens Museum': 'thorvaldsensmuseum',
  'World Register of Marine Species': 'WoRMS',
  'Wikimedia Commons': 'wikimedia',
  Sketchfab: 'sketchfab',
};

// object that maps source_name to display_name
const displayNames = {
  animaldiversity: 'Animal Diversity Web',
  brooklynmuseum: 'Brooklyn Museum',
  behance: 'Behance',
  deviantart: 'DeviantArt',
  CAPL: 'Culturally Authentic Pictorial Lexicon',
  clevelandmuseum: 'Cleveland Museum of Art',
  digitaltmuseum: 'Digitalt Museum',
  flickr: 'Flickr',
  geographorguk: 'Geograph Britain and Ireland',
  floraon: 'Flora-On',
  met: 'Metropolitan Museum of Art',
  museumsvictoria: 'Museums Victoria',
  mccordmuseum: 'McCord Museum',
  phylopic: 'PhyloPic',
  sciencemuseum: 'Science Museum - UK',
  rijksmuseum: 'Rijksmuseum',
  rawpixel: 'Rawpixel',
  svgsilh: 'SVG Silh',
  thingiverse: 'Thingiverse',
  thorvaldsensmuseum: 'Thorvaldsens Museum',
  WoRMS: 'World Register of Marine Species',
  wikimedia: 'Wikimedia Commons',
  sketchfab: 'Sketchfab',
};

export function getSourceDisplayName(sourceName) {
  return displayNames[sourceName];
}

export function removeClassFromElements(elemArray, className) {
  Array.prototype.forEach.call(elemArray, e => {
    e.classList.remove(className);
  });
}

export function makeElementsDisplayNone(elemArray) {
  Array.prototype.forEach.call(elemArray, e => {
    e.style.display = 'none';
  });
}

export function addLoadMoreButton(loadMoreButtonPlaceholder) {
  loadMoreButtonPlaceholder.classList.remove('display-none');
}

export function removeLoadMoreButton(loadMoreButtonPlaceholder) {
  loadMoreButtonPlaceholder.classList.add('display-none');
}
