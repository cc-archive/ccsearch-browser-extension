// convert Unicode sequence To String. credit: https://stackoverflow.com/a/22021709/10425980
export function unicodeToString(string) {
  if (typeof string !== 'undefined') {
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
