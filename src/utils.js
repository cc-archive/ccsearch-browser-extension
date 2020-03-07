import { backupProviderAPIQueryStrings } from './popup/helper';
import { elements } from './popup/base';

export function showModal(modalText, onModalConfirm, onModalClose) {
  const {
    modal,
    modalContent,
    modalCancel,
    modalClose,
    modalConfirm,
  } = elements;
  modalContent.innerText = modalText;
  modal.classList.remove('display-none');
  modalCancel.onclick = () => {
    onModalClose();
  };
  modalClose.onclick = () => {
    onModalClose();
  };
  modalConfirm.onclick = () => {
    onModalConfirm();
  };
}

export function showNotification(message, context, snackbarPlaceholderId, timeout) {
  const snackbar = document.getElementById(snackbarPlaceholderId);
  snackbar.innerText = message;

  snackbar.classList.add('show');
  if (context === 'positive') snackbar.classList.add('snackbar-positive');
  else if (context === 'negative') snackbar.classList.add('snackbar-negative');

  setTimeout(() => {
    snackbar.className = '';
    snackbar.classList.add('snackbar');
  }, timeout || 1100);
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
      initialInfoElement = `<p class="vocab paragraph inherit-colored initial-info primary__initial-info">
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
      initialInfoElement = `<p class="vocab paragraph inherit-colored negative-indicating initial-info bookmarks__initial-info">
              No Bookmarks yet
            </p>`;
    }
    const parser = new DOMParser();
    const parsed = parser.parseFromString(initialInfoElement, 'text/html');
    const tags = parsed.getElementsByTagName('p');

    sectionContent.querySelector('.row').appendChild(tags[0]);
  }
}

export async function fetchSources() {
  const getSourceURL = 'https://api.creativecommons.engineering/v1/sources';
  const data = await fetch(getSourceURL);
  // console.log(data);

  return data.json();
}

export async function getLatestSources() {
  let sources = {};
  try {
    const result = await fetchSources();
    result.forEach((source) => {
      sources[source.display_name] = source.source_name;
    });
    return sources;
  } catch (error) {
    showNotification('Unable to fetch sources. Using backup sources', 'negative', 'snackbar-bookmarks', 2500);
    sources = backupProviderAPIQueryStrings;
    return sources;
  }
}

export function removeChildNodes(targetNode) {
  while (targetNode.lastChild) {
    targetNode.removeChild(targetNode.lastChild);
  }
}
