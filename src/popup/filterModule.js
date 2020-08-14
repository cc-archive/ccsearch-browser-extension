import { elements } from './base';

export function loadUserFilterPreferences(wrapperElement) {
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

export function loadUserDefaults() {
  loadUserFilterPreferences(elements.useCaseCheckboxesWrapper);
  loadUserFilterPreferences(elements.licenseCheckboxesWrapper);
  loadUserFilterPreferences(elements.fileTypeCheckboxesWrapper);
  loadUserFilterPreferences(elements.imageTypeCheckboxesWrapper);
  loadUserFilterPreferences(elements.imageSizeCheckboxesWrapper);
  loadUserFilterPreferences(elements.aspectRatioCheckboxesWrapper);
}
