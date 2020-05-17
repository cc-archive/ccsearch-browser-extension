import { getLatestSources } from '../utils';
import { elements } from './base';

function searchCollection(event) {
  console.log(event.target.getAttribute('data-collection-name'));
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
