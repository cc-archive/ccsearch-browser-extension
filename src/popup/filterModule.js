import { appObject, elements } from './base';
import { getLatestSources, markDefaultFilters, showNotification } from '../utils';
import { licenseInfo } from './helper';

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

/**
 * @desc Dynamically populates empty license tool-tip wrappers present in the filters section
 * with their respective explanation.
 */
export function generateLicenseToolTips() {
  elements.tooltipWrappers.forEach(tooltipWrapper => {
    // add event listeners to toggle tool-tip
    tooltipWrapper.addEventListener('click', event => {
      const tooltip = event.currentTarget.querySelector('.tooltip');
      const questionCircleIcon = event.currentTarget.querySelector('.question-circle');

      tooltip.classList.toggle('tooltip-active');
      questionCircleIcon.classList.toggle('has-text-grey');
      questionCircleIcon.classList.toggle('has-text-grey-dark');
    });

    const { licenseName } = tooltipWrapper.dataset;
    const licenseArray = licenseName.split(' ');

    // license heading
    const heading = document.createElement('h5');
    heading.classList.add('b-header');
    heading.innerText =
      licenseName === 'cc0' || licenseName === 'pdm'
        ? licenseName.toUpperCase()
        : `License CC ${licenseArray.join('-').toUpperCase()}`;

    const tooltip = tooltipWrapper.querySelector('.tooltip');

    // license icon and description
    const unorderedList = document.createElement('ul');
    unorderedList.classList.add('margin-vertical-small');

    licenseArray.forEach(license => {
      const listItem = document.createElement('li');
      listItem.classList.add('margin-vertical-small', 'is-flex');

      const icon = document.createElement('i');
      icon.classList.add(
        'icon',
        'has-text-black',
        'has-background-white',
        'is-size-4',
        'margin-right-small',
        `${licenseInfo[license].licenseIcon}`,
      );

      const paragraph = document.createElement('p');
      paragraph.innerText = `${licenseInfo[license].licenseDescription}`;

      listItem.appendChild(icon);
      listItem.appendChild(paragraph);
      unorderedList.appendChild(listItem);
    });

    // "read more about license" text
    const readMoreText = document.createElement('p');
    readMoreText.classList.add('caption', 'is-pulled-right', 'margin-small');
    readMoreText.innerText = 'Read more about the licence ';
    const link = document.createElement('a');
    link.innerText = 'here';
    link.setAttribute('target', '_blank');
    if (licenseName === 'cc0') {
      link.href = 'https://creativecommons.org/publicdomain/zero/1.0/';
    } else if (licenseName === 'pdm') {
      link.href = 'https://creativecommons.org/publicdomain/mark/1.0/';
    } else {
      link.href = `https://creativecommons.org/licenses/${licenseArray.join('-')}/4.0`;
    }
    readMoreText.appendChild(link);

    tooltip.appendChild(heading);
    tooltip.appendChild(unorderedList);
    tooltip.appendChild(readMoreText);
  });
}
