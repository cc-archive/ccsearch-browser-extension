import { appObject, elements } from './base';
import { getLatestSources, markDefaultFilters, showNotification } from '../utils';
import { tooltipInfo } from './helper';
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
    showNotification('Fetched latest sources succcessfully.', 'positive', 'notification--extension-popup');
  }
}

export function toggleFilterSection(event) {
  if (event.target.id === 'filter-button') appObject.activeSection = 'filter';
  else if (event.target.id === 'close-filters-link') appObject.activeSection = 'search';
  elements.primarySection.classList.toggle('display-none');
  elements.filterSection.classList.toggle('display-none');
}

export function tooltiGen(self){
  var pathId = self.getAttribute("data-id");
  var heading = tooltipInfo[pathId]['tooltipHeading'];
  var content = tooltipInfo[pathId]['tooltipContent'];
  var html="";
    html+=`<b>${heading}</b><p>${content}</p><br/><p class="caption is-pulled-right margin-small">Read more about the tool <a href='#'>here</a></p>`
    
     document.getElementById(`${pathId}-gen`).innerHTML = html;
 }
