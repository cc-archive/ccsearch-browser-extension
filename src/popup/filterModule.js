import { elements } from './base';
import { backupSourceAPIQueryStrings } from './helper';

function loadUserFilterPreferences(wrapperElement) {
  const inputCheckboxes = wrapperElement.getElementsByTagName('input');
  // unchecking all the options
  for (let i = 0; i < inputCheckboxes.length; i += 1) {
    // data attribute is at the parent span element of input
    const { id } = inputCheckboxes[i];
    chrome.storage.sync.get({ [id]: false }, items => {
      if (items[id]) {
        inputCheckboxes[i].click();
        // elements.filterButton.classList.add('activate-filter');
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
      elements.filterButton.classList.add('activate-filter');
    }
  }
}

// export function loadSourcesToDom(sourceDropDownFields, loadingStoredSearch = false) {
export function loadSourcesToDom(loadingStoredSearch = false) {
  // $('#choose-source').comboTree({
  //   source: sourceDropDownFields,
  //   isMultiple: true,
  // });

  // elements.sourceChooserLoadingMessage.style.display = 'none';
  // elements.sourceChooserWrapper.style.display = 'inline-block';

  if (!loadingStoredSearch) {
    loadUserFilterPreferences(elements.sourceCheckboxesWrapper);
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
  resetFilterDropDown(elements.fileTypeChooserWrapper);
  resetFilterDropDown(elements.imageTypeChooserWrapper);
  resetFilterDropDown(elements.imageSizeChooserWrapper);
  resetFilterDropDown(elements.aspectRatioChooserWrapper);
}

export function loadUserDefaults() {
  loadUserFilterPreferences(elements.useCaseCheckboxesWrapper);
  loadUserFilterPreferences(elements.licenseCheckboxesWrapper);
  loadUserFilterPreferences(elements.fileTypeCheckboxesWrapper);
  loadUserFilterPreferences(elements.imageTypeCheckboxesWrapper);
  loadUserFilterPreferences(elements.imageSizeCheckboxesWrapper);
  loadUserFilterPreferences(elements.aspectRatioCheckboxesWrapper);
}
