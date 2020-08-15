import { fetchSources } from '../utils';
import { elements } from './base';
// eslint-disable-next-line import/no-cycle
import { getCollectionsUrl, search } from './searchModule';
// eslint-disable-next-line import/no-cycle
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
  elements.headerLogo.click();
  addSpinner(elements.spinnerPlaceholderGrid, 'original');
  search(url);
}

export default async function loadCollections() {
  const sources = await fetchSources();
  removeSpinner(elements.spinnerPlaceholderCollections);
  const table = elements.collectionsSection.getElementsByTagName('table')[0];

  // adding header to the table
  const tableHead = document.createElement('thead');
  const tableHeadRow = document.createElement('tr');
  ['Source', 'Provider', 'Total Items'].forEach(thName => {
    const th = document.createElement('th');
    th.innerText = thName;
    tableHeadRow.appendChild(th);
  });
  tableHead.appendChild(tableHeadRow);
  table.appendChild(tableHead);

  // filling all the sources row by row
  sources.forEach(sourceObject => {
    const tRow = document.createElement('tr');

    // first cell
    let td = document.createElement('td');
    const sourceLink = document.createElement('a');
    sourceLink.setAttribute('data-collection-name', sourceObject.source_name);
    sourceLink.addEventListener('click', searchCollection);
    sourceLink.innerText = sourceObject.display_name;
    td.appendChild(sourceLink);
    tRow.appendChild(td);

    // second cell
    td = document.createElement('td');
    td.innerText = sourceObject.display_name;
    tRow.appendChild(td);

    // third cell
    td = document.createElement('td');
    td.innerText = sourceObject.image_count;
    tRow.appendChild(td);

    // appending current row to table
    table.appendChild(tRow);
  });
}
