import { fetchSources } from '../utils';
import { elements, appObject } from './base';
import { getCollectionsUrl } from './searchModule';
import { addSpinner, removeSpinner } from './spinner';
import { clearFilters } from './helper';
import { search } from './localUtils';

function searchCollection(event) {
  appObject.pageNo = 1;
  appObject.searchContext = 'collection';
  appObject.searchingNewCollection = true;
  appObject.inputText = '';
  appObject.collectionName = event.target.getAttribute('data-collection-name');

  elements.inputField.value = '';
  elements.headerLogo.click();
  elements.buttonBackToTop.click();

  clearFilters();
  addSpinner(elements.spinnerPlaceholderPrimary, 'original');

  const url = getCollectionsUrl();
  search(url);
}

export default async function loadCollections() {
  if (!appObject.isCollectionSectionRendered) {
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
      td.classList.add('number-cell');
      tRow.appendChild(td);

      // appending current row to table
      table.appendChild(tRow);
    });

    appObject.isCollectionSectionRendered = true;
  } else {
    removeSpinner(elements.spinnerPlaceholderCollections);
  }
}
