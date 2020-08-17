import { elements } from './base';
import { removeChildNodes } from '../utils';
// eslint-disable-next-line import/no-cycle
import { checkInternetConnection } from './searchModule';
import { activatePopup } from './infoPopupModule';

const Masonry = require('masonry-layout');

export const msnry = new Masonry(elements.gridBookmarks, {
  // options
  itemSelector: '.grid-item',
  columnWidth: '.grid-item',
  gutter: '.gutter-sizer',
  percentPosition: true,
  transitionDuration: '0',
});

export function removeBookmarkImages() {
  const div = document.createElement('div');
  div.classList.add('gutter-sizer');
  removeChildNodes(elements.gridBookmarks);
  elements.gridBookmarks.appendChild(div);
}

export function selectImage(event) {
  if (event.target.classList.contains('image-thumbnail')) {
    event.target.parentNode.classList.toggle('is-selected');
  }
}

export function openInfoPopup(event) {
  if (event.target.classList.contains('image-thumbnail')) {
    checkInternetConnection();
    activatePopup(event.target);
  }
}

export function toggleEditView() {
  elements.editBookmarksLink.classList.toggle('display-none');
  elements.selectAllBookmarksLink.classList.toggle('display-none');
  elements.closeEditViewLink.classList.toggle('display-none');

  elements.bookmarksSectionHead.classList.toggle('edit-view');
  elements.bookmarksSectionFooter.classList.toggle('display-none');

  const images = elements.gridBookmarks.getElementsByClassName('image');
  for (let i = 0; i < images.length; i += 1) {
    const image = images[i];

    if (window.appObject.bookmarksEditViewEnabled) {
      image.removeEventListener('click', openInfoPopup);
      image.addEventListener('click', selectImage);
    } else {
      image.removeEventListener('click', selectImage);
      image.addEventListener('click', openInfoPopup);
    }
  }
}

export function removeActiveClassFromNavLinks() {
  elements.navBookmarksLink.classList.remove('active');
  elements.navSourcesLink.classList.remove('active');
  elements.navSettingsLink.classList.remove('active');
}
