import { getLatestSources } from '../utils';
import { elements } from './base';
// eslint-disable-next-line import/no-cycle
import { getCollectionsUrl, search } from './searchModule';
// eslint-disable-next-line import/no-cycle
import { toggleOnFilterDropDownCheckboxes, resetAllFilterDropDowns } from './filterModule';
import { addSpinner, removeSpinner } from './spinner';

function searchCollection(event) {
  window.appObject.pageNo = 1;
  window.appObject.searchByCollectionActivated = true;
  window.appObject.searchingNewCollection = true;
  window.appObject.inputText = '';
  window.appObject.collectionName = event.target.getAttribute('data-collection-name');
  const url = getCollectionsUrl(
    window.appObject.collectionName,
    window.appObject.pageNo,
    window.appObject.enableMatureContent,
  );
  const items = {};
  items[window.appObject.collectionName] = true;
  elements.inputField.value = '';
  resetAllFilterDropDowns();
  toggleOnFilterDropDownCheckboxes(elements.sourceChooserWrapper, items);
  elements.homeIcon.click();
  addSpinner(elements.spinnerPlaceholderGrid, 'original');
  search(url);
}

export default async function loadCollections() {
  const sources = await getLatestSources();
  removeSpinner(elements.spinnerPlaceholderCollections);
  Object.keys(sources).forEach(key => {
    const link = document.createElement('a');
    link.href = '#';
    const sourceName = document.createTextNode(key);
    link.appendChild(sourceName);
    link.setAttribute('data-collection-name', sources[key]);
    link.addEventListener('click', searchCollection);
    link.classList.add('has-background-grey-light');

    elements.collectionsSectionBody.appendChild(link);
  });
}
