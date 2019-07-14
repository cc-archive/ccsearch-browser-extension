console.log('options page');

const useCaseInputs = document.querySelector('.use-case').getElementsByTagName('input');

function restoreFilters() {
  for (let i = 0; i < useCaseInputs.length; i += 1) {
    const useCase = useCaseInputs[i].id;
    // eslint-disable-next-line no-undef
    chrome.storage.local.get({ [useCase]: false }, (items) => {
      // default value is false
      document.getElementById(useCase).checked = items[useCase];
    });
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(null, (items) => {
      console.log('all the storage items');
      console.log(items);
    });
  }
}

document.addEventListener('DOMContentLoaded', restoreFilters);

function saveFilters() {
  for (let i = 0; i < useCaseInputs.length; i += 1) {
    const useCase = useCaseInputs[i].id;
    const useCaseValue = useCaseInputs[i].checked;
    // eslint-disable-next-line no-undef
    chrome.storage.local.set(
      {
        [useCase]: useCaseValue, // using ES6 to use variable as key of object
      },
      () => {
        const status = document.getElementById('status');
        status.textContent = 'Options Saved!';
        setTimeout(() => {
          status.textContent = '';
        }, 1000);
        console.log(`${useCase} has been set to ${useCaseValue}`);
      },
    );
  }
}

document.getElementById('save').addEventListener('click', saveFilters);
