const getFullyQualifiedUrl = (path, version) => {
  let baseUrl = 'https://unpkg.com/@creativecommons/vocabulary';
  if (version) {
    baseUrl = `${baseUrl}@${version}`;
  }
  return `${baseUrl}/${path}`;
};

const patchAssetIntoDom = (asset, version = null) => {
  const ajax = new XMLHttpRequest();
  ajax.open('GET', getFullyQualifiedUrl(asset, version), true);
  ajax.onload = () => {
    const div = document.createElement('div');
    // Render SVG in the page
    div.innerHTML = ajax.responseText;
    div.style.display = 'none';
    document.body.insertBefore(div, document.body.childNodes[0]);
  };

  ajax.send();
};

patchAssetIntoDom('/assets/github_corner.svg');
patchAssetIntoDom('/assets/logos/cc/logomark.svg');
patchAssetIntoDom('/assets/logos/cc/letterheart.svg');
