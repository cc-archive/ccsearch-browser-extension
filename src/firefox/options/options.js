console.log('options page');

const useCaseInputs = document.querySelector('.use-case').getElementsByTagName('input');
const licenseInputs = document.querySelector('.license').getElementsByTagName('input');

function restoreFilters(inputElements) {
  for (let i = 0; i < inputElements.length; i += 1) {
    const { id } = inputElements[i];
    // eslint-disable-next-line no-undef
    chrome.storage.local.get({ [id]: false }, (items) => {
      // default value is false
      document.getElementById(id).checked = items[id];
    });
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(null, (items) => {
      console.log('all the storage items');
      console.log(items);
    });
  }
}

function init() {
  restoreFilters(useCaseInputs);
  restoreFilters(licenseInputs);
}

document.addEventListener('DOMContentLoaded', init);

function saveSingleFilter(inputElements) {
  for (let i = 0; i < inputElements.length; i += 1) {
    const { id } = inputElements[i];
    const value = inputElements[i].checked;
    // eslint-disable-next-line no-undef
    chrome.storage.local.set(
      {
        [id]: value, // using ES6 to use variable as key of object
      },
      () => {
        const status = document.getElementById('status');
        status.textContent = 'Options Saved!';
        setTimeout(() => {
          status.textContent = '';
        }, 1000);
        console.log(`${id} has been set to ${value}`);
      },
    );
  }
}

function saveFilters() {
  saveSingleFilter(useCaseInputs);
  saveSingleFilter(licenseInputs);
}

document.getElementById('save').addEventListener('click', saveFilters);
