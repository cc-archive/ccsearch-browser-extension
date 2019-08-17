import { backupProviderAPIQueryStrings } from './popup/helper';

export function showNotification(message, context, snackbarPlaceholderId) {
  const snackbar = document.getElementById(snackbarPlaceholderId);
  snackbar.innerText = message;

  snackbar.classList.add('show');
  if (context === 'positive') snackbar.classList.add('snackbar-positive');
  else if (context === 'negative') snackbar.classList.add('snackbar-negative');

  setTimeout(() => {
    snackbar.className = '';
    snackbar.classList.add('snackbar');
  }, 1100);
}

export function removeNode(className) {
  const sectionContentParagraph = document.querySelector(`.${className}`);
  if (sectionContentParagraph) {
    sectionContentParagraph.parentNode.removeChild(sectionContentParagraph);
  }
}

export function restoreInitialContent(context) {
  const sectionContent = document.querySelector(`.section-content--${context}`);

  const sectionContentInitialInfo = document.querySelector(
    `.section-content--${context} .initial-info`,
  );

  if (!sectionContentInitialInfo) {
    let initialInfoElement;
    if (context === 'primary') {
      initialInfoElement = `<p class="initial-info primary__initial-info">
              Search for free content in the public domain and under Creative Commons licenses.<br /><br />
              Learn more about CC licenses
              <a href="https://creativecommons.org/share-your-work/licensing-types-examples/" target="_blank">
                here.
              </a><br>
              License your own content
              <a href="https://creativecommons.org/choose/" target="_blank">
                here.
              </a>
            </p>`;
    } else if (context === 'bookmarks') {
      initialInfoElement = `<p class="initial-info bookmarks__initial-info">
              No Bookmarks yet
            </p>`;
    }
    sectionContent.querySelector('.row').innerHTML = initialInfoElement;
  }
}

export async function fetchProviders() {
  const getProviderURL = 'https://api.creativecommons.engineering/statistics/image';
  const data = await fetch(getProviderURL);
  // console.log(data);

  return data.json();
}

export async function getLatestProviders() {
  let providers = {};
  try {
    const result = await fetchProviders();
    result.forEach((provider) => {
      providers[provider.display_name] = provider.provider_name;
    });
    return providers;
  } catch (error) {
    // console.log(error);
    providers = backupProviderAPIQueryStrings;
    return providers;
  }
}
