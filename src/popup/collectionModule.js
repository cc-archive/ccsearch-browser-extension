import { getLatestSources, removeNode } from '../utils';
import { elements } from './base';
// eslint-disable-next-line import/no-cycle
import { getCollectionsUrl, removeOldSearchResults, search } from './searchModule';
// eslint-disable-next-line import/no-cycle

function searchCollection(event) {
  window.appObject.pageNo = 1;
  window.appObject.searchByCollection = true;
  window.appObject.collectionName = event.target.getAttribute('data-collection-name');
  const url = getCollectionsUrl(window.appObject.collectionName, window.appObject.pageNo);
  elements.homeIcon.click();
  removeNode('primary__initial-info');
  removeNode('no-image-found');
  removeOldSearchResults();
  search(url);
}

export default async function loadCollections() {
  const sources = await getLatestSources();
  Object.keys(sources).forEach(key => {
    const link = document.createElement('a');
    link.href = '#';
    const sourceName = document.createTextNode(key);
    link.appendChild(sourceName);
    link.setAttribute('data-collection-name', sources[key]);
    const br = document.createElement('br');
    link.addEventListener('click', searchCollection);

    elements.collectionsSectionBody.appendChild(link);
    elements.collectionsSectionBody.appendChild(br);
  });
}
