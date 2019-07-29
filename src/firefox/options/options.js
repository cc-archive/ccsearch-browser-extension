import { elements } from '../popup/base';
import { backupProviderAPIQueryStrings } from '../popup/helper';

console.log('options page');

const useCaseInputs = document.querySelector('.use-case').getElementsByTagName('input');
const licenseInputs = document.querySelector('.license').getElementsByTagName('input');
const providerInputs = document.querySelector('.provider').getElementsByTagName('input');
const darkModeInput = document.querySelector('.dark-mode').getElementsByTagName('input');

// Making sure that only license or use-case is selected at the same time
Array.prototype.forEach.call(useCaseInputs, (element) => {
  element.addEventListener('click', (e) => {
    console.log(`${e.target} clicked`);
    if (e.target.checked) {
      Array.prototype.forEach.call(licenseInputs, (licenseElement) => {
        // eslint-disable-next-line no-param-reassign
        licenseElement.checked = false;
      });
    }
  });
});

Array.prototype.forEach.call(licenseInputs, (element) => {
  element.addEventListener('click', (e) => {
    console.log(`${e.target} clicked`);
    if (e.target.checked) {
      Array.prototype.forEach.call(useCaseInputs, (licenseElement) => {
        // eslint-disable-next-line no-param-reassign
        licenseElement.checked = false;
      });
    }
  });
});

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
  restoreFilters(darkModeInput);
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
        status.textContent = 'Saved!';
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
  saveSingleFilter(providerInputs);
  saveSingleFilter(darkModeInput);
}

document.getElementById('save').addEventListener('click', saveFilters);

function addProvidersToDom(providers) {
  const providerWrapper = document.querySelector('.provider');
  providerWrapper.innerText = '';

  Object.keys(providers).forEach((key) => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = providers[key];

    const label = document.createElement('label');
    console.log(input.id);
    label.setAttribute('for', input.id);
    label.innerText = key;

    const breakLine = document.createElement('br');

    providerWrapper.appendChild(input);
    providerWrapper.appendChild(label);
    providerWrapper.appendChild(breakLine);
  });
  restoreFilters(providerInputs);
}

function getLatestProviders() {
  const getProviderURL = 'https://api.creativecommons.engineering/statistics/image';
  let providers = {};

  fetch(getProviderURL)
    .then(data => data.json())
    .then((res) => {
      res.forEach((provider) => {
        providers[provider.display_name] = provider.provider_name;
      });
      addProvidersToDom(providers);
    })
    .catch((error) => {
      console.log(error);
      providers = backupProviderAPIQueryStrings;
      addProvidersToDom(providers);
    });
}

getLatestProviders();

elements.exportBookmarksButton.addEventListener('click', () => {
  // eslint-disable-next-line no-undef
  chrome.storage.local.get({ bookmarks: [] }, (items) => {
    const bookmarksArray = items.bookmarks;
    console.log(bookmarksArray);
    const bookmarksString = JSON.stringify(bookmarksArray);
    // eslint-disable-next-line no-undef
    download(bookmarksString, 'bookmarks.json', 'text/plain');
  });
});

elements.importBookmarksButton.addEventListener('click', () => {
  const file = elements.importBookmarksInput.files[0];
  if (!file) {
    console.log('No file choosen');
  } else if (file.type !== 'application/json') {
    console.log('Wrong file type. Choose json file');
  } else {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (evt) => {
      const fileContents = evt.target.result;
      // TODO: handle JSON parsing errors
      const bookmarksArray = JSON.parse(fileContents);
      if (Array.isArray(bookmarksArray)) {
        if (!bookmarksArray.length > 0) console.log('No bookmark ids found in file');
        else {
          console.log('correct');
        }
      } else console.log('Contents not in valid format of ["id1", "id2", ...]');
    };
  }
});
