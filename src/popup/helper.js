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
  smithsonian: 'Smithsonian Institution',
};

export function getSourceDisplayName(sourceName) {
  if (Object.keys(displayNames).indexOf(sourceName) !== -1) return displayNames[sourceName];
  return sourceName;
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

export function addLoadMoreButton(loadMoreButtonWrapper) {
  loadMoreButtonWrapper.classList.remove('display-none');
}

export function removeLoadMoreButton(loadMoreButtonWrapper) {
  loadMoreButtonWrapper.classList.add('display-none');
}
