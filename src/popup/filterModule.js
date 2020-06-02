import { elements } from './base';
import { backupSourceAPIQueryStrings } from './helper';

// list to hold Sources to show to the user in dropdown
// the list must have objects with id and title as properties.
// see https://github.com/kirlisakal/combo-tree#sample-json-data
function loadUserFilterPreferences(wrapperElement) {
  const dropdownContainer = wrapperElement.querySelector('.comboTreeDropDownContainer');
  const inputCheckboxes = dropdownContainer.getElementsByTagName('input');
  // unchecking all the options
  for (let i = 0; i < inputCheckboxes.length; i += 1) {
    // data attribute is at the parent span element of input
    const id = inputCheckboxes[i].parentElement.getAttribute('data-id');
    chrome.storage.sync.get({ [id]: false }, items => {
      if (items[id]) {
        inputCheckboxes[i].click();
        elements.filterIcon.classList.add('activate-filter');
      }
    });
  }
}

export function toggleOnFilterDropDownCheckboxes(wrapperElement, items) {
  const dropdownContainer = wrapperElement.querySelector('.comboTreeDropDownContainer');
  const inputCheckboxes = dropdownContainer.getElementsByTagName('input');
  for (let i = 0; i < inputCheckboxes.length; i += 1) {
    const id = inputCheckboxes[i].parentElement.getAttribute('data-id');
    if (items[id]) {
      inputCheckboxes[i].click();
      elements.filterIcon.classList.add('activate-filter');
    }
  }
}

export function loadSourcesToDom(SourcesList, loadingStoredSearch = false) {
  $('#choose-source').comboTree({
    source: SourcesList,
    isMultiple: true,
  });

  elements.sourceChooserLoadingMessage.style.display = 'none';
  elements.sourceChooserWrapper.style.display = 'inline-block';

  if (!loadingStoredSearch) {
    loadUserFilterPreferences(elements.sourceChooserWrapper);
  } else {
    const activeSourceOptions = {};
    elements.sourceChooser.value.split(', ').forEach(source => {
      activeSourceOptions[backupSourceAPIQueryStrings[source]] = true;
      window.appObject.userSelectedSourcesList.push(window.appObject.sourceAPIQueryStrings[source]);
    });
    toggleOnFilterDropDownCheckboxes(elements.sourceChooserWrapper, activeSourceOptions);
  }
}

export function resetLicenseDropDown() {
  elements.licenseChooser.value = '';

  const dropdownContainer = elements.licenseChooserWrapper.querySelector('.comboTreeDropDownContainer');
  const inputCheckboxes = dropdownContainer.getElementsByTagName('input');
  // unchecking all the options
  for (let i = 0; i < inputCheckboxes.length; i += 1) {
    // using click to uncheck the box as setting checked=false also works visually
    if (inputCheckboxes[i].checked) {
      inputCheckboxes[i].click();
    }
  }
}

export function resetFilterDropDown(wrapperElement) {
  console.log('reset function called');
  const dropdownContainer = wrapperElement.querySelector('.comboTreeDropDownContainer');
  const inputCheckboxes = dropdownContainer.getElementsByTagName('input');
  // unchecking all the options
  for (let i = 0; i < inputCheckboxes.length; i += 1) {
    // using click to uncheck the box as setting checked=false also works visually
    if (inputCheckboxes[i].checked) {
      inputCheckboxes[i].click();
    }
  }
}

export function resetAllFilterDropDowns() {
  resetFilterDropDown(elements.useCaseChooserWrapper);
  resetFilterDropDown(elements.licenseChooserWrapper);
  resetFilterDropDown(elements.sourceChooserWrapper);
}

export function loadUserDefaults() {
  loadUserFilterPreferences(elements.useCaseChooserWrapper);
  loadUserFilterPreferences(elements.licenseChooserWrapper);
}
