import { elements } from './base';

// list to hold Providers to show to the user in dropdown
// the list must have objects with id and title as properties.
// see https://github.com/kirlisakal/combo-tree#sample-json-data
const providersList = [];

function loadFilterSection(wrapperElement) {
  console.log('loading defaults');
  const dropdownContainer = wrapperElement.querySelector('.comboTreeDropDownContainer');
  const inputCheckboxes = dropdownContainer.getElementsByTagName('input');
  // unchecking all the options
  for (let i = 0; i < inputCheckboxes.length; i += 1) {
    // data attribute is at the parent span element of input
    const id = inputCheckboxes[i].parentElement.getAttribute('data-id');
    chrome.storage.local.get({ [id]: false }, (items) => {
      if (items[id]) {
        inputCheckboxes[i].click();
      }
    });
  }
}

export function populateProviderList(providerAPIQuerystrings) {
  let count = 0;
  // iterating over provider object
  Object.keys(providerAPIQuerystrings).forEach((key) => {
    providersList[count] = {
      id: providerAPIQuerystrings[key],
      title: key,
    };
    count += 1;
  });

  console.log(providersList);

  $('#choose-provider').comboTree({
    source: providersList,
    isMultiple: true,
  });

  elements.providerChooserLoadingMessage.style.display = 'none';
  elements.providerChooserWrapper.style.display = 'inline-block';
  loadFilterSection(elements.providerChooserWrapper);
}

export function resetLicenseDropDown() {
  elements.licenseChooser.value = '';

  const dropdownContainer = elements.licenseChooserWrapper.querySelector(
    '.comboTreeDropDownContainer',
  );
  const inputCheckboxes = dropdownContainer.getElementsByTagName('input');
  // unchecking all the options
  for (let i = 0; i < inputCheckboxes.length; i += 1) {
    // using click to uncheck the box as setting checked=false also works visually
    if (inputCheckboxes[i].checked) {
      inputCheckboxes[i].click();
    }
  }
}

export function loadUserDefaults() {
  loadFilterSection(elements.useCaseChooserWrapper);
  loadFilterSection(elements.licenseChooserWrapper);
}
