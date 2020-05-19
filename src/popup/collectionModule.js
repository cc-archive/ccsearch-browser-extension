import { getLatestSources } from '../utils';
import { elements } from './base';
// eslint-disable-next-line import/no-cycle
import { getCollectionsUrl } from './searchModule';

function searchCollection(event) {
  const collectionName = event.target.getAttribute('data-collection-name');
  const url = getCollectionsUrl(collectionName, 1);
  console.log(url);
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
