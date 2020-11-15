import { appObject, elements } from './base';
import { getLatestSources, markDefaultFilters, showNotification } from '../utils';
/**
 * @desc Makes input checkboxes for the latest sources and adds them in the filter section.
 */
export async function addSourceFilterCheckboxes() {
  if (elements.sourceCheckboxesWrapper.children.length === 1) {
    appObject.sourcesFromAPI = await getLatestSources();

    const sourceNames = Object.keys(appObject.sourcesFromAPI);

    for (const name of sourceNames) {
      const checkboxElement = document.createElement('input');
      checkboxElement.type = 'checkbox';
      checkboxElement.id = name;

      const labelElement = document.createElement('label');
      labelElement.setAttribute('for', checkboxElement.id);
      labelElement.innerText = appObject.sourcesFromAPI[name];

      const breakElement = document.createElement('br');

      elements.sourceCheckboxesWrapper.appendChild(checkboxElement);
      elements.sourceCheckboxesWrapper.appendChild(labelElement);
      elements.sourceCheckboxesWrapper.appendChild(breakElement);
    }
    markDefaultFilters(elements.sourceCheckboxesWrapper);
    showNotification('Fetched latest sources successfully.', 'positive', 'notification--extension-popup');
  }
}

export function toggleFilterSection(event) {
  if (event.target.id === 'filter-button') appObject.activeSection = 'filter';
  else if (event.target.id === 'close-filters-link') appObject.activeSection = 'search';
  elements.primarySection.classList.toggle('display-none');
  elements.filterSection.classList.toggle('display-none');
}
